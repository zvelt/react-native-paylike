import React from "react";
import ThemedTextInput from "./ThemedTextInput";
import {ErrorTypes} from "../../errors";

class CardCVVInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            touched: false,
        }
    }

    _isErrored = () => {
        return !!this.props.errors[ErrorTypes.INVALID_CSC] && this.state.touched;
    }

    _onChangeText = (text) => {
        if (text.length > 0 && (isNaN(parseInt(text)) || text[text.length-1] === '-')) {
            return;
        }

        if (!this.state.touched) {
            this.setState({
                touched: true,
            });
        }
        this.props.onChangeCVV && this.props.onChangeCVV(text);
    }
    render() {
        return <ThemedTextInput
            theme={this.props.theme}
            ref={this.props.innerRef}
            value={this.props.value}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onSubmitEditing={this.props.onSubmitEditing}
            onChangeText={this._onChangeText}

            error={this._isErrored()}
            title={'CVV'}
            blurOnSubmit={false}
            returnKeyType={'done'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            placeholder={'XXX'}
            autoCompleteType={'cc-csc'}
            maxLength={4}
            placeholderTextColor={this.props.theme.placeholderTextColor}
        />
    }
}


export default React.forwardRef((props, ref) => <CardCVVInput {...props} innerRef={ref}/>);
