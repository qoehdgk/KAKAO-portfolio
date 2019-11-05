import React from "react";
import FoodPresenter from "./FoodPresenter";
import { AsyncStorage } from "react-native";

export default class FoodContainer extends React.Component {
  constructor() {
    super();
    // AsyncStorage.clear();
    this.loadData();
    this.state = {
      nutrient: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      BreakfastNut: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      LunchNut: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      DinnerNut: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      SnackNut: { kcal: 0, carbs: 0, protein: 0, fat: 0 },
      stored:false,
      recommend:0
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.loadData();
    });
  }

  changeValue = (kcal, carbs, protein, fat) => {
    const { nutrient } = this.state;
    nutrient.kcal += kcal;
    nutrient.carbs += carbs;
    nutrient.protein += protein;
    nutrient.fat += fat;
    this.setState({
      nutrient,
    });
    AsyncStorage.setItem("Nut", JSON.stringify(nutrient));
  };

  loadData =async()=>{
      const Data =await AsyncStorage.getItem("Nut");
      const JsonData = JSON.parse(Data);
      const num = await AsyncStorage.getItem("CurrentPosition");
      const recommend = await AsyncStorage.getItem("BMR+AM");
      if(Number(num)===5){
        this.setState({stored:true,recommend})
      }
      if(JsonData){
        this.setState({nutrient:JsonData});
      }
      else{
        this.setState({nutrient:{kcal:0,carbs:0,protein:0,fat:0}});
      }
    
  };

  render() {
    const {
      nutrient,
      BreakfastNut,
      LunchNut,
      DinnerNut,
      SnackNut,
      stored,
      recommend
    } = this.state;
    return (
      <FoodPresenter
        changeValue={this.changeValue.bind(this)}
        nutrient={nutrient}
        BreakfastNut={BreakfastNut}
        LunchNut={LunchNut}
        DinnerNut={DinnerNut}
        SnackNut={SnackNut}
        stored={stored}
        recommend={Math.round(recommend)}
      />
    );
  }
}
