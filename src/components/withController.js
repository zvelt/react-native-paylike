import React, {Component} from "react";
import {deepFreeze, sleep} from "../utils";
import {ErrorTypes} from "../errors";
import TdsDropIn from "./TdsDropIn";

export const PaymentControllerState = deepFreeze({
    IDLE: 'IDLE',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',

    TDS: 'TDS',
});

export default function withController(Component) {

    return class ControlledPaymentComponent extends React.Component {
        constructor(props) {
            super(props);

            // we don't want to trigger a rerender
            // when updating these values
            this.paymentState = PaymentControllerState.IDLE;
            this.isCanceled = false;
            this.retries = 0;
            this.paymentDetails = null;
            this.tds = null;

            // this needs to be passed to controlled component
            // in order to update the UI
            this.state = {
                paymentState: this.paymentState,
                errors: null,
                result: null,
            };
        }

        componentWillUnmount() {
            this.isCanceled = true;
        }

        onAuthorizePayment = async (paymentDetails) => {
            if (this._isAnotherTransactionAuthorizing()) {
                return;
            }
            this._pendingAuthorization();
            await this._authorize(paymentDetails);
        }

        onUICancel = () => {
            this.isCanceled = true;
            if (!this._isAnotherTransactionAuthorizing()) {
                this._cancel();
            }
        }

        onUIError = (error) => {
            this.isCanceled = true;
            if (!this._isAnotherTransactionAuthorizing()) {
                this._error(error);
            }
        }

        _setPaymentState = (paymentState, errors, result) => {
            this.paymentState = paymentState;
            this.setState({
                paymentState,
                errors,
                result,
            });
        }

        _isAnotherTransactionAuthorizing = () => {
            return this.paymentState !== PaymentControllerState.IDLE;
        }

        _pendingAuthorization = () => {
            if (this.paymentState === PaymentControllerState.IDLE) {
                this._setPaymentState(PaymentControllerState.PENDING);
            }
        }

        _success = (result) => {
            if (this.paymentState === PaymentControllerState.PENDING) {
                this._setPaymentState(PaymentControllerState.SUCCESS, null, result);
            }
        }

        _error = (error) => {
            if (this.paymentState === PaymentControllerState.PENDING) {
                this._setPaymentState(PaymentControllerState.ERROR, error, null);
            }
        }

        _cancel = (result) => {
            this._setPaymentState(PaymentControllerState.CANCELED, null, result);
        }

        _idle = (errors) => {
            if (this.paymentState === PaymentControllerState.PENDING ||
                this.paymentState === PaymentControllerState.TDS) {
                this._setPaymentState(PaymentControllerState.IDLE, errors, null);
            }
        }

        _init3DSFlow = (paymentDetails, tds) => {
            this.paymentDetails = paymentDetails;
            this.tds = tds;
            this._setPaymentState(PaymentControllerState.TDS);
        }

        _on3DSDone = async (pares) => {
            const paymentDetails = this.paymentDetails;

            // clear payment details and tds
            this.paymentDetails = null;
            this.tds = null;

            this._setPaymentState(PaymentControllerState.PENDING);
            await this._authorize({...paymentDetails, tds: {pares}});
        }

        _on3DSFailed = () => {
            this._idle(ErrorTypes.from(ErrorTypes.TDS_FAILED));
        }

        _on3DSCanceled = () => {
            this._idle();
        }

        _areClientRelated = (errors) => {
            return Object.keys(errors).length > 0 && Object.keys(errors).map(k => {
                return !errors[k].merchant && errors[k].client
            }).reduce((previousValue, currentValue) => {return previousValue && currentValue;}, true);
        }

        _shouldRetry = (errors) => {
            const areErrorsRetryable = errors && (errors[ErrorTypes.NETWORK_ERROR] ||
                                                  errors[ErrorTypes.UNKNOWN_GATEWAY_ERROR]);
            const hasRetriesLeft = this.retries < 3;

            const hasIsTransactionAlreadyMade = this.props.isTransactionAlreadyMade != null;

            if (areErrorsRetryable && hasRetriesLeft && hasIsTransactionAlreadyMade) {
                this.retries++;
                return true;
            }

            return false;
        }

        _authorize = async (paymentDetails) => {
            const continueWithAuthorization = await this.props.shouldContinueWithAuthorization();
            if (!continueWithAuthorization || this.isCanceled) {
                this._cancel();
                return;
            }

            try {
                const result = await this.props.paylike.authorize(paymentDetails);
                if (this.isCanceled) {
                    this._cancel(result.tds ? null : result);
                }

                if (result.tds) {
                    this._init3DSFlow(paymentDetails, result.tds);
                } else {
                    this._success(result);
                }
            } catch (errors) {
                if (this._areClientRelated(errors)) {
                    this._idle(errors);
                    return;
                }

                if (this._shouldRetry(errors)) {
                    if (await this.props.isTransactionAlreadyMade()) {
                        this._success();
                        return;
                    } else {
                        await sleep(this.retries * 500);
                        await this._authorize(paymentDetails);
                        return;
                    }
                }

                this._error(errors);
            }
        }

        render() {
            return (
                <React.Fragment>
                    <Component
                       onAuthorizePayment={this.onAuthorizePayment}
                       state={this.state.paymentState}
                       errors={this.state.errors}
                       result={this.state.result}
                       {...this.props}
                       cancel={this.onUICancel}
                       error={this.onUIError}
                    >
                        {this.props.children}
                    </Component>
                    {this.state.paymentState === PaymentControllerState.TDS &&
                    <TdsDropIn
                        tds={this.tds}
                        on3DSDone={this._on3DSDone}
                        on3DSCanceled={this._on3DSCanceled}
                        on3DSFailed={this._on3DSFailed}
                    />
                    }
                </React.Fragment>
            );
        }
    }
}
