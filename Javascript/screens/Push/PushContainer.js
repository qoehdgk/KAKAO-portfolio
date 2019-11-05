import React, { Component } from "react";
import PushPresenter from "./PushPresenter";
import client from "../../mqtt";
import axios from "axios";
import { AsyncStorage, Alert } from "react-native";

export default class PushContainer extends Component {
  constructor(props) {
    super(props);
    // AsyncStorage.clear();

    this.state = {
      // text: ["..."],
      // connect: false,
      currentHeight: 0,
      currentWeight: 0,
      currentTemp: 0,
      currentHeart: 0,
      nutrient: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      spendKcal: 0,
      age: 0,
      gender: null,
      height: 0,
      weight: 0,
      activity: null,
      temp: 0,
      heart: 0,
      currentPosition: 0,
      connected: null,
    };
    this.loadData();
  }


  onPageChange() {
    if (this.state.age === 0) {
      this.setState({ currentPosition: 0 });
    } else if (this.state.age !== 0 && this.state.gender === null) {
      this.setState({ currentPosition: 1 });
    } else if (
      this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height === 0 && this.state.currentPosition!==5
    ) {
      this.setState({ currentPosition: 2 });
    } else if (
      this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height !== 0 &&
      this.state.weight === 0 && this.state.currentPosition!==5
    ) {
      this.setState({ currentPosition: 3 });
    } else if (
      this.state.age !== 0 &&
      this.state.gender !== null &&
      this.state.height !== 0 &&
      this.state.weight !== 0 &&
      this.state.activity === null
    ) {
      this.setState({ currentPosition: 4 });
    } else {
      this.setState({ currentPosition: 5 });
      AsyncStorage.setItem("CurrentPosition", String(5));
    }
  }

  changeTemp = async value => {
    await this.setState({ temp: value });
    AsyncStorage.setItem("Temp", String(value));
  };

  changeHeart = async value => {
    await this.setState({ heart: value });
    AsyncStorage.setItem("Heart", String(value));
  };

  changeActivity = async value => {
    await this.setState({ activity: value });
    this.onPageChange();
    AsyncStorage.setItem("Activity", String(value));
  };

  changeHeight = async value => {
    await this.setState({ height: value });
    this.onPageChange();
    AsyncStorage.setItem("Height", String(value));
  };

  changeWeight = async value => {
    await this.setState({ weight: value });
    this.onPageChange();
    AsyncStorage.setItem("Weight", String(value));
  };

  changeGender = async value => {
    await this.setState({ gender: value });
    this.onPageChange();
    AsyncStorage.setItem("Gender", String(value));
  };

