import React from "react";
import { StatusBar } from "react-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import MainNavigation from "./navigation/MainNavigation";

export default class App extends React.Component {
  state = {
    loaded: false,
  };

  handleError = error => console.log(error);

  handleLoaded = () => this.setState({ loaded: true });

  loadAssets = async () => {
    await Font.loadAsync({
      ...Ionicons.font,
    });
  };

  componentDidMount = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    console.log(status);

    if (status != "granted") {
      const res = await Permissions.askAsync(Permissions.LOCATION);
    }
  };

  render() {
    const { loaded } = this.state;
    if (loaded) {
      return (
        <>
          <StatusBar backgroundColor="white" />
          <MainNavigation />
          
        </>
      );
    } else {
      return (
        <AppLoading
          startAsync={this.loadAssets}
          onFinish={this.handleLoaded}
          onError={this.handleError}
        />
      );
    }
  }
}
