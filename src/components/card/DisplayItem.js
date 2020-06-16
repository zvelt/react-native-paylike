import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Platform, Text, TextInput, View, ScrollView, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import {format} from "../../currencies";
import {TOTAL} from "../../utils";

function DisplayItem(props) {
    const label = props.total ? TOTAL.toLocalizedStrings(props.locale) : props.label;
    const textStyle = props.total ? {...props.theme.textStyle, ...props.theme.emphasisTextStyle} : props.theme.textStyle;
    return (
        <View style={
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: props.total ? props.theme.padding : 0,
                paddingTop: props.total ? props.theme.padding : 0,
                flexWrap: 'wrap'
            }}>
            <View
                style={{
                    display: 'flex',
                    flex: 1,
                }}
            >
                <Text style={textStyle}>{label}</Text>
            </View>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Text>{format(props.amount, props.currency, props.locale)}</Text>
            </View>
        </View>
    );
}

export default DisplayItem;
