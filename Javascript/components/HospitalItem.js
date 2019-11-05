import React from "react";
import { Text, Platform } from "react-native";
import propType from "prop-types";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  width: 280px;
  height: 120px;
  margin-right: 20px;
  border-radius: 20px;
  border: 2px solid #ededed;
  background-color: #f7f7f7;
  padding-top: 15px;
  padding-left: 10px;
`;

const Header = styled.View`
  padding-bottom: 10px;
`;
const Name = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const AddrContainer = styled.View`
  flex-direction: row;
  padding-bottom: 10px;
`;
const Distance = styled.Text`
  padding-left: 3px;
  padding-right: 5px;
`;
const Addr = styled.Text`
  color: #828282;
`;

const NumberContainer = styled.View`
  padding-left: 5px;
  background-color: #f0f783;
  width: 62%;
  border: 1px solid black;
  border-radius: 10px;
`;

const Number = styled.Text``;

const HospitalItem = ({ name, addr, distance, url, telno }) => (
  <TouchableOpacity onPress={() => {}}>
    <Container>
      <Header>
        <Name>{name}</Name>
      </Header>
      <AddrContainer>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}
          size={18}
        />
        <Distance>{distance}km</Distance>
        <Addr>{addr.length > 15 ? `${addr.substring(0, 18)}...` : addr}</Addr>
      </AddrContainer>
      <NumberContainer>
        <Number>연락처 : {telno}</Number>
      </NumberContainer>
    </Container>
  </TouchableOpacity>
);

HospitalItem.propType = {};

export default withNavigation(HospitalItem);
