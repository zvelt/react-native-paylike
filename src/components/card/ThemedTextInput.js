import React from 'react';
import {Text, View, TextInput, StyleSheet, TouchableWithoutFeedback} from 'react-native';

class ThemedTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
        }
    }

    _isFocused = () => {
        return this.state.focused;
    }

    _getTextInputStyle = () => {
        return {
            ...styles.textInput,
            ...(!this.props.error && this._isFocused() && this.props.theme.successTextStyle),
            ...((this.props.error && !this._isFocused()) && this.props.theme.errorTextStyle)
        }
    }

    _getTitleStyle = () => {
        return {
            ...this.props.theme.emphasisTextStyle,
        }
    }

    _wrapWithBorderBottom = (component) => {
        if (!this.props.theme.showTitles) {
            return (<View style={{borderBottomWidth: 1}}>
                {component}
            </View>);
        } else {
            return component;
        }
    }

    _focusTextField = () => {
        this.props.innerRef.current && this.props.innerRef.current.focus();
    };

    _onFocus = () => {
        this.setState({
            focused: true,
        });
        this.props.onFocus && this.props.onFocus();
    }

    _onBlur = () => {
        this.setState({
            focused: false,
        });
        this.props.onBlur && this.props.onBlur();
    }

    render() {
        return (
                <TouchableWithoutFeedback onPress={this._focusTextField}>
                    <View>
                    {this.props.theme.showTitles &&
                        <Text style={this._getTitleStyle()}>
                            {this.props.title}
                        </Text>
                    }
                    {this._wrapWithBorderBottom(
                        <TextInput {...this.props}
                                   onFocus={this._onFocus}
                                   onBlur={this._onBlur}
                                   ref={this.props.innerRef}
                                   style={this._getTextInputStyle()}/>
                    )
                    }
                    </View>
                </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        padding: 0,
    }
});

export default React.forwardRef((props, ref) => <ThemedTextInput {...props} innerRef={ref}/>);
