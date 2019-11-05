import React from "react";
import SnackPresenter from "./SnackPresenter";
import { AsyncStorage } from "react-native";
import uuidv1 from "uuid/v1";



export default class SnackContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loadData();

    const {
      navigation: {
        state: {
          params: { changeValue, SnackNut ,myNut },
        },
      },
    } = props;

    this.state = {
      changeValue,
      SnackNut,
      FoodList:{},
      myNut

    };
  }

  loadData = async () => {
    const Data = await AsyncStorage.getItem("Snack");
    const Data2 = await AsyncStorage.getItem("SnackNut");

    const JsonData = JSON.parse(Data);
    const JsonData2 = JSON.parse(Data2);

    if (JsonData && JsonData2) {
      this.setState({ FoodList: JsonData, SnackNut: JsonData2 });
    } else {
      return;
    }
  };
  deleteSnack = id =>{
    this.setState(prevState=>{
      const FoodList =prevState.FoodList;
      delete FoodList[id];
      const newState={
        ...prevState,
        ...FoodList
      };
      AsyncStorage.multiSet([
        ["Snack", JSON.stringify(newState.FoodList)],
        ["SnackNut", JSON.stringify(this.state.SnackNut)],
      ]);
      return {...newState}
    })
  } 
  addSnack = newFood => {
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
          ["Snack", JSON.stringify(newState.FoodList)],
          ["SnackNut", JSON.stringify(this.state.SnackNut)],
        ]);
        return { ...newState };
      });
    }
  };

  changePartValue = SnackNut => {
    this.setState({
      SnackNut,
    });
  };

  render() {
    const { SnackNut, changeValue,FoodList ,myNut } = this.state;
    return (
      <SnackPresenter
        myNut={myNut}
        FoodList={FoodList}
        SnackNut={SnackNut}
        changeValue={changeValue}
        changePartValue={this.changePartValue}
        addSnack={this.addSnack}
        deleteSnack={this.deleteSnack}
      />
    );
  }
}
