import React from "react";
import styled from "styled-components";
import propType from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Layout from "../constants/Layout";
import SemiCircleProgress from "../constants/SemiCircleProgress/SemiCircleProgress";
import { Entypo } from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient"

const Container = styled.View`
  flex: 1;
  position: relative;
  margin-right:10px;
  margin-left:10px;
  align-items:center;
`;

const BgView = styled.View`
  width: 100%;
  height: ${Layout.height / 3.3};
  background-color:#c2a334;
  position: absolute;
  border-radius: 40;
  justify-content:center;
`;

const MiddleContainer = styled.View`
height:90%;
  padding-top: 10px;
  flex-direction: row;

`;
const LeftContainer = styled.View`
  width: 50%;
  align-items: center;
  justify-content:space-around;
`;

const RightContainer = styled.View`
  width: 50%;
  align-items: center;
  justify-content:space-around;
`;
const BottomContainer = styled.View`
  padding: 3px;
  padding-right: 30px;
  padding-bottom:10px;
  align-items:flex-end;

`;

const DustSlide = ({ Dust, CurrentPosition }) => (
  <Container>
    <BgView>
      <MiddleContainer>
        <LeftContainer>
          <Text style={styles.text}>미세먼지</Text>
          <Entypo
            name={DustOptions[Dust.list[0].pm10Grade1h].iconName}
            size={70}
            color="white"
            style={{ paddingBottom: 5 }}
          />
          <SemiCircleProgress
            circleRadius={50}
            progressWidth={10}
            progressShadowColor="#e6e6e6"
            interiorCircleColor="#c2a334"
            percentage={Number(Dust.list[0].pm10Value) / 1.8}
            progressColor={DustOptions[Dust.list[0].pm10Grade1h].Color}
            interiorCircleStyle={{ paddingBottom: 3 }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }}>
              {Dust.list[0].pm10Value}
            </Text>
          </SemiCircleProgress>
          <Text style={styles.text}>
            {DustOptions[Dust.list[0].pm10Grade1h].State}
          </Text>
        </LeftContainer>
        <RightContainer>
          <Text style={styles.text}>초미세먼지</Text>
          <Entypo
            name={DustOptions[Dust.list[0].pm25Grade1h].iconName}
            size={70}
            color="white"
            style={{ paddingBottom: 5 }}
          />
          <SemiCircleProgress
            circleRadius={50}
            progressWidth={10}
            progressShadowColor="#e6e6e6"
            interiorCircleColor="#c2a334"
            percentage={Number(Dust.list[0].pm25Value)}
            progressColor={DustOptions[Dust.list[0].pm25Grade1h].Color}
            interiorCircleStyle={{ paddingBottom: 3 }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }}>
              {Dust.list[0].pm25Value}
            </Text>
          </SemiCircleProgress>
          <Text style={styles.text}>
            {DustOptions[Dust.list[0].pm25Grade1h].State}
          </Text>
        </RightContainer>
      </MiddleContainer>
      <BottomContainer>
        <Text style={{ color: "white", fontSize: 10 }}>{CurrentPosition}</Text>
      </BottomContainer>
    </BgView>
  </Container>
);

DustSlide.propType = {
  Dust: propType.object.isRequired,
  CurrentPosition :propType.string.isRequired
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    paddingTop:10,
    paddingBottom: 5,
    fontSize:15,
    fontWeight:"bold"
  }
});
const DustOptions = {
  1: {
    Color: "#81defc",
    State: "좋음",
    iconName:"emoji-flirt"
  },
  2: {
    Color: "#a4d143",
    State: "보통",
    iconName:"emoji-happy"
  },
  3: {
    Color: "#d68533",
    State: "나쁨",
    iconName:"emoji-sad"
  },
  4: {
    Color: "#ed3737",
    State: "매우나쁨",
    iconName:"emoji-sad"
  },
  "":{
    Color: "#81defc",
    State: "좋음",
    iconName:"emoji-flirt"
  }

};

export default DustSlide;
