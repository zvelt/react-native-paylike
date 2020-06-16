import {requireNativeComponent} from "react-native";
import React from "react";

class NativePaymentButton extends React.Component {
    render() {
        return <RNPNativePaymentButton {...this.props}/>
    }
}


var RNPNativePaymentButton = requireNativeComponent("RNPNativePaymentButton", NativePaymentButton);

module.exports = NativePaymentButton;
