import currencyData from "./currency_data.json";
import {Platform} from "react-native";
import {chainError, ErrorTypes} from "./errors";

let currencyMap = {};

if (currencyData) {
    currencyData.forEach(currency => {
        currencyMap[currency.code] = currency;
    });
}

export function getCurrency(iso_4217_code) {
    return currencyMap[iso_4217_code];
}

const minor = (major, exponent) => Math.round(major * Math.pow(10, exponent));

const major = (minor, exponent) => minor / Math.pow(10, exponent);

export const changeExponent = (minor, source, target) => minor(major(minor, source), target);

export const toMajor = (minor, iso_4217_code) => {
    const currency = getCurrency(iso_4217_code);
    if (!currency) {
        console.log('No currency found.');
        return '';
    }

    return major(minor, currency.exponent);
}

export const toMinor = (major, iso_4217_code) => {
    const currency = getCurrency(iso_4217_code);
    if (!currency) {
        console.log('No currency found.');
        return '';
    }

    return minor(major, currency.exponent);
}

function isAmountInvalid(amount) {
    return (amount == null || isNaN(amount) || amount < 0) ? true : null;
}

function isCurrencyInvalid(iso_4217_code) {
    return (getCurrency(iso_4217_code) == null) ? true : null;
}

export function validateAmountAndCurrency(minor, iso_4217_code) {
    let errors = null;
    const amount = parseInt(minor);
    errors = chainError(errors, isAmountInvalid(amount) && ErrorTypes.from(ErrorTypes.INVALID_AMOUNT));
    errors = chainError(errors, isCurrencyInvalid(iso_4217_code) && ErrorTypes.from(ErrorTypes.INVALID_CURRENCY));

    return errors;
}

export function format(minor, iso_4217_code, locale) {
    const major = toMajor(minor, iso_4217_code);
    if (isNaN(major)) {
        console.log('Result is not a number');
        return '';
    }

    if (Platform.OS === 'ios') {
        return major.toLocaleString(locale, {
            style: 'currency',
            currency: iso_4217_code,
        });
    } else {
        // TODO: Android JSC does not support toLocaleString
        // TODO: There is a version of JSC that has it, but we can't assume that the consuming app
        // TODO: will use that version
        return `${major} ${iso_4217_code}`;
    }
}
