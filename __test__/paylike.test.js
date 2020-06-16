import {parseCard} from "../src/card";
import {Paylike} from "../src/paylike";

import { Platform } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform');
    Platform.OS = 'android';
    return Platform;
});

test('card', () => {
    const card = parseCard({number:'4100 0000 0000 0001', code: '250', expiry:{month: '09', year: 2021}});
    expect(card.errors).toBe(null);
    console.log(card);
});


test('call', () => {
    const paylike = new Paylike({
        authorizeCard: (paymentRequest) => {
            return Promise.resolve({transaction: {id: 'bla'}});
        }
    });
    const success = (transaction) => {
        expect(transaction.id).toBe('bla');
    };
    paylike.authorize({
        currency: 'RON',
	    amount: 1,
        card : {
            number: "4100000000000001",
            expiry: { year: "2020", month: "09"},
            code: "123"
        },
	    custom: {
		tripId: "8bb1d0ac-a61e-48c3-a8f9-7262dd7a9422",
        clientId: "56127354-64a7-49f7-b17a-8be6d9f660f1"
	    }
    }).then(success);
});
