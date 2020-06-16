import React from "react";
import ThemedTextInput from "./ThemedTextInput";
import {withToLocalizedMessage} from "../../utils";
import {ErrorTypes} from "../../errors";


const TITLE = withToLocalizedMessage({
    displayStrings: {
        en: "EXPIRY DATE",
        ro: "EXP. LUNĂ/AN",
    }
});

const PLACEHOLDER = withToLocalizedMessage({
    displayStrings: {
        en: "MM/YY",
        ro: "LL/AA",
    }
});

class CardExpiryInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            touched: false,
        }
    }

    _isErrored = () => {
        return !!this.props.errors[ErrorTypes.INVALID_EXPIRY_DATE] && this.state.touched;
    }

    _onChangeText = (text) => {
        if (!this.state.touched) {
            this.setState({
                touched: true,
            });
        }

        if (text[text.length - 1] === '/') text = text.slice(0, text.length-1);

        const arr = text.split('/');
        const expiry = {month: arr[0] || '', year: arr[1] || ''};

        while (parseInt(expiry.month) > 12) {
            expiry.year = expiry.month[expiry.month.length - 1] + expiry.year;
            expiry.month = expiry.month.slice(0, expiry.month.length - 1);
            if (expiry.month.length === 1) expiry.month = '0' + expiry.month;
        }

        if (expiry.year.length > 2) {
            return;
        }

        this.props.onChangeExpiryDate(expiry);
    }

    _getValue = () => {
        const expiry = this.props.value;

        let expiryString = expiry.month;
        if (expiry.year) expiryString += '/' + expiry.year;

        return expiryString;
    }

    render() {
        return <ThemedTextInput
             theme={this.props.theme}
             ref={this.props.innerRef}
             value={this._getValue()}
             onFocus={this.props.onFocus}
             onBlur={this.props.onBlur}
             onSubmitEditing={this.props.onSubmitEditing}
             onChangeText={this._onChangeText}

             error={this._isErrored()}
             title={TITLE.toLocalizedStrings(this.props.locale)}
             blurOnSubmit={false}
             returnKeyType={'done'}
             autoCorrect={false}
             keyboardType={'number-pad'}
             placeholder={PLACEHOLDER.toLocalizedStrings(this.props.locale)}
             placeholderTextColor={this.props.theme.placeholderTextColor}
        />
    }
}

export default React.forwardRef((props, ref) => <CardExpiryInput {...props} innerRef={ref}/>);
