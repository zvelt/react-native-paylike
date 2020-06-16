export function deepFreeze(obj) {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
}

export function withToLocalizedMessage(obj) {
    return {
        ...obj,
        toLocalizedStrings: (iso639_1Code) => {
            const localizedMessages = obj.displayStrings && obj.displayStrings[iso639_1Code];
            if (!localizedMessages) return obj.displayStrings && obj.displayStrings['en'];
            return localizedMessages;
        }
    }
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const TOTAL = withToLocalizedMessage({
    displayStrings: {
        en: 'TOTAL',
        ro: 'TOTAL',
    }
});

export function createDisplayItem(amount, label) {
    return {
        amount,
        label
    }
}
