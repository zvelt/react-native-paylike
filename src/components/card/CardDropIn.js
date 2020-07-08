import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Platform, Text, View, ScrollView, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import CardDetailsCollector from "./CardDetailsCollector";
import withController, {PaymentControllerState} from "../withController";
import PayButton from "./PayButton";
import {parseCard} from "../../card";
import DisplayItem from "./DisplayItem";

const defaultTheme = {
    emphasisTextStyle: {
        fontWeight: 'bold',
    },
    textStyle: {
        color: 'black',
    },
    errorTextStyle: {
        color: 'red',
    },
    successTextStyle: {
        color: 'green',
    },
    placeholderTextColor: 'grey',
    showTitles: true,
    buttonTextStyle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    padding: 20,
    margin: 20,
    borderRadius: 8,
    headerGradientColors: ['#fdfeff', '#e3e4e5'],
    buttonGradientColors: ['#459a42', '#0f754b'],
};

class CardDropInComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardDetails: {},
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const isSuccess = (prevProps.state !== PaymentControllerState.SUCCESS) && (this.props.state === PaymentControllerState.SUCCESS);
        const isError = (prevProps.state !== PaymentControllerState.ERROR) && (this.props.state === PaymentControllerState.ERROR);
        const isCanceled = (prevProps.state !== PaymentControllerState.CANCELED) && (this.props.state === PaymentControllerState.CANCELED);

        if (isSuccess) {
            this.props.onSuccess(this.props.result);
            return;
        }

        if (isError) {
            this.props.onError(this.props.errors);
            return;
        }

        if (isCanceled) {
            this.props.onCancel(this.props.result);
            return;
        }
    }

    _onCardDetailsChanged = (cardDetails) => {
        const details = parseCard(cardDetails);
        this.setState({
            cardDetails: details,
        });
        return details;
    }

    _onPay = () => {
        this.props.onAuthorizePayment({
            amount: this._getPaymentRequest().amount,
            currency: this._getPaymentRequest().currency,
            custom: this._getPaymentRequest().custom,
            card: this.state.cardDetails,
            descriptor: this._getPaymentRequest().descriptor,
        });
    }

    _getEnclosingView = () => {
        return Platform.OS === "ios" ? KeyboardAvoidingView : View;
    }

    _getTheme = () => {
        return {...defaultTheme, ...this.props.theme};
    }

    _getPaymentRequest = () => {
        return this.props.paymentRequest;
    }

    _getDisplayItems = () => {
        const theme = this._getTheme();
        const paymentRequest = this._getPaymentRequest();

        let displayItems = [];
        const length = paymentRequest.displayItems ? paymentRequest.displayItems.length : 0;
        for (let i = 0; i < length; ++i) {
            const item = paymentRequest.displayItems[i];
            displayItems.push(
                <DisplayItem
                    key={'displayItem_'+i}
                    theme={theme}
                    locale={this.props.locale}
                    currency={paymentRequest.currency}

                    amount={item.amount}
                    label={item.label}

                 />
            );
        }

        displayItems.push(
            <DisplayItem
                key={'total'}
                theme={theme}
                locale={this.props.locale}
                currency={paymentRequest.currency}
                amount={paymentRequest.amount}
                total
            />
        );

        return displayItems;
    }

    render() {
        const customTheme =this._getTheme();
        const EnclosingView = this._getEnclosingView();
        return (
            <EnclosingView
                behavior={"padding"}
                style={{
                    flex: 1,
                    backgroundColor: '#00000000',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ScrollView keyboardShouldPersistTaps={'handled'} bounces={false} style={styles.root}>

                    <LinearGradient colors={customTheme.headerGradientColors} useAngle={true} angle={165} style={styles.header(customTheme)}>
                        <TouchableOpacity onPress={this.props.cancel} style={{paddingBottom: 5, alignSelf: 'flex-end'}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>✕</Text>
                        </TouchableOpacity>
                        {this.props.children}
                    </LinearGradient>

                    <CardDetailsCollector
                                          locale={this.props.locale}
                                          errors={this.props.errors}
                                          onCardDetailsChanged={this._onCardDetailsChanged}
                                          theme={customTheme}
                                          style={styles.body(customTheme)}/>
                    <View style={
                        {
                            flex: 1,
                            paddingTop: customTheme.padding,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white'
                        }
                    }>
                        <View
                            style={
                                {
                                    marginLeft: customTheme.margin,
                                    marginRight: customTheme.margin,
                                    height: 1,
                                    backgroundColor: 'gray',
                                }
                            }
                        />
                    </View>
                    <View style={{...styles.body(customTheme)}}>
                        {
                            this._getDisplayItems()
                        }
                    </View>
                    <PayButton amount={this._getPaymentRequest().amount}
                               currency={this._getPaymentRequest().currency}
                               locale={this.props.locale}
                               theme={customTheme}
                               onPay={this._onPay}/>
                    {this.props.state !== PaymentControllerState.IDLE &&
                    <View style={styles.activityIndicator(customTheme)}>
                        <ActivityIndicator size={'large'} color={customTheme.textStyle.color}/>
                    </View>
                    }
                </ScrollView>
            </EnclosingView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        maxWidth: 320,
        flex: 1,
    },
    activityIndicator: (theme) => ({
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: theme.borderRadius,
        borderBottomRightRadius: theme.borderRadius,
        borderTopLeftRadius: theme.borderRadius,
        borderTopRightRadius: theme.borderRadius,
    }),
    header: (theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
        padding: theme.padding,
        backgroundColor: '#e1e2e3',
        borderTopLeftRadius: theme.borderRadius,
        borderTopRightRadius: theme.borderRadius,
    }),
    body: (theme) => ({
        paddingTop: theme.padding,
        paddingLeft: theme.padding,
        paddingRight: theme.padding,
        backgroundColor: 'white',
    }),
});

export const CardDropIn = withController(CardDropInComponent);
