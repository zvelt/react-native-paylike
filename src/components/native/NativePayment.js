import React, {Component} from "react";
import {NativeModules, NativeEventEmitter, View} from "react-native";
import withController, {PaymentControllerState} from "../withController";
import {ErrorTypes} from "../../errors";
import {toMajor} from "../../currencies";

let RNPNativePayment = NativeModules.RNPNativePayment;
// TODO: PSP specific
const options = {
    supportedNetworks: ['Visa', 'MasterCard'],
    countryCode: 'DK',
};

export const canMakeNativePayments = () => {
    return RNPNativePayment.canMakePayments;
}

class NativePaymentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.paymentRequest = {
            ...this.props.paymentRequest
        };
        this.transformedPaymentRequest = this._adjustCurrencyForNativePayment(this.props.paymentRequest);

        const nativePaymentEmitter = new NativeEventEmitter(RNPNativePayment);
        this.paymentAuthorizedSubscription = nativePaymentEmitter.addListener("paymentAuthorized", this._paymentAuthorized);
        this.paymentDismissedSubscription = nativePaymentEmitter.addListener("paymentDismissed", this._paymentDismissed);
        this.paymentErrorSubscription = nativePaymentEmitter.addListener("paymentError", this._paymentError);
        RNPNativePayment && RNPNativePayment.show(
            this.transformedPaymentRequest,
            {...options, merchantId: this.props.merchantId},
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const isIdle = (prevProps.state !== PaymentControllerState.IDLE) && (this.props.state === PaymentControllerState.IDLE);
        const isSuccess = (prevProps.state !== PaymentControllerState.SUCCESS) && (this.props.state === PaymentControllerState.SUCCESS);
        const isError = (prevProps.state !== PaymentControllerState.ERROR) && (this.props.state === PaymentControllerState.ERROR);
        const isCanceled = (prevProps.state !== PaymentControllerState.CANCELED) && (this.props.state === PaymentControllerState.CANCELED);

        if (isSuccess) {
            RNPNativePayment.doneWithResult("success");
            this.props.onSuccess(this.props.result);
            return;
        }

        if (isError) {
            RNPNativePayment.doneWithResult("error");
            this.props.onError(this.props.errors);
            return;
        }

        if (isCanceled) {
            this.props.onCancel(this.props.result);
            return;
        }

        if (isIdle && this.props.errors != null) {
            // The ViewController must be dismissed
            RNPNativePayment.doneWithResult("error");
            this.props.onError(this.props.errors);
        }

    }

    componentWillUnmount() {
        this.paymentAuthorizedSubscription.remove();
        this.paymentDismissedSubscription.remove();
        this.paymentErrorSubscription.remove();
    }

    _paymentAuthorized = (result) => {
        this.props.onAuthorizePayment({
            amount: this.paymentRequest.amount,
            currency: this.paymentRequest.currency,
            custom: this.paymentRequest.custom,
            descriptor: this.paymentRequest.descriptor,
            apple: JSON.stringify(result.paymentData),
        });
    }

    _paymentDismissed = () => {
        if (this.props.state === PaymentControllerState.IDLE ||
            this.props.state === PaymentControllerState.PENDING) {
            this.props.cancel();
        }
    }

    _paymentError = () => {
        this.props.error(ErrorTypes.from(ErrorTypes.NATIVE_PAYMENT_ERROR));
    }

    _adjustCurrencyForNativePayment = (paymentRequest) => {
        let tPaymentRequest = {...paymentRequest};
        tPaymentRequest.amount = `${toMajor(paymentRequest.amount, paymentRequest.currency)}`;
        tPaymentRequest.displayItems = tPaymentRequest.displayItems &&
            tPaymentRequest.displayItems.map(item => {
                let newIt = {...item};
                newIt.amount = `${toMajor(newIt.amount, paymentRequest.currency)}`;
                return newIt;
            });

        return tPaymentRequest;
    }


    render() {
        return (<View/>)
    }
}

export const NativePayment = withController(NativePaymentComponent);