  changeAge = async value => {
    await this.setState({ age: value });
    this.onPageChange();
    AsyncStorage.setItem("Age", String(value));
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.loadData();
    });
  }

  loadData = async () => {
    const Data = await AsyncStorage.getItem("Nut");
    const JsonData = JSON.parse(Data);
    if (await AsyncStorage.getItem("Activity")) {
      this.setState({
        age: await AsyncStorage.getItem("Age"),
        gender: await AsyncStorage.getItem("Gender"),
        height: await AsyncStorage.getItem("Height"),
        weight: await AsyncStorage.getItem("Weight"),
        activity: await AsyncStorage.getItem("Activity"),
        temp: await AsyncStorage.getItem("Temp"),
        heart: await AsyncStorage.getItem("Heart"),
        currentPosition: 5,
      });
      AsyncStorage.setItem("CurrentPosition", String(5));
      // console.log("연결:"+this.state.connected)
    }

    if (JsonData) {
      this.setState({ nutrient: JsonData });
    } else {
      this.setState({ nutrient: { kcal: 0, carbs: 0, protein: 0, fat: 0 } });
    }

    const connected = await AsyncStorage.getItem("Connected");

    const PastKcal = await AsyncStorage.getItem("Kcal");
    if(isNaN(PastKcal) || !PastKcal){
      this.setState({spendKcal: 0})
    }
    else{
      console.log(`11122222`+ PastKcal)
      this.setState({
        spendKcal: parseInt(PastKcal)
      })
    }
    console.log("pastKcal: "+PastKcal)
    if(connected==1){
      this.setState({ connected });
      console.log("상태바뀜 완료");
      client.subscribe("sensor/#");
      client.onMessageArrived = this.onMessageArrived;
    }
  };

  onMessageArrived = message => {
    if (message.destinationName === "sensor/distance") {
      this.updatePayload(`${parseInt(message.payloadString)}`, "height");
      // t_height = message.payloadString;
      // console.log(message.payloadString);
    } else if (message.destinationName === "sensor/weight") {
      this.updatePayload(`${parseInt(message.payloadString)}`, "weight");
      // t_temp = message.payloadString;
    } else if (message.destinationName === "sensor/temp") {
      this.updatePayload(`${parseInt(message.payloadString)}`, "temp");
      // t_dust = message.payloadString;
    } else if (message.destinationName === "sensor/heart") {
      this.updatePayload(`${parseInt(message.payloadString)}`, "heart");
      // t_dust = message.payloadString;
    }
  };
  updatePayload = async (Message, topic) => {
    const Current = {
      Data: ({
        currentHeight,
        currentWeight,
        currentTemp,
        currentHeart,
      } = this.state),
    };
    if (topic === "height") {
      if (Current.Data.currentHeight !== Message) {
        this.setState({
          currentHeight: Message,
        });
        await axios.get('http://sickchatbot.shop/mqtt/mqttSaveHeight',{
          params: {
            height: Message
          }
        })
      }
    }
    if (topic === "weight") {
      if (Current.Data.currentWeight !== Message) {
        this.setState({
          currentWeight: Message,
        });
        await axios.get('http://sickchatbot.shop/mqtt/mqttSaveWeight',{
          params: {
            weight: Message
          }
        })
      }
    }
    if (topic === "temp") {
      if (Current.Data.currentTemp !== Message) {
        this.setState({
          currentTemp: Message,
        });
        await axios.get('http://sickchatbot.shop/mqtt/mqttSaveTemperate',{
          params: {
            temperature: Message
          }
        })
      }
    }
    if (topic === "heart") {
      if (Current.Data.currentHeart !== Message) {
        this.setState({
          currentHeart: Message,
        });
        await axios.get('http://sickchatbot.shop/mqtt/mqttSaveBmi',{
          params: {
            bpm: Message
          }
        })
      }
    }
  };

  render() {
    const {
      // text,
      // client,
      // connect,
      currentHeight,
      currentWeight,
      currentTemp,
      currentHeart,
      nutrient,
      age,
      gender,
      height,
      weight,
      activity,
      temp,
      heart,
      currentPosition,
      connected,
      spendKcal
    } = this.state;
    // console.log("h:",currentHeight)
    // console.log("w:",currentWeight)
    // console.log("t:",currentTemp)
    // console.log("b:",currentHeart)

    return (
      <PushPresenter
        BMR={
          gender === "남성"
            ? Math.floor(66 + 13.7 * weight + 5 * height - 6.8 * age)
            : Math.floor(655.1 + 9.56 * weight + 1.85 * height - 4.68 * age)
        }
        age={age}
        gender={gender}
        height={height}
        weight={weight}
        activity={activity}
        temp={temp}
        heart={heart}
        changeAge={this.changeAge}
        changeGender={this.changeGender}
        changeHeight={this.changeHeight}
        changeWeight={this.changeWeight}
        changeActivity={this.changeActivity}
        changeTemp={this.changeTemp}
        changeHeart={this.changeHeart}
        loadData={this.loadData}
        nutrient={nutrient}
        Subconsole={this.Subconsole}
        refresh={this.refresh}
        // text={this.text}
        currentHeight={currentHeight}
        currentWeight={currentWeight}
        currentTemp={currentTemp}
        currentHeart={currentHeart}
        currentPosition={currentPosition}
        connected={connected}
        spendKcal={spendKcal}
      />
    );
  }
}
