import React from "react";
import LunchPresenter from "./LunchPresenter";
import { AsyncStorage } from "react-native";
import uuidv1 from "uuid/v1";

export default class LunchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loadData();

    const {
      navigation: {
        state: {
          params: { changeValue, LunchNut,myNut },
        },
      },
    } = props;

    this.state = {
      changeValue,
      LunchNut,
      FoodList: {},
      myNut
    };
  }
  loadData = async () => {
    const Data = await AsyncStorage.getItem("Lunch");
    const Data2 = await AsyncStorage.getItem("LunchNut");

    const JsonData = JSON.parse(Data);
    const JsonData2 = JSON.parse(Data2);

    if (JsonData && JsonData2) {
      this.setState({ FoodList: JsonData, LunchNut: JsonData2 });
    } else {
      return;
    }
  };

  deleteLunch = id =>{
    this.setState(prevState=>{
      const FoodList =prevState.FoodList;
      delete FoodList[id];
      const newState={
        ...prevState,
        ...FoodList
      };
      AsyncStorage.multiSet([
        ["Lunch", JSON.stringify(newState.FoodList)],
        ["LunchNut", JSON.stringify(this.state.LunchNut)],
      ]);
      return {...newState}
    })
  } 
  addLunch = newFood => {
    if (newFood !== null) {
      this.setState(prevState => {
        const ID = uuidv1();
        const newFoodObj = {
          [ID]: {
            id: ID,
            obj: newFood,
          },
        };
        const newState = {
          ...prevState,
          FoodList: {
            ...prevState.FoodList,
            ...newFoodObj,
          },
        };
        AsyncStorage.multiSet([
          ["Lunch", JSON.stringify(newState.FoodList)],
          ["LunchNut", JSON.stringify(this.state.LunchNut)],
        ]);

        return { ...newState };
      });
    }
  };

  changePartValue = LunchNut => {
    this.setState({
      LunchNut,
    });
  };

  render() {
    const { LunchNut, changeValue, FoodList ,myNut } = this.state;
    return (
      <LunchPresenter
        myNut={myNut}
        FoodList={FoodList}
        LunchNut={LunchNut}
        changeValue={changeValue}
        changePartValue={this.changePartValue}
        addLunch={this.addLunch}
        deleteLunch={this.deleteLunch}
      />
    );
  }
}
