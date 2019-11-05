import { createAppContainer, createStackNavigator } from "react-navigation";
import TabNavigation from "./TabNavigation";
import { headerStyles } from "../constants/HeaderStyle";
import ChatContainer from "../screens/Chat/ChatContainer";
import NewsContainer from "../screens/News/NewsContainer";
import BreakfastContainer from "../screens/FoodDetail/Breakfast/BreakfastContainer";
import LunchContainer from "../screens/FoodDetail/Lunch/LunchContainer";
import DinnerContainer from "../screens/FoodDetail/Dinner/DinnerContainer";
import SnackContainer from "../screens/FoodDetail/Snack/SnackContainer";
import SearchContainer from "../screens/Search/SearchContainer";
import SearchDetailContainer from "../screens/SearchDetail/SearchDetailContainer";
import HealthContainer from "../screens/Health/HealthContainer";

const MainNavigation = createStackNavigator(
  {
    TabNavigation: {
      screen: TabNavigation,
      navigationOptions: { title: "SHIELD", ...headerStyles },
    },
    ChatScreen: {
      screen: ChatContainer,
      navigationOptions: {
        ...headerStyles,
        title: "챗봇",
      },
    },
    NewsScreen: {
      screen: NewsContainer,
      navigationOptions: {
        ...headerStyles,
        title: "건강정보",
      },
    },
    BreakfastScreen: {
      screen: BreakfastContainer,
      navigationOptions: {
        ...headerStyles,
        title: "아침",
      },
    },
    LunchScreen: {
      screen: LunchContainer,
      navigationOptions: {
        ...headerStyles,
        title: "점심",
      },
    },
    DinnerScreen: {
      screen: DinnerContainer,
      navigationOptions: {
        ...headerStyles,
        title: "저녁",
      },
    },
    SnackScreen: {
      screen: SnackContainer,
      navigationOptions: {
        ...headerStyles,
        title: "간식",
      },
    },
    SearchScreen: {
      screen: SearchContainer,
      navigationOptions: {
        ...headerStyles,
        title: "검색",
      },
    },
    SearchDetailScreen: {
      screen: SearchDetailContainer,
      navigationOptions: {
        ...headerStyles,
        title: "상세정보",
      },
    },
    HealthScreen:{
      screen: HealthContainer,
      navigationOptions:{
        ...headerStyles,
        title: "걸음수",
      }
    }
  },
  {
    headerBackTitleVisible: false,
    navigationOptions: {
    },
  },
);

export default createAppContainer(MainNavigation);
