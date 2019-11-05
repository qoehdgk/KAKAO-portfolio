import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import HomeContainer from "../screens/Home/HomeContainer";
import MapContainer from "../screens/Map/MapContainer";
import PushContainer from "../screens/Push/PushContainer";
import { TAB_COLOR, GREY_COLOR, TINT_COLOR } from "../constants/Colors";
import TabBarIcon from "../components/TabBarIcon";
import MyTabBar from "../constants/TabBar";
import ChatContainer from "../screens/Chat/ChatContainer";
import {TabBar} from "react-native-animated-nav-tab-bar"
import FoodContainer from "../screens/Food/FoodContainer";
import HealthContainer from "../screens/Health/HealthContainer";

const TabNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeContainer,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS == "ios" ? "ios-home" : "md-home"}
          />
        ),
      },
    },
    Health: {
      screen: PushContainer,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS == "ios" ? "ios-heart-half" : "md-heart-half"}
          />
        ),
      },
    },
    Food: {
      screen: FoodContainer,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS == "ios" ? "ios-restaurant" : "md-restaurant"}
          />
        ),
      },
    },
    Exercise: {
      // screen: () => null,
      screen: HealthContainer,
      backBehavior: "order",
      navigationOptions: {
        // tabBarVisible:false,

        // tabBarOnPress: ({ navigation }) => {
        // navigation.navigate("ChatScreen");
        // },
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS == "ios" ? "ios-walk" : "md-walk"}
          />
        ),
      },
    },
    
  },
  {
    tabBarComponent: props =>
      Platform.OS === "ios" ? (
        <MyTabBar {...props} />
      ) : (
        <TabBar
          activeColors={"white"}
          activeTabBackgrounds={"#2dcf93"}
          tabBarBackground={"white"}
          {...props}
        />
      ),
    tabBarOptions: {
      activeTintColor: TINT_COLOR,
      activeBackgroundColor: "#0f8553",

      inactiveTintColor: GREY_COLOR,
      style: {
        // backgroundColor: TAB_COLOR,

        paddingTop: 3,
        borderTopWidth: 0,
      },
    },
  },
);

export default createAppContainer(TabNavigation);
