import React from 'react';
import {Text, View} from 'react-native';
import {ErrorTypes} from "../../errors";
import CardNumberInput from "./CardNumberInput";
import CardExpiryInput from "./CardExpiryInput";
import CardCVVInput from "./CardCVVInput";

const TextFields = {
    CARD_NUMBER: 'CARD_NUMBER',
    MONTH_YEAR: 'MONTH_YEAR',
    CVV: 'CVV',
};

export default class CardDetailsCollector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            card: {
                number: '',
                code: '',
                expiry: {month: '', year: ''},
                type: '',
            },
            focusedField: '',
            errors: {},
        }
        this.cardDetailsRef = React.createRef();
        this.expiryTextInputRef = React.createRef();
        this.cvvTextInputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errors !== this.props.errors) {
            this.setState({
                errors: this.props.errors,
            });
        }
    }

    /** UI & STYLE **/

    _displayUpstreamErrors = () => {
        const priorityError =   this.state.errors && (
                                this.state.errors[ErrorTypes.INVALID_CARD_NUMBER]
                             || this.state.errors[ErrorTypes.INVALID_EXPIRY_DATE]
                             || this.state.errors[ErrorTypes.INVALID_CSC]);

        if (priorityError) {
            return (
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <Text style={this.props.theme.errorTextStyle}>{priorityError.toLocalizedStrings(this.props.locale)[0]}</Text>
                </View>
            );
        }

        return this.state.errors && Object.keys(this.state.errors).map(k => {
            const errorsStrings = this.state.errors[k].toLocalizedStrings(this.props.locale);

            return (
                <View style={{display: 'flex', justifyContent: 'center'}}>
                    <Text style={this.props.theme.errorTextStyle}>{errorsStrings[0] + ' ' + (errorsStrings[1] ? errorsStrings[1] : '')}</Text>
                </View>
            );
        });
    }

    /** EVENT HANDLERS **/

    _onSubmitEditing = () => {
        switch(this.state.focusedField) {
            case TextFields.CARD_NUMBER:
                this.expiryTextInputRef.current.focus();
                return;
            case TextFields.MONTH_YEAR:
                this.cvvTextInputRef.current.focus();
                return;
            case TextFields.CVV:
                this.cvvTextInputRef.current.blur();
                return;
            default:
                return;
        }
    }

    _onFocus = (textField) => () => {
        this._clearError(textField);
        this.setState({focusedField: textField});
    }

    _onBlur = (textField)  => () => {
        this.setState({focusedField: ''});
    }

    _onCardNumberChange = (text) => {
        const cardDetails = this.props.onCardDetailsChanged({...this.state.card, number: text});
        this._setCardDetails(cardDetails);
    }

    _onExpiryDateChange = (expiry) => {
        const cardDetails = this.props.onCardDetailsChanged({...this.state.card, expiry: expiry});
        this._setCardDetails({...cardDetails});
    }

    _onCVVChange = (text) => {
        const cardDetails = this.props.onCardDetailsChanged({...this.state.card, code: text});
        this._setCardDetails(cardDetails);
    }

    /** GETTERS/SETTERS  **/

    _clearError = (textField) => {
        const errors = this.state.errors;
        switch(textField) {
            case TextFields.CARD_NUMBER:
                delete errors[ErrorTypes.INVALID_CARD_NUMBER];
                break;
            case TextFields.MONTH_YEAR:
                delete errors[ErrorTypes.INVALID_EXPIRY_DATE];
                break;
            case TextFields.CVV:
                delete errors[ErrorTypes.INVALID_CSC];
                break;
            default:
                return;
        }
        this.setState({errors: errors});
    }

    _setCardDetails = (cardDetails) => {
        this.setState({card:{...this.state.card, ...cardDetails, number: cardDetails.formattedNumber}});
    }

    _getCardNumber = () => {
        return this.state.card.number;
    }

    _getCVV = () => {
        return this.state.card.code;
    }

    _getExpiryMonthAndYear = () => {
        return this.state.card.expiry;
    }

    _isFocused = (textField) => {
        return this.state.focusedField === textField;
    }

    _getErrors = () => {
        return {...this.state.card.errors, ...this.props.errors};
    }

    render() {
        const theme = this.props.theme;
        return (
            <View style={this.props.style}>
                <View>
                    <CardNumberInput
                        theme={theme}
                        locale={this.props.locale}
                        errors={this._getErrors()}
                        ref={this.cardDetailsRef}
                        onSubmitEditing={this._onSubmitEditing}
                        onChangeCardNumber={this._onCardNumberChange}
                        cardBrand={this.state.card.type}
                        value={this._getCardNumber()}
                        onFocus={this._onFocus(TextFields.CARD_NUMBER)}
                        onBlur={this._onBlur(TextFields.CARD_NUMBER)}
                    />
                  </View>
                <View style={{padding: 5}}/>
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <CardExpiryInput
                            theme={theme}
                            locale={this.props.locale}
                            errors={this._getErrors()}
                            ref={this.expiryTextInputRef}
                            onSubmitEditing={this._onSubmitEditing}
                            onChangeExpiryDate={this._onExpiryDateChange}
                            value={this._getExpiryMonthAndYear()}
                            onFocus={this._onFocus(TextFields.MONTH_YEAR)}
                            onBlur={this._onBlur(TextFields.MONTH_YEAR)}
                        />
                        <CardCVVInput
                            theme={theme}
                               ref={this.cvvTextInputRef}
                               locale={this.props.locale}
                               errors={this._getErrors()}
                               onSubmitEditing={this._onSubmitEditing}
                               onChangeCVV={this._onCVVChange}
                               value={this._getCVV()}
                               onFocus={this._onFocus(TextFields.CVV)}
                               onBlur={this._onBlur(TextFields.CVV)}
                       />
                    </View>
                </View>
                {this._displayUpstreamErrors()}
            </View>
        )
    }
}
