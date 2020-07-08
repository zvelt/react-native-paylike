import {Paylike as PaylikeLib} from './src/paylike';
import Api from './src/api';
import {CardDropIn} from "./src/components/card/CardDropIn";
import {NativePayment, canMakeNativePayments} from "./src/components/native/NativePayment";
import NativePaymentButton from "./src/components/native/NativePaymentButton";
import withController from "./src/components/withController";
import {Errors, ErrorTypes} from "./src/errors";
import {createDisplayItem} from "./src/utils";

const Paylike = (publicKey) => {
    return new PaylikeLib(new Api(publicKey));
}

export {
    Paylike, // Paylike lib for making payments
    CardDropIn, // CardDropIn
    NativePayment, // NativePayment
    NativePaymentButton,
    canMakeNativePayments,
    withController, // a controller for DIY UI
    ErrorTypes,
    Errors,
    createDisplayItem
};

