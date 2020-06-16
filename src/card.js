import CreditCards from "creditcards";
import { ErrorTypes, chainError } from "./errors";


export const CardType = {
    MASTERCARD: 'MASTERCARD',
    VISA: 'VISA',

    UNKNOWN: 'UNKNOWN',
    [null]: 'UNKNOWN',
    [undefined]: 'UNKNOWN',
};

function toOurCardType(libCardType) {

    const toCardType = {
        'Visa': CardType.VISA,
        'Mastercard': CardType.MASTERCARD,
        'Maestro': CardType.MASTERCARD,
    };

    return CardType[toCardType[libCardType]];
}

function isExpiryInvalid(expiry) {
    if (!expiry) return null;


    const parsedMonth = CreditCards.expiration.month.parse(expiry.month);
    const parsedYear = CreditCards.expiration.year.parse(expiry.year, true);

    if (parsedMonth == null  || parsedYear == null) return true;
    return CreditCards.expiration.isPast(parsedMonth, parsedYear) ? true : null;
}

function isCardInvalid(parsedNumber, libCardType) {
    return !CreditCards.card.isValid(parsedNumber, libCardType) ? true : null;
}

function isCodeInvalid(code, libCardType) {
    return !CreditCards.cvc.isValid(code, libCardType) ? true : null;
}


// TODO: abstract out the CreditCards library
// TODO: in case we want to change it.
export function parseCard({number, code, expiry}) {
    const parsedNumber = CreditCards.card.parse(number);
    const libCardType = CreditCards.card.type(parsedNumber, true);


    let errors = null;
    errors = chainError(errors, isCardInvalid(parsedNumber, libCardType) && ErrorTypes.from(ErrorTypes.INVALID_CARD_NUMBER));
    errors = chainError(errors, isExpiryInvalid(expiry) && ErrorTypes.from(ErrorTypes.INVALID_EXPIRY_DATE));
    errors = chainError(errors, isCodeInvalid(code, libCardType) && ErrorTypes.from(ErrorTypes.INVALID_CSC));

    return {
        type: toOurCardType(libCardType),
        number: parsedNumber,
        formattedNumber: CreditCards.card.format(parsedNumber),
        code: code,
        expiry: expiry,
        errors: errors
    };
}
