import React from 'react';
import ThemedTextInput from "./ThemedTextInput";
import {ErrorTypes} from "../../errors";
import {TextInput, View, Text, StyleSheet} from "react-native";
import {withToLocalizedMessage} from "../../utils";
import Visa from "./visa";
import {CardType} from "../../card";
import Mastercard from "./mastercard";

const TITLE = withToLocalizedMessage({
        displayStrings: {
            en: "CARD NUMBER",
            ro: "NUMĂRUL CARDULUI",
        }
    });

class CardNumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            touched: false,
        }
    }

    _isErrored = () => {
        return !!this.props.errors[ErrorTypes.INVALID_CARD_NUMBER] && this.state.touched;
    }

    _onChangeText = (text) => {
        if (!this.state.touched) {
            this.setState({
                touched: true,
            });
        }

        this.props.onChangeCardNumber(text);
    }

    _getLogos = () => {
        if (this.props.cardBrand === CardType.VISA) {
            return <Visa style={styles.cardBrand}/>
        }
        if (this.props.cardBrand === CardType.MASTERCARD) {
            return <Mastercard style={styles.cardBrand}/>
        }

        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Visa style={{...styles.cardBrand, marginRight: 5,}}/>
                <Mastercard style={styles.cardBrand}/>
            </View>
        );
    }

    render() {
        return (
        <View style={styles.root}>
            <View
                style={{
                    flex: 1,
                }}>
                <ThemedTextInput theme={this.props.theme}
                                 ref={this.props.innerRef}
                                 value={this.props.value}
                                 onFocus={this.props.onFocus}
                                 onBlur={this.props.onBlur}
                                 onSubmitEditing={this.props.onSubmitEditing}
                                 onChangeText={this._onChangeText}

                                 error={this._isErrored()}
                                 title={TITLE.toLocalizedStrings(this.props.locale)}
                                 blurOnSubmit={false}
                                 returnKeyType={'done'}
                                 autoCorrect={false}
                                 autoCompleteType={'cc-number'}
                                 textContentType={'creditCardNumber'}
                                 keyboardType={'number-pad'}
                                 placeholder={'XXXX XXXX XXXX XXXX'}
                                 placeholderTextColor={this.props.theme.placeholderTextColor}
                />
            </View>
            {this._getLogos()}
        </View>
        );
    }
}

const styles= StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardBrand: {
        height: 17,
        width: 25,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    }
})
export default React.forwardRef((props, ref) => <CardNumberInput {...props} innerRef={ref}/>);
