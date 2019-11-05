import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage,
} from "react-native";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import Layout from "../../constants/Layout";
import Dialog from "../../components/Dialog";
import StepIndicator from "react-native-step-indicator";
import { BarChart, Grid } from "react-native-svg-charts";
import { Text, Circle, G, Line } from "react-native-svg";
import AwesomeButton from "react-native-really-awesome-button";

const Container = styled.ScrollView`
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 20px;
`;

const TitleBox = styled.View`
  padding-left: 20px;
  padding-bottom: 15px;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 20px;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const Header = styled.View`
  background-color: #eeffcc;
  border-radius: 25px;
  padding: 10px;
`;
const Image = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const Body = styled.View`
  padding-top: 30px;
  width: 100%;
  padding-bottom: 30px;
`;

const ComponentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 30px;
  align-items: center;
`;

const Component = styled.View`
  width: 48%;
  background-color: #7bb8a4;
  border-radius: 25px;
  padding: 10px;
  align-items: center;
`;

const CompTop = styled.View`
  background-color: #eeffcc;
  border-radius: 25px;
  flex-direction: row;
  width: 70%;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-bottom: 5px;
`;

const CompName = styled.Text`
  font-size: 15px;
  font-weight: 600;
`;

const CompBottom = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CompValue = styled.View`
  background-color: white;
  padding: 6px;
  border-radius: 50px;
  margin-right: 2px;
  /* width: 40%; */
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const Value = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const Unit = styled.Text`
  font-size: 16px;
  font-weight: 400;
  margin-right: 5px;
`;

const BarNameBox = styled.View`
  width: 23%;
  height: ${Layout.height * 0.35};
  justify-content: space-between;
  align-items: center;
  padding: 12px 0px;
`;
const BarView = styled.View`
  width: 100%;
  background-color: green;
  padding: 4px;
  border-radius: 50;
  align-items:center;
  justify-content:center;
`;
const BarName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;
const Warning = styled.Text`
  color: #fe7013;
  font-size: 20;
  font-weight: bold;
`;

const BtnText = styled.Text`
  font-weight: bold;
`;

const CUT_OFF = 1000;

const Labels = ({ x, y, bandwidth, data }) =>
  data.map((value, index) => (
    <Text
      key={index}
      x={value > CUT_OFF ? x(value) - 80 : x(value) + 10}
      y={y(index) + bandwidth / 2}
      fontSize={15}
      fill={value > CUT_OFF ? "white" : "black"}
      alignmentBaseline={"middle"}
      fontWeight={"bold"}
    >
      {value}kcal
    </Text>
  ));

const calcAM = (BMR, activity) => {
  if (activity === "거의 없음") {
    AsyncStorage.setItem("BMR+AM", String(BMR * 0.2 + BMR));
    return BMR * 0.2;
  } else if (activity === "조금 있음") {
    AsyncStorage.setItem("BMR+AM", String(BMR * 0.375 + BMR));

    return BMR * 0.375;
  } else if (activity === "보통") {
    AsyncStorage.setItem("BMR+AM", String(BMR * 0.555 + BMR));
    return BMR * 0.555;
  } else if (activity === "많음") {
    AsyncStorage.setItem("BMR+AM", String(BMR * 0.725 + BMR));
    return BMR * 0.725;
  } else if (activity === "아주 많음") {
    AsyncStorage.setItem("BMR+AM", String(BMR * 0.9 + BMR));
    return BMR * 0.9;
  } else {
    return null;
  }
};

const PushPresenter = ({
  nutrient,
  navigation,
  connect,
  currentHeight,
  currentWeight,
  currentTemp,
  currentHeart,
  BMR,
  age,
  gender,
  height,
  weight,
  activity,
  temp,
  heart,
  changeAge,
  changeGender,
  changeHeight,
  changeWeight,
  changeActivity,
  changeTemp,
  changeHeart,
  currentPosition,
  connected,
  spendKcal,
}) => (
  <Container>
    <TitleBox>
      <TitleText>My condition</TitleText>
      <AwesomeButton
        onPress={() =>
          Alert.alert(
            "사용법",
            `사용자의 기초대사량, 활동대사량 등
