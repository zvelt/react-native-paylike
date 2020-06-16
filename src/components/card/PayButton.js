import React from 'react';
import {StyleSheet, TouchableOpacity, Platform, Text, TextInput, View, ScrollView, Keyboard} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {format} from "../../currencies";
import {withToLocalizedMessage} from "../../utils";

const PAY = withToLocalizedMessage({
    displayStrings: {
        en: "PAY",
        ro: "PLĂTEȘTE",
    }
});

export default class PayButton extends React.Component {
    constructor(props) {
        super(props);
    }

    _onPay = () => {
        Keyboard.dismiss();
        this.props.onPay && this.props.onPay();
    }

    render() {
        const theme = this.props.theme;
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this._onPay}>
                    <LinearGradient colors={theme.buttonGradientColors} useAngle={true} angle={165} style={styles.button}>
                        <Text style={theme.buttonTextStyle}>
                            {PAY.toLocalizedStrings(this.props.locale)}
                        </Text>
                        <Text style={theme.buttonTextStyle}>
                            {format(this.props.amount, this.props.currency, this.props.locale)}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
        padding: 20,
        backgroundColor: '#459a42',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    }
});
