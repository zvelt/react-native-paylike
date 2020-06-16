import React from "react";
import {Image} from "react-native";

export default function Mastercard(props) {
    return (
        <Image {...props} source={require("../../assets/mastercard.png")}>
        </Image>
    )
}
