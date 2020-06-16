

import {parseCard} from "./card";
import {ErrorTypes, chainError } from "./errors";
import {validateAmountAndCurrency} from "./currencies";


export class Paylike {

    constructor(api) {
        this.api = api;

        if (this.api == null) {
            throw ErrorTypes.from(ErrorTypes.SDK_NOT_INITIALIZED);
        }
    }

    authorize = (paymentDetails)  => {
        if (!this.api) {
            throw ErrorTypes.from(ErrorTypes.SDK_NOT_INITIALIZED);
        }

        if (paymentDetails && paymentDetails.apple) {
            return this._authorizeApplePay(paymentDetails);
        }

        const sanitizedPaymentDetails = this._parseCardPaymentDetails(paymentDetails);
        return this.api.authorizeCard(sanitizedPaymentDetails);
    };

    _authorizeApplePay = (paymentDetails) => {
        return this.api.authorizeApplePay(paymentDetails);
    };

    _authorizeGooglePay = (paymentDetails) => {

    };

    /// TODO: sanitize all fields
    /// e.g. make a map of allowed keys
    /// and purge those invalid
    _parseCardPaymentDetails = (paymentDetails) => {
        let errors = null;
        const card = parseCard(paymentDetails.card);

        errors = chainError(errors, card.errors);
        errors = chainError(errors, this._validateAmount(paymentDetails && paymentDetails.amount,
                                                         paymentDetails && paymentDetails.currency));
        errors = chainError(errors, this._validateDescriptor(paymentDetails && paymentDetails.descriptor));

        if (errors) {
            throw errors;
        }

        return {
            ...paymentDetails,
            card: { // card input must be sanitize
                number: card.number,
                code: card.code,
                expiry: card.expiry,
            }
        }
    }

    _validateAmount = (amount, currency) => {
        return validateAmountAndCurrency(amount, currency);
    }

    // TODO:
    _validateDescriptor = (descriptor) => {
        return null;
    }
}
