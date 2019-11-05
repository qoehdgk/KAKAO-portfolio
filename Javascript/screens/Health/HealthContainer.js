import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { AsyncStorage } from "react-native";
import { Pedometer } from "expo-sensors";
import HealthPresenter from "./HealthPresenter";
import Layout from "../../constants/Layout";
import Dialog from "react-native-dialog";
import { Platform } from "@unimodules/core";

const ASPECT_RATIO = Layout.width / Layout.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class HealthContainer extends React.Component {
  constructor() {
    super();
    // AsyncStorage.clear();
    // this.loadData();

    this.state = {
      isPedometerAvailable: "checking",
      pastStepCount: 0,
      currentStepCount: 0,
      initLatitude: 0,
      initLongitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      dialogVisible: false,
      coordinates: [],
      count: 0,
      isTimerStart: false,
      isStopwatchStart: false,
      timerDuration: 90000,
      resetTimer: false,
      resetStopwatch: false,
      goalDistance: 2000,
      isPolyline: false,
      movingDistance: 0,
      currentDistance: 0,
      isDisabled: false,
      fullTime: null,
      speed: 0,
      currentWeight: 0,
      stored: false,
      kcal: 0,
      tiemGap: 0,
    };
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.startStopStopWatch = this.startStopStopWatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
    this.timer = null;
    this.getCurrent();
    this.loadData();
  }

  getKcal = time => {
    console.log(time);
    let hour, minutes, seconds, fullseconds;
    hour = time.split(":")[0];
    minutes = time.split(":")[1];
    seconds = time.split(":")[2];
    fullseconds =
      parseInt(hour) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
      this.setState({
        speed: parseFloat(
          ((this.state.movingDistance * 1000) / fullseconds / 60 ).toFixed(
            3,
          ),
        ),
      });
    if (this.state.speed < 8) {
      this.setState(prevState => ({
        kcal:
          prevState.kcal +
          parseInt(
            (
              (1000*0.9 * (this.state.currentWeight - 8) * 4) /
              fullseconds /
              60 /
              60 
              
            ).toFixed(),
          ),
      }));
    } else {
      this.setState(prevState => ({
        kcal:
          prevState.kcal +
          parseInt(
            (
              (1000*2 * (this.state.currentWeight - 8) * 4) /
              fullseconds /
              60 /
              60
            ).toFixed(),
          ),
      }));
    }

    console.log(
      (2 * (this.state.currentWeight - 8) * 4) / fullseconds / 60 / 60,
    );
    console.log(this.state.speed);
    console.log(this.state.currentWeight);
    console.log(this.state.kcal);
    console.log(1111111111111);
  };
  getFullTime = time => {
    let hour, minutes, seconds, fullseconds;
    hour = time.split(":")[0];
    minutes = time.split(":")[1];
    seconds = time.split(":")[2];
    fullseconds =
      parseInt(hour) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);

    Promise.all([this.setState({ fullTime: fullseconds })]).then(() => {
      console.log(this.state.fullTime);
      
    });
  };
  setGoalDistance = value => {
    console.log(value);
    this.setState({
      goalDistance: value,
      currentDistance: this.state.goalDistance,
    });
  };
  startStopTimer() {
    this.setState({
      isTimerStart: !this.state.isTimerStart,
      resetTimer: false,
    });
  }
  resetTimer() {
    this.setState({ isTimerStart: false, resetTimer: true });
  }
  startStopStopWatch() {
    this.setState({
      isStopwatchStart: !this.state.isStopwatchStart,
      resetStopwatch: false,
    });
  }
  resetStopwatch() {
    this.setState({ isStopwatchStart: false, resetStopwatch: true });
  }
  getFormattedTime(time) {
    this.currentTime = time;
  }

  addCoord = coord => {
    const { coordinates } = this.state;

    this.setState({ coordinates: [...coordinates, coord] });
    // const start = coordinates.pop();
    const start = coordinates[coordinates.length - 1];
    start
      ? this.setState(prevState => ({
          movingDistance: parseFloat(
            (prevState.movingDistance + this.getDistance(start, coord)).toFixed(
              3,
            ),
          ),
        }))
      : null;
    if (parseFloat(this.getDistance(start, coord).toFixed(3))) {
      this.setState({
        currentDistance:
          this.state.goalDistance - this.state.movingDistance * 1000,
      });
    }
    console.log(this.state.movingDistance);
  };

  repeat = () => {
    this.timer = setInterval(() => {
      this.getCurrent();
    }, 2000);
    !this.state.isPolyline
      ? this.setState({ isPolyline: true })
      : this.setState({ isPolyline: false });
    this.setState({ isDisabled: true });
  };
  finish = async () => {
    let PastKcal;
    PastKcal = await AsyncStorage.getItem("Kcal");

    if (!isNaN(PastKcal)) {
      await AsyncStorage.setItem(
        "Kcal",
        String(parseInt(PastKcal) + this.state.kcal),
      );
    }
    clearInterval(this.timer);
    this.setState({
      coordinates: [],
      isPolyline: false,
      movingDistance: 0,
      isDisabled: false,
      kcal: 0,
    });
    console.log(PastKcal)

    console.log("finish");
  };

  getCurrent = () => {
    //setInterval(()=>{

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.state.isPolyline &&
        JSON.stringify(
          this.state.coordinates[this.state.coordinates.length - 1],
        ) !== JSON.stringify(coords)
          ? this.addCoord(coords)
          : null;

        if (this.state.initLatitude == 0) {
          this.setState({
            initLatitude: position.coords.latitude,
            initLongitude: position.coords.longitude,
          });
        }
      },
      error => {
        console.log(error);
      },
    );
    //,1000)
    //}
  };

  onMapPress = e => {
    this.setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };

  getDistance = (startCoords, destCoords) => {
    const startLatRads = this.degreesToRadians(startCoords.latitude);
    const startLongRads = this.degreesToRadians(startCoords.longitude);
    const destLatRads = this.degreesToRadians(destCoords.latitude);
    const destLongRads = this.degreesToRadians(destCoords.longitude);

    const Radius = 6371; //지구의 반경(km)
    const distance =
      Math.acos(
        Math.sin(startLatRads) * Math.sin(destLatRads) +
          Math.cos(startLatRads) *
            Math.cos(destLatRads) *
            Math.cos(startLongRads - destLongRads),
      ) * Radius;
    console.log(parseFloat(distance.toFixed(3)));
    let returnVar = parseFloat(distance.toFixed(3));
    isNaN(returnVar) ? (returnVar = 0) : null;
    return returnVar;
  };
  degreesToRadians = degrees => {
    radians = (degrees * Math.PI) / 180;
    return radians;
  };

  loadData = async () => {
    const Data = await AsyncStorage.getItem("Steps");
    const weight = await AsyncStorage.getItem("Weight");
    const num = await AsyncStorage.getItem("CurrentPosition");
    const PastKcal = await AsyncStorage.getItem("Kcal");
    const JsonData = JSON.parse(Data);
    if (isNaN(PastKcal)) {
      AsyncStorage.setItem("Kcal", String(0));
    }
    if (Number(num) === 5) {
      this.setState({ stored: true });
    }
    this.setState({ currentWeight: weight });

    console.log(JsonData);
    if (JsonData) {
      this.setState({ currentStepCount: JsonData });
    } else {
      this.setState({ currentStepCount: 0 });
    }
  };

  componentDidMount() {
    this._subscribe();
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.loadData();
    });
  }

  componentWillMount() {}

  componentWillUnmount() {
    // this._unsubscribe();
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.setState({ dialogVisible: false });
  };

  _subscribe = async () => {
    let PastKcal;
    console.log("실행스");
    this._subscription = Pedometer.watchStepCount(result => {
      let currentStepCount = this.state.currentStepCount + result.steps;
      AsyncStorage.setItem("Steps", String(currentStepCount));
      console.log("a");
      this.setState({
        currentStepCount,
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result),
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error,
        });
      },
    );

    const end = new Date();
    const start = new Date();
    // start.setDate(end.getDate() - 1);
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);

    console.log(start + "/" + end);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error,
        });
      },
    );
    PastKcal = await AsyncStorage.getItem("Kcal");
    if (!isNaN(PastKcal)) {
      console.log(111111 + PastKcal);
      Platform.OS == "ios"
        ? AsyncStorage.setItem(
            "Kcal",
            String(
              parseInt(PastKcal) + parseInt(this.state.pastStepCount / 30),
            ),
          )
        : AsyncStorage.setItem(
            "Kcal",
            String(
              parseInt(PastKcal) + parseInt(this.state.currentStepCount / 30),
            ),
          );
    }
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    const {
      isTimerStart,
      isStopwatchStart,
      timerDuration,
      resetTimer,
      resetStopwatch,
      isPedometerAvailable,
      pastStepCount,
      currentStepCount,
      dialogVisible,
      coordinates,
      initLatitude,
      initLongitude,
      goalDistance,
      isPolyline,
      currentDistance,
      isDisabled,
      speed,
      movingDistance,
      kcal,
      stored,
    } = this.state;
    return (
      <HealthPresenter
        isPedometerAvailable={isPedometerAvailable}
        pastStepCount={pastStepCount}
        currentStepCount={currentStepCount}
        onMapPress={this.onMapPress}
        dialogVisible={dialogVisible}
        handleCancel={this.handleCancel}
        handleDelete={this.handleDelete}
        showDialog={this.showDialog}
        coordinates={coordinates}
        mapView={this.mapView}
        repeat={this.repeat}
        finish={this.finish}
        initLatitude={initLatitude}
        initLongitude={initLongitude}
        isTimerStart={isTimerStart}
        isStopwatchStart={isStopwatchStart}
        timerDuration={timerDuration}
        resetTimer={resetTimer}
        resetStopwatch={resetStopwatch}
        startStopTimer={this.startStopTimer}
        funcResetTimer={this.resetTimer}
        startStopStopWatch={this.startStopStopWatch}
        funcresetStopwatch={this.resetStopwatch}
        getFormattedTime={this.getFormattedTime}
        setGoalDistance={this.setGoalDistance}
        goalDistance={goalDistance}
        isPolyline={isPolyline}
        currentDistance={currentDistance}
        isDisabled={isDisabled}
        getFullTime={this.getFullTime}
        speed={speed}
        movingDistance={movingDistance}
        kcal={kcal}
        stored={stored}
        getKcal={this.getKcal}
      ></HealthPresenter>
    );
  }
}
