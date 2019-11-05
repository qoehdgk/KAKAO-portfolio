import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Slider,
} from "react-native";
import { Pedometer } from "expo-sensors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { withNavigation, withNavigationFocus } from "react-navigation";
import styled from "styled-components";
import Layout from "../../constants/Layout";
import AwesomeButton from "react-native-really-awesome-button";
import Dialog from "react-native-dialog";
import MapView, { Polyline } from "react-native-maps";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import { Platform } from "@unimodules/core";
import { TouchableOpacity } from "react-native-gesture-handler";

const ASPECT_RATIO = Layout.width / Layout.height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MainContainer = styled.View`
  flex: 1;
`;

const Container = styled.ScrollView``;

const MapContainer = styled.View`
  height: ${Layout.height * 0.4};
  width: ${Layout.width * 0.9};
  margin: 0 20px 0 20px;
  border-radius: 15px;
  border: 1px solid black;
`;
const TimerDistanceContatiner = styled.View`
  height: ${Layout.height * 0.18};
  width: ${Layout.width * 0.9};
  border-radius: 15px;
  border: 1px solid black;
  margin: 20px;
`;

const SliderView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const SliderText = styled.Text`
  font-size: 13px;
  margin-bottom: 3px;
`;

const ComponentTitleContainer = styled.View`
  margin: 20px 20px 10px 20px;
  width: ${Layout.width * 0.7};
`;
// border-bottom-width: 1;
// border-bottom-color: black;

const ComponentTitleText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  padding-left: 20px;
`;

const ComponentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 30px;
  align-items: center;
`;

const Component = styled.View`
  width: ${Layout.width * 0.9};
  background-color: #eeffcc;
  border-radius: 25px;
  padding: 10px 30px;
  flex-direction: row;
  align-items: center;
`;

const ComponentText = styled.Text`
  font-weight: bold;
  color: green;
  font-size: 15px;
`;
const Body = styled.View`
  padding-top: 10px;
  width: 100%;
  padding-bottom: 30px;
  margin-left: 20px;
`;

const TextBox = styled.View`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
`;

const TimeContainer = styled.View`
  width: 100%;
  height: 50%;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;
const StartStopContainer = styled.View`
  height: 50%;
  padding: 10px;
  flex-direction: row;
  justify-content: space-around;
`;
const TitleBox = styled.View`
  padding-left: 20px;
  padding-top: 15px;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 20px;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: black;
`;
const Header = styled.View`
  height: ${Layout.height * 0.3};
