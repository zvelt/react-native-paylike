import {deepFreeze, withToLocalizedMessage} from "./utils";

export function chainError(e1, e2) {
    if (e1 == null && e2 == null) return null;

    return {...e1, ...e2};
}

export const ErrorTypes = deepFreeze({
    // recoverable errors
    // prompt the user to fix invalid fields or
    // change the card in the payment flow
    INVALID_CARD_DETAILS: 'INVALID_CARD_DETAILS',
    INVALID_CARD_NUMBER: 'INVALID_CARD_NUMBER',
    INVALID_CSC: 'INVALID_CSC',
    INVALID_EXPIRY_DATE: 'INVALID_EXPIRY_DATE',
    CARD_EXPIRED: 'CARD_EXPIRED',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
    CARD_AMOUNT_LIMIT_EXCEEDED: 'CARD_AMOUNT_LIMIT_EXCEEDED',
    CARD_NOT_SUPPORTED: 'CARD_NOT_SUPPORTED',
    TDS_FAILED: 'TDS_FAILED',
    DECLINED_BY_CARDHOLDER_BANK: 'DECLINED_BY_CARDHOLDER_BANK',
    CARD_RESTRICTED: 'CARD_RESTRICTED',
    CARD_REJECTED: 'CARD_REJECTED',
    TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',

    // recoverable/unrecoverable
    // if the library is used in a terminal/mPOS environment, prompt the user to
    // fix the fields
    // if the library is an app environment, there's probably a bug
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_CURRENCY: 'INVALID_CURRENCY',
    INVALID_DESCRIPTOR: 'INVALID_DESCRIPTOR',

    // unrecoverable errors
    // there is nothing that the user can do in the payment flow
    // probably a bug in the merchant app
    MISSING_HTTPS: 'MISSING_HTTPS',
    MERCHANT_AMOUNT_EXCEEDED: 'MERCHANT_AMOUNT_EXCEEDED',
    INVALID_PUBLIC_KEY: 'INVALID_PUBLIC_KEY',
    MERCHANT_NOT_ALLOWED_TO_CREATE_TRX: 'MERCHANT_NOT_ALLOWED_TO_CREATE_TRX',
    MERCHANT_NOT_ALLOWED_TO_SAVE_CARDS: 'MERCHANT_NOT_ALLOWED_TO_SAVE_CARDS',
    INVALID_NATIVE_PAYMENT_DATA: 'INVALID_NATIVE_PAYMENT_DATA',
    NATIVE_PAYMENT_ERROR: 'NATIVE_PAYMENT_ERROR',

    // recoverable?
    UNKNOWN_GATEWAY_ERROR: 'UNKNOWN_GATEWAY_ERROR',

    // since AUTHORIZATION is not an idempotent API call,
    // it is advised to do a server side check if a transaction was
    // created or not before retrying, thus avoiding a double authorization.

    // E.G.: use a /transactions API call with before and after
    // set within reasonable time window
    NETWORK_ERROR: 'NETWORK_ERROR',
    SDK_NOT_INITIALIZED: 'SDK_NOT_INITIALIZED',

    UNKNOWN_ERROR: 'UNKNOWN_ERROR',

    from: (errorType) => {
        const error = Errors[errorType];
        return { [error.type]: error };
    }
});

const genericErrorMessages = {
    en: ["An error has occurred.", "Please try again or with another card. If the problem persists, please contact us."],
    ro: ["A intervenit o eroare.", "Încercați din nou sau cu un alt card. Dacă problema persistă, vă rugăm să ne contactați."],
}

