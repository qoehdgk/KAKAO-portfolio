import React from "react";
import styled from "styled-components";
import propType from "prop-types";
import Layout from "../constants/Layout";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Day, Time } from "../constants/Time";

const Container = styled.View`
  flex: 1;
  position: relative;
  flex-direction: row;
  /* width:${Layout.width*0.9}; */
  margin-right:10px;
  margin-left:10px;
`;

const BgImage = styled.Image`
  width: 100%;
  height: ${Layout.height / 3.3};
  opacity: 0.9;
  position: absolute;
  border-radius: 40;
`;

const Btn = styled.TouchableOpacity`
  padding: 3px;
  justify-content: center;
  align-items: center;
  background-color: yellow;
  border-radius: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
`;
/*
POP = 강수확률 %
PTY = 강수형태 (없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4))
SKY = 하늘상태 (맑음(1), 구름많음(3), 흐림(4) )
3H = 기온 
*/
const CheakPOP = Weather => {
  for (let i = 0; i < 10; i++) {
    if (Weather.item[i].category == "POP") {
      return Weather.item[i].fcstValue;
    }
  }
};
const CheakTEM = Weather => {
  for (let i = 0; i < 10; i++) {
    if (Weather.item[i].category == "T3H") {
      return Weather.item[i].fcstValue;
    }
  }
};
const CheakSKY = Weather => {
  for (let i = 0; i < 10; i++) {
    if (Weather.item[i].category == "PTY") {
      if (Weather.item[i].fcstValue == 0) {
        for (let j = 0; j < 10; j++) {
          if (Weather.item[j].category == "SKY") {
            if (Weather.item[j].fcstValue == 1) return "맑음";
            else if (Weather.item[j].fcstValue == 3) return "구름많음";
            else if (Weather.item[j].fcstValue == 4) return "흐림";
            else return "error2";
          }
        }
      } else if (Weather.item[i].fcstValue == 1) return "비";
      else if (Weather.item[i].fcstValue == 2) return "진눈개비";
      else if (Weather.item[i].fcstValue == 3) return "눈";
      else if (Weather.item[i].fcstValue == 4) return "소나기";
      else return "error";
    }
  }
};

const WeatherSlide = ({ Weather, CurrentPosition, refresh }) => (
  <Container>
    <BgImage
      source={{
        uri:WeatherOptions[CheakSKY(Weather)].URL
      }}
      resizeMode="cover"
    />
    <View
      style={{
        width: "50%",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: 20,
      }}
    >
      <MaterialCommunityIcons
        size={120}
        name={WeatherOptions[CheakSKY(Weather)].iconName}
        color="white"
      />
      <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
        {CheakSKY(Weather)}
      </Text>
    </View>
    <View style={{ width: "50%", alignItems: "center", paddingVertical: 20 }}>
      <Text style={{ color: "white", paddingBottom: 10 }}>
        {CurrentPosition}
      </Text>
      <Text style={{ color: "white" }}>{Day}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", paddingRight: 5 }}>{Time}</Text>
        <Btn
          onPress={() => {
            refresh();
          }}
        >
          <Text>UPDATE</Text>
        </Btn>
      </View>
      <Text
        style={{
          fontSize: 55,
          color: "white",
          paddingBottom: 20,
          fontWeight: "bold",
        }}
      >
        {CheakTEM(Weather)}
        <MaterialCommunityIcons
          size={45}
          name="temperature-celsius"
          color="white"
        />
      </Text>
      <Text style={{ fontSize: 15, color: "white" }}>
        강수확률 : {CheakPOP(Weather)}%
      </Text>
    </View>
  </Container>
);
const WeatherOptions = {
  맑음: {
    iconName: "weather-sunny",
    URL:"https://images.unsplash.com/photo-1542017900534-7cdb716ec291?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
  },
  비: {
    iconName: "weather-pouring",
    URL:"https://images.unsplash.com/photo-1516469727881-f4458e7cee17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
  },
  소나기: {
    iconName: "weather-pouring",
    URL:"https://images.unsplash.com/photo-1516469727881-f4458e7cee17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
  },
  눈: {
    iconName: "weather-snowy",
    URL:"https://images.unsplash.com/photo-1544274411-a7afe6230711?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
  },
  구름많음: {
    iconName: "weather-cloudy",
    URL:"https://images.unsplash.com/photo-1509803874385-db7c23652552?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
  },
  흐림: {
    iconName: "weather-fog",
    URL:"https://images.unsplash.com/photo-1500740516770-92bd004b996e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80"
  },
  error: {
    iconName: "alert",
  },
};

WeatherSlide.propType = {
  Weather: propType.object.isRequired,
  CurrentPosition: propType.string.isRequired,
  refresh: propType.func.isRequired,
};

export default WeatherSlide;
