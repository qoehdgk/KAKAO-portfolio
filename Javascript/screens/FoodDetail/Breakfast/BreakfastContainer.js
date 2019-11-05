import React from "react";
import BreakfastPresenter from "./BreakfastPresenter";
import uuidv1 from "uuid/v1";
import { AsyncStorage } from "react-native";

export default class BreakfastContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loadData();
    const {
      navigation: {
        state: {
          params: { changeValue, BreakfastNut,myNut },
        },
      },
    } = props;

    this.state = {
      changeValue,
      BreakfastNut,
      FoodList: {},
      myNut
    };
  }

  loadData = async () => {
    const Data = await AsyncStorage.getItem("Breakfast");
    const Data2 = await AsyncStorage.getItem("BreakfastNut");

    const JsonData = JSON.parse(Data);
    const JsonData2 = JSON.parse(Data2);

    console.log(JsonData);
    if (JsonData && JsonData2) {
      this.setState({ FoodList: JsonData, BreakfastNut: JsonData2 });
    } else {
      return;
    }
  };

  deleteBreakfast = id =>{
    this.setState(prevState=>{
      const FoodList =prevState.FoodList;
      delete FoodList[id];
      const newState={
        ...prevState,
        ...FoodList
      };
      AsyncStorage.multiSet([
        ["Breakfast", JSON.stringify(newState.FoodList)],
        ["BreakfastNut", JSON.stringify(this.state.BreakfastNut)],
      ]);
      return {...newState}
    })
  } 
  addBreakfast = newFood => {
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
          ["Breakfast", JSON.stringify(newState.FoodList)],
          ["BreakfastNut", JSON.stringify(this.state.BreakfastNut)],
        ]);
        return { ...newState };
      });
    }
  };

  changePartValue = BreakfastNut => {
    this.setState({
      BreakfastNut,
    });
  };

  render() {
    const { BreakfastNut, changeValue, FoodList ,myNut } = this.state;
    return (
      <BreakfastPresenter
        myNut={myNut}
        FoodList={FoodList}
        BreakfastNut={BreakfastNut}
        changeValue={changeValue}
        changePartValue={this.changePartValue}
        addBreakfast={this.addBreakfast}
        deleteBreakfast={this.deleteBreakfast}
      />
    );
  }
}