`;

const handleTimerComplete = () => alert("Custom Completion Function");
const options = {
  container: {
    // backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    color: "black",
    marginLeft: 7,
  },
};

const HealthPresenter = ({
  isPedometerAvailable,
  pastStepCount,
  currentStepCount,
  dialogVisible,
  handleCancel,
  handleDelete,
  showDialog,
  coordinates,
  repeat,
  finish,
  isTimerStart,
  isStopwatchStart,
  timerDuration,
  resetTimer,
  resetStopwatch,
  startStopTimer,
  funcResetTimer,
  startStopStopWatch,
  funcresetStopwatch,
  getFormattedTime,
  initLatitude,
  initLongitude,
  setGoalDistance,
  goalDistance,
  isPolyline,
  currentDistance,
  isDisabled,
  fullTime,
  getFullTime,
  speed,
  movingDistance,
  kcal,
  stored,
  getKcal
}) => (
  <MainContainer>
    <Container>
      <TitleBox>
        <TitleText>Training</TitleText>
      </TitleBox>
      <TimerDistanceContatiner>
        <TimeContainer>
          <Stopwatch
            laps
            start={isStopwatchStart}
            //To start
            reset={resetStopwatch}
            //To reset
            options={options}
            //options for the styling
            getTime={time => {
              getFormattedTime();
              fullTime = time;
            }}
          />
        </TimeContainer>

        <StartStopContainer>
          <TouchableOpacity
            onPress={() => {
              Promise.all([startStopStopWatch()]).then(
                () => {
                  isStopwatchStart ? getKcal(fullTime) : null
                  repeat();
                },
              );
            }}
          >
            <Text style={{ fontSize: 20, marginTop: 10 }}>
              {!isStopwatchStart ? "START" : "STOP"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Promise.all([funcresetStopwatch(), getFullTime(fullTime)]).then(
                () => {
                  finish();
                },
              );
            }}
          >
            <Text style={{ fontSize: 20, marginTop: 10 }}>RESET</Text>
          </TouchableOpacity>
        </StartStopContainer>
      </TimerDistanceContatiner>
      <MapContainer>
        <MapView
          style={StyleSheet.absoluteFill}
          showsUserLocation={true}
          region={{
            latitude: initLatitude,
            longitude: initLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {/* <PolylineDirection
            origin={origin}
            destination={destination}
            apiKey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#12bc00"
          /> */}
          <Polyline
            coordinates={coordinates}
            strokeColor={"#000"} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          ></Polyline>
        </MapView>
      </MapContainer>

      <ComponentTitleContainer>
        <ComponentTitleText>목표거리</ComponentTitleText>
      </ComponentTitleContainer>
      <SliderView>
        {currentDistance ? (
          <Text>{String(currentDistance / 1000) + "km"}</Text>
        ) : (
          <Text>{String(goalDistance / 1000) + "km"}</Text>
        )}
        <Slider
          width={Layout.width * 0.7}
          step={100}
          maximumValue={10000}
          onValueChange={value => {
            value == 10000 || value == 0
              ? setGoalDistance(value)
              : setGoalDistance(value + 100);
          }}
          disabled={isDisabled}
          value={goalDistance}
        ></Slider>
      </SliderView>
      {/* <ProgressBarAnimated
          width={Layout.width /1.2}
          value={
            goalDistance
          }
          maxValue={goalDistance}
          height={20}
          backgroundColor="#2dcf93"
          borderColor="#2dcf93"
        /> */}
      <ComponentTitleContainer>
        <ComponentTitleText>운동 결과 </ComponentTitleText>
      </ComponentTitleContainer>

      {!stored ? (
        <Header style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#cccccc", fontSize: 22 }}>
            "Health" 탭의 사용자 정보를
          </Text>
          <Text style={{ color: "#cccccc", fontSize: 22 }}>입력해주세요!</Text>
        </Header>
      ) : (
        <Body>
          <ComponentContainer>
            <Component style={{ borderWidth: 2, borderColor: "green" }}>
              <TextBox>
                <ComponentText>평균 속력 *</ComponentText>
                <ComponentText>{speed} km/h</ComponentText>
              </TextBox>
            </Component>
          </ComponentContainer>
          <ComponentContainer>
            <Component style={{ borderWidth: 2, borderColor: "green" }}>
              <TextBox>
                <ComponentText>소모 칼로리 *</ComponentText>
                <ComponentText>{kcal} kcal</ComponentText>
              </TextBox>
            </Component>
          </ComponentContainer>
          <ComponentContainer>
            <Component style={{ borderWidth: 2, borderColor: "green" }}>
              <TextBox>
                <ComponentText>운동 거리 *</ComponentText>
                <ComponentText>{movingDistance} km</ComponentText>
              </TextBox>
            </Component>
          </ComponentContainer>
          <ComponentContainer>
            <Component style={{ borderWidth: 2, borderColor: "green" }}>
              <TextBox>
                <ComponentText>오늘의 걸음 수 *</ComponentText>
                <ComponentText>
                  {Platform.OS == "ios" ? pastStepCount : currentStepCount} 걸음
                </ComponentText>
              </TextBox>
            </Component>
          </ComponentContainer>
        </Body>
      )}
    </Container>
  </MainContainer>
);
export default withNavigation(HealthPresenter);
