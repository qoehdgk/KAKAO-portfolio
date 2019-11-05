import React from "react";
import propType from "prop-types";
import {Ionicons} from "@expo/vector-icons";
import { TINT_COLOR, GREY_COLOR } from "../constants/Colors";

const TabBarIcon = ({name,focused}) =><Ionicons size={26} name={name} color={focused?TINT_COLOR:"#2dcf93"}/>

TabBarIcon.propType ={
    name:propType.string.isRequired,
    focused:propType.bool.isRequired
}

export default TabBarIcon;