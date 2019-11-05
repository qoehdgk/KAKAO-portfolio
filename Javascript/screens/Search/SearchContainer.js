import React from "react";
import SearchPresenter from "./SearchPresenter";
import axios from "axios";
var parseString = require("react-native-xml2js").parseString;

const DATA_KEY =
  "ok5U7zvwJ2BXvndun5rYy%2BaKAKoWXLE0XXQAU5hAM7AWUimTgWQsEbsPf%2FOzPeegE3jn6iae6On07VQuTW8ZZA%3D%3D";

export default class FoodContainer extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: { changePartValue , partNut,changeValue ,addFood},
        },
      },
    } = props;

    this.state = {
      changePartValue,
      changeValue,
      partNut,
      addFood,

      loading: false,
      searchTerm: "",
      error: null,
      results: [],
    };
  }


  handleSearchUpdate = text => {
    this.setState({
      searchTerm: text,
    });
  };

  onSubmitEditing = async () => {
    const { searchTerm } = this.state;
    console.log(searchTerm);
    if (searchTerm != "") {
      let foodXml, error, foodJson;
      this.setState({
        loading: true,
      });
      try {
        ({ data: foodXml } = await axios.get(
          `http://apis.data.go.kr/1470000/FoodNtrIrdntInfoService/getFoodNtrItdntList?ServiceKey=${DATA_KEY}&numOfRows=50&pageNo=1&desc_kor=${encodeURI(
            searchTerm,
          )}`,
        ));
        parseString(foodXml, function(err, res) {
          foodJson = res.response.body[0].items[0].item;
        });
      } catch {
        error = "Can't Search";
      } finally {
        this.setState({
          loading: false,
          results: foodJson,
          error,
        });
        console.log(foodJson, 1);
        console.log(foodJson[0].BGN_YEAR[0]);
        console.log(foodJson[0].DESC_KOR[0]);
      }
    }
    return;
  };

  render() {
    const {
      loading,
      searchTerm,
      results,
      changePartValue,
      partNut,
      changeValue,
      addFood 
    } = this.state;

    return (
      <SearchPresenter
        handleSearchUpdate={this.handleSearchUpdate}
        onSubmitEditing={this.onSubmitEditing}
        searchTerm={searchTerm}
        results={results}
        loading={loading}
        changePartValue={changePartValue}
        changeValue={changeValue}
        partNut={partNut}
        addFood={addFood}
        />
    );
  }
}
