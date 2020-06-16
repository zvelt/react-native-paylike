const CARD_GATEWAY_LINK = 'https://gateway.paylike.io/transactions';
const APPLE_PAY_GATEWAY_LINK = 'https://ap-gateway.paylike.io/';
import { ErrorTypes } from "./errors";


function toOurErrors(code) {

    const gatewayToLibraryErrors = {
        2: ErrorTypes.INVALID_CARD_DETAILS,
        3: ErrorTypes.INVALID_CARD_NUMBER,
        4: ErrorTypes.INVALID_CSC,
        5: ErrorTypes.INVALID_EXPIRY_DATE,
        6: ErrorTypes.CARD_EXPIRED,
        7: ErrorTypes.INSUFFICIENT_FUNDS,
        17: ErrorTypes.INVALID_CARD_NUMBER,
        18: ErrorTypes.INVALID_EXPIRY_DATE,
        19: ErrorTypes.INVALID_EXPIRY_DATE,
        20: ErrorTypes.INVALID_CSC,
        25: ErrorTypes.CARD_AMOUNT_LIMIT_EXCEEDED,
        29: ErrorTypes.CARD_NOT_SUPPORTED,

        15: ErrorTypes.INVALID_AMOUNT,
        14: ErrorTypes.INVALID_AMOUNT,
        16: ErrorTypes.INVALID_CURRENCY,
        1: ErrorTypes.INVALID_CURRENCY,

        // 30 not an error
        31: ErrorTypes.TDS_FAILED,
        32: ErrorTypes.TDS_FAILED,
        13: ErrorTypes.INVALID_DESCRIPTOR,
        21: ErrorTypes.MISSING_HTTPS,
        22: ErrorTypes.MERCHANT_AMOUNT_EXCEEDED,
        26: ErrorTypes.INVALID_PUBLIC_KEY,
        27: ErrorTypes.MERCHANT_NOT_ALLOWED_TO_CREATE_TRX,
        28: ErrorTypes.MERCHANT_NOT_ALLOWED_TO_SAVE_CARDS,
        8: ErrorTypes.DECLINED_BY_CARDHOLDER_BANK,
        9: ErrorTypes.CARD_RESTRICTED,
        10: ErrorTypes.CARD_REJECTED,
        11: ErrorTypes.TRANSACTION_REJECTED,
        12: ErrorTypes.UNKNOWN_GATEWAY_ERROR,
    };

    return ErrorTypes.from(gatewayToLibraryErrors[code]);
}

async function handleAuthorization(httpResponse) {
    let authorizationResult = null;
    try {
        authorizationResult = await httpResponse.json();
    } catch (e) {
    }

    if (!httpResponse.ok && authorizationResult) {
        // 3DS is not an error
        if (authorizationResult.code === 30) return {tds: authorizationResult.tds};

        throw toOurErrors(authorizationResult && authorizationResult.code);
    }

    if (httpResponse.status === 500) {
        throw ErrorTypes.from(ErrorTypes.UNKNOWN_ERROR);
    }

    // request may have resolved but no content found.
    // this may be a network error since the gateway does not return empty response bodies
    if (httpResponse.status !== 204 && authorizationResult === null) {
        throw ErrorTypes.from(ErrorTypes.NETWORK_ERROR);
    }

    return authorizationResult;
}

export default class Api {
    constructor(key) {
        this.key = key;
    }

    authorizeCard = (paymentDetails) => {
        const body = JSON.stringify({key: this.key, ...paymentDetails});
        return fetch(CARD_GATEWAY_LINK, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(handleAuthorization,
            (e) => {
            throw ErrorTypes.from(ErrorTypes.NETWORK_ERROR);
        });
    };

    authorizeApplePay = (paymentDetails) => {
        const body = JSON.stringify({key: this.key, ...paymentDetails});
        return fetch(APPLE_PAY_GATEWAY_LINK, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(handleAuthorization,
            (e) => {throw ErrorTypes.from(ErrorTypes.NETWORK_ERROR); });
    };

    // TODO:
    authorizeGooglePay = (key, paymentDetails) => {

    }
}
