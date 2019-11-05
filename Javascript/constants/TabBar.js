import React from "react";
import TabBar from "react-native-fluidbottomnavigation";
import { View } from "react-native";

export default class extends React.Component {
  state={
    focused:0
  }

  navigationHandler = (tabIndex, navigation) => {
    if (tabIndex == 0) {
      this.props.navigation.navigate("Home");
      this.setState({focused:0})
    } else if (tabIndex == 1) {
      this.props.navigation.navigate("Health");
      this.setState({focused:1})
    } else if (tabIndex == 2) {
      this.props.navigation.navigate("Food");
      this.setState({focused:2})

    } else if (tabIndex == 3) {
      this.props.navigation.navigate("Exercise");
      this.setState({focused:3})
    } else return null;
  };

 
  
  render() {
    const { navigation } = this.props;
    const routes = navigation.state.routes;
    const {focused}=this.state;
    return (
      <View>
        <TabBar
          tintColor="white"
          containerBackgroundColor="#2dcf93"
          itemMaskBackgroundColor="#2dcf93"
          onPress={tabIndex => {
            this.navigationHandler(tabIndex, navigation);
          }}
          values={[
            {
              title: "Home",
              icon: require("../assets/home.png"),
              default: true,
              tintColor: focused== 0 ?   "#2dcf93":"white",
            },
            {
              title: "Health",
              icon: require("../assets/health.png"),
              tintColor: focused == 1 ?  "#2dcf93":"white",
            },
            {
              title: "Food",
              icon: require("../assets/food.png"),
              tintColor:focused == 2 ?  "#2dcf93":"white",
            },
            {
              title: "Exercise",
              icon: require("../assets/walk.png"),
              tintColor: focused == 3 ? "#2dcf93":"white",
            }
          ]}
        />
      </View>
    );
  }
}