export const Errors = Object.freeze({
    [ErrorTypes.INVALID_CARD_DETAILS]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_CARD_DETAILS,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Invalid card.", "Please check all card details. If the problem persists, please contact your bank."],
            ro: ["Card invalid.", "Vă rugăm să verificați validitatea cardului. Dacă problema persistă, contactați banca dvs."],
        },
    }),
    [ErrorTypes.INVALID_CARD_NUMBER]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_CARD_NUMBER,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Invalid card number.", "Please check the card number. If the problem persists, please contact your bank."],
            ro: ["Numărul cardului invalid.", "Vă rugăm să verificați numărul cardului. Dacă problema persistă, contactați banca dvs."],
        },
    }),
    [ErrorTypes.INVALID_CSC]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_CSC,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Invalid CVC (security code).", "Please check the CVC (security code), typically found on the back of your card. If the problem persists, please contact your bank."],
            ro: ["Cod CVC invalid (codul de siguranță).", "Vă rugăm să verificați codul CVC. De obicei se găsește pe spatele cardului ca fiind un număr format din 3 cifre."],
        },
    }),
    [ErrorTypes.INVALID_EXPIRY_DATE]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_EXPIRY_DATE,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Invalid expiry date.", "Please check that the expiry month and year is correct and not overdue. If the problem persists, please contact your bank."],
            ro: ["Data de expirare invalidă.", "Vă rugăm să verificați ca data de expirare a cardului să fie corectă."],
        },
    }),
    [ErrorTypes.CARD_EXPIRED]: withToLocalizedMessage({
        type: ErrorTypes.CARD_EXPIRED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["The card has expired.", "Your card has expired. Please try another one."],
            ro: ["Cardul este expirat.", "Încercați cu un card diferit."],
        },
    }),
    [ErrorTypes.INSUFFICIENT_FUNDS]: withToLocalizedMessage({
        type: ErrorTypes.INSUFFICIENT_FUNDS,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Insufficient funds.", "There are not enough funds available to cover the purchase. Please try another card or add funds to your account. If the problem persists, please contact your bank."],
            ro: ["Fonduri insuficiente.", "Nu există fonduri suficiente pentru a efectua tranzacția. Încercați cu un card diferit."],
        },
    }),
    [ErrorTypes.CARD_AMOUNT_LIMIT_EXCEEDED]: withToLocalizedMessage({
        type: ErrorTypes.CARD_AMOUNT_LIMIT_EXCEEDED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Card amount limit exceeded.", "The amount limit on your card has been reached. Please contact your bank to reset or increase the limit."],
            ro: ["Suma limită de tranzacții a cardului a fost atinsă", "Vă rugăm să contactați banca dvs. să reseteze sau să mărească limita."],
        }
    }),
    [ErrorTypes.CARD_NOT_SUPPORTED]: withToLocalizedMessage({
        type: ErrorTypes.CARD_NOT_SUPPORTED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["Invalid card number or card not supported.", "The card number is incorrect or the card brand is not supported."],
            ro: ["Cardul este invalid sau nu este suportat.", "Card invalid sau tipul de card nu este suportat. Încercați cu alt card."],
        }
    }),
    [ErrorTypes.TDS_FAILED]: withToLocalizedMessage({
        type: ErrorTypes.TDS_FAILED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["3D Secure authentication failed or your card does not support 3D secure.", "If the problem persists, please contact your bank."],
            ro: ["Autentificarea 3D Secure a eșuat sau cardul dvs. nu suportă 3D secure.", "Dacă problema persistă, vă rugăm contactați banca dvs."],
        }
    }),
    [ErrorTypes.DECLINED_BY_CARDHOLDER_BANK]: withToLocalizedMessage({
        type: ErrorTypes.DECLINED_BY_CARDHOLDER_BANK,
        client: true,
        merchant: false,
        displayStrings: {
            ...genericErrorMessages,
        }
    }),
    [ErrorTypes.CARD_RESTRICTED]: withToLocalizedMessage({
        type: ErrorTypes.CARD_RESTRICTED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["The card is restricted", "This card is restricted, please contact your bank for further information."],
            ro: ["Cardul este restricționat", "Vă rugăm să contactați banca dvs. pentru mai multe detalii."],
        }
    }),
    [ErrorTypes.CARD_REJECTED]: withToLocalizedMessage({
        type: ErrorTypes.CARD_REJECTED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["The card was rejected.", "The card has been rejected by your bank. Please contact your bank."],
            ro: ["Cardul a fost refuzat.", "Cardul a fost refuzat de către banca emitentă. Contactați banca dvs."],
        }
    }),
    [ErrorTypes.TRANSACTION_REJECTED]: withToLocalizedMessage({
        type: ErrorTypes.TRANSACTION_REJECTED,
        client: true,
        merchant: false,
        displayStrings: {
            en: ["The transaction was rejected."],
            ro: ["Tranzacția a fost refuzată."]
        }
    }),

    [ErrorTypes.INVALID_AMOUNT]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_AMOUNT,
        client: true,
        merchant: true,
        displayStrings: {
            en: ["Invalid amount.", "Please contact us"],
            ro: ["Sumă invalidă.", "Vă rugăm să ne contactați"]
        }
    }),
    [ErrorTypes.INVALID_CURRENCY]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_CURRENCY,
        client: true,
        merchant: true,
        displayStrings: {
            en: ["Invalid currency.", "Please contact us"],
            ro: ["Monedă invalidă.", "Vă rugăm să ne contactați"]
        }
    }),
    [ErrorTypes.INVALID_DESCRIPTOR]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_DESCRIPTOR,
        client: true,
        merchant: true,
        displayStrings: {
            en: ["Invalid descriptor.", "please contact us"],
            ro: ["Descriptor invalid.", "vă rugăm să ne contactați"],
        }
    }),

    [ErrorTypes.MISSING_HTTPS]: withToLocalizedMessage({
        type: ErrorTypes.MISSING_HTTPS,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.MERCHANT_AMOUNT_EXCEEDED]: withToLocalizedMessage({
        type: ErrorTypes.MERCHANT_AMOUNT_EXCEEDED,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.INVALID_PUBLIC_KEY]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_PUBLIC_KEY,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.MERCHANT_NOT_ALLOWED_TO_CREATE_TRX]: withToLocalizedMessage({
        type: ErrorTypes.MERCHANT_NOT_ALLOWED_TO_CREATE_TRX,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.MERCHANT_NOT_ALLOWED_TO_SAVE_CARDS]: withToLocalizedMessage({
        type: ErrorTypes.MERCHANT_NOT_ALLOWED_TO_SAVE_CARDS,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.INVALID_NATIVE_PAYMENT_DATA]: withToLocalizedMessage({
        type: ErrorTypes.INVALID_NATIVE_PAYMENT_DATA,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.NATIVE_PAYMENT_ERROR]: withToLocalizedMessage({
       type: ErrorTypes.NATIVE_PAYMENT_ERROR,
       client: false,
       merchant: true,
    }),
    [ErrorTypes.UNKNOWN_GATEWAY_ERROR]: withToLocalizedMessage({
        type: ErrorTypes.UNKNOWN_GATEWAY_ERROR,
        client: false,
        merchant: true,
        displayStrings:  {
            ...genericErrorMessages,
        }
    }),


    [ErrorTypes.NETWORK_ERROR]: withToLocalizedMessage({
        type: ErrorTypes.NETWORK_ERROR,
        client: false,
        merchant: true,
    }),
    [ErrorTypes.SDK_NOT_INITIALIZED]: withToLocalizedMessage({
        type: ErrorTypes.SDK_NOT_INITIALIZED,
        client: false,
        merchant: true,
    }),

    [null]: withToLocalizedMessage({
        type: ErrorTypes.UNKNOWN_ERROR,
        client: false,
        merchant: true,
    }),
    [undefined]: withToLocalizedMessage({
        type: ErrorTypes.UNKNOWN_ERROR,
        client: false,
        merchant: true,
    }),
});
