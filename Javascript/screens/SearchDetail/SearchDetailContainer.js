import React from "react";
import SearchDetailPresenter from "./SearchDetailPresenter";

export default class SearchDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: { changePartValue, result,partNut ,changeValue,addFood,isMine  },
        },
      },
    } = props;

    this.state = {
      changePartValue,
      changeValue,
      addFood,
      isMine,
      
      result,
      partNut
    };
  }

  render() {
    const { result,changePartValue,partNut,changeValue,addFood,isMine } = this.state;
    return (
      <SearchDetailPresenter
        result={result}
        changePartValue={changePartValue}
        changeValue={changeValue}
        partNut={partNut}
        addFood={addFood}
        isMine={isMine}
      />
    );
  }
}