기본정보를 위해 필수 값( * )을 입력해주세요.`,
          )
        }
        width={80}
        height={30}
      >
        <BtnText>사용 Tip</BtnText>
      </AwesomeButton>
    </TitleBox>
    {currentPosition < 5 ? (
      <Header style={{backgroundColor:"#e3e3e3"}}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Warning>필수 값을 입력해주세요!</Warning>
        </View>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={labels}
        />
      </Header>
    ) : (
      <Header>
        <View
          style={{
            flexDirection: "row",
            height: Layout.height * 0.38,
            paddingVertical: 10,
          }}
        >
          <BarNameBox>
            <BarView>
              <BarName>기초대사량</BarName>
            </BarView>
            <BarView>
              <BarName>활동대사량</BarName>
            </BarView>
            <BarView>
              <BarName>섭취칼로리</BarName>
            </BarView>
            <BarView>
              <BarName>소비칼로리</BarName>
            </BarView>
          </BarNameBox>
          <BarChart
            style={{ flex: 1, marginLeft: 8 }}
            data={[
              BMR,
              (AM = Math.round(calcAM(BMR, activity))),
              nutrient.kcal,
              spendKcal,
            ]}
            horizontal={true}
            svg={{ fill: "rgba(45, 	207, 	147, 0.8)" }}
            contentInset={{ top: 0, bottom: 0 }}
            spacing={0.2}
            gridMin={0}
            spacingInner={0.5}
            spacingOuter={0.1}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
            <Labels />
          </BarChart>
        </View>
      </Header>
    )}
    <Body>
      <ComponentContainer>
        <Component>
          <CompTop>
            <Image source={require("../../assets/age.png")} />
            <CompName>나이 *</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{age}</Value>
              <Unit>세</Unit>
              <Dialog type="입력" name="나이" changeValue={changeAge} />
            </CompValue>
          </CompBottom>
        </Component>
        <Component>
          <CompTop>
            <Image source={require("../../assets/gender.png")} />
            <CompName>성별 *</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{gender}</Value>
              <Unit> </Unit>
              <Dialog type="성별" name="성별" changeValue={changeGender} />
            </CompValue>
          </CompBottom>
        </Component>
      </ComponentContainer>
      <ComponentContainer>
        <Component>
          <CompTop>
            <Image source={require("../../assets/height.png")} />
            <CompName>키 *</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{height}</Value>
              <Unit>cm</Unit>
              <Dialog
                type="선택"
                name="키"
                changeValue={changeHeight}
                sensorValue={currentHeight}
                connected={connected}
            
              />
            </CompValue>
          </CompBottom>
        </Component>
        <Component>
          <CompTop>
            <Image source={require("../../assets/weight.png")} />
            <CompName>몸무게 *</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{weight}</Value>
              <Unit>kg</Unit>
              <Dialog
                type="선택"
                name="몸무게"
                changeValue={changeWeight}
                sensorValue={currentWeight}
                connected={connected}
              />
            </CompValue>
          </CompBottom>
        </Component>
      </ComponentContainer>
      <ComponentContainer>
        <Component>
          <CompTop>
            <Image source={require("../../assets/activity.png")} />
            <CompName>활동량 *</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{activity}</Value>
              <Unit></Unit>
              <Dialog
                type="활동량"
                name="활동량"
                changeValue={changeActivity}
              />
            </CompValue>
          </CompBottom>
        </Component>
        <Component>
          <CompTop>
            <Image source={require("../../assets/BMI.png")} />
            <CompName>비만도</CompName>
          </CompTop>
          <CompBottom>
            <CompValue style={{ marginRight: 0, paddingRight: 0 }}>
              <Value>{Math.round(weight / ((height * height) / 10000))}</Value>
              <Unit></Unit>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "비만도",
                    `저체중 -> 18.5이하 
정상 -> 18.5 ~ 22.9
과체중 -> 23 ~ 24.9
경도비만 -> 25 ~ 29.9
고도비만 -> 30 이상`,
                  )
                }
              >
                <Image
                  source={require("../../assets/btn.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </CompValue>
          </CompBottom>
        </Component>
      </ComponentContainer>
      <ComponentContainer>
        <Component>
          <CompTop>
            <Image source={require("../../assets/temperture.png")} />
            <CompName>체온</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{temp}</Value>
              <Unit>도</Unit>
              <Dialog
                type="측정"
                name="체온"
                changeValue={changeTemp}
                sensorValue={currentTemp}
                connected={connected}
              />
            </CompValue>
          </CompBottom>
        </Component>
        <Component>
          <CompTop>
            <Image source={require("../../assets/heart-rate.png")} />
            <CompName>심박수</CompName>
          </CompTop>
          <CompBottom>
            <CompValue>
              <Value>{heart}</Value>
              <Unit>회/분</Unit>
              <Dialog
                type="측정"
                name="심박수"
                changeValue={changeHeart}
                sensorValue={currentHeart}
                connected={connected}
              />
            </CompValue>
          </CompBottom>
        </Component>
      </ComponentContainer>
    </Body>
  </Container>
);

const labels = ["나이", "성별", "키", "몸무게", "활동량"];

const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 4,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 14,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 14,
  currentStepLabelColor: "#fe7013",
};

export default withNavigation(PushPresenter);
