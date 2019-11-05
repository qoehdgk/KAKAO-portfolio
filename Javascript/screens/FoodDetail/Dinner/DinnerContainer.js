import React from "react";
import DinnerPresenter from "./DinnerPresenter";
import { AsyncStorage } from "react-native";
import uuidv1 from "uuid/v1";

export default class DinnerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loadData();
    const {
      navigation: {
        state: {
          params: { changeValue, DinnerNut ,myNut },
        },
      },
    } = props;

    this.state = {
      changeValue,
      DinnerNut,
      FoodList: {},
      myNut
    };
  }
  loadData = async () => {
    const Data = await AsyncStorage.getItem("Dinner");
    const Data2 = await AsyncStorage.getItem("DinnerNut");

    const JsonData = JSON.parse(Data);
    const JsonData2 = JSON.parse(Data2);

    if (JsonData && JsonData2) {
      this.setState({ FoodList: JsonData, DinnerNut: JsonData2 });
    } else {
      return;
    }
  };

  deleteDinner = id =>{
    this.setState(prevState=>{
      const FoodList =prevState.FoodList;
      delete FoodList[id];
      const newState={
        ...prevState,
        ...FoodList
      };
      AsyncStorage.multiSet([
        ["Dinner", JSON.stringify(newState.FoodList)],
        ["DinnerNut", JSON.stringify(this.state.DinnerNut)],
      ]);
      return {...newState}
    })
  } 
  addDinner = newFood => {
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
          ["Dinner", JSON.stringify(newState.FoodList)],
          ["DinnerNut", JSON.stringify(this.state.DinnerNut)],
        ]);
        return { ...newState };
      });
    }
  };

  changePartValue = DinnerNut => {
    this.setState({
      DinnerNut,
    });
  };

  render() {
    const { DinnerNut, changeValue, FoodList ,myNut } = this.state;
    return (
      <DinnerPresenter
        myNut={myNut}
        FoodList={FoodList}
        DinnerNut={DinnerNut}
        changeValue={changeValue}
        changePartValue={this.changePartValue}
        addDinner={this.addDinner}
        deleteDinner={this.deleteDinner}

      />
    );
  }
}
