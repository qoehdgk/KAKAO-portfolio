import React from "react";
import { Text,TouchableOpacity,Button,Alert } from "react-native";
import propType from "prop-types";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import Layout from "../constants/Layout";


const Container = styled.View`
  align-items: center;
`;

const FoodBtn = styled.TouchableOpacity`
  width: ${Layout.width / 1.2};
  height: 30px;
  border-radius: 10px;
  background-color: #ededed;
  align-items: center;
  margin-bottom: 3px;
  flex-direction: row;
  justify-content: space-between;
`;
const BtnText = styled.Text`
  padding-left: 10px;
`;
const CheckBtn = styled.TouchableOpacity``;

const CheckText = styled.Text`
  font-size: 20px;
  padding-right: 10px;
`;

const FoodItem = ({
  id,
  result,
  navigation,
  changePartValue,
  changeValue,
  addFood,
  deleteFood,
  isMine,

  partNut,
}) => (
  <Container>
    
    <FoodBtn
      onPress={() =>
        navigation.navigate({
          routeName: "SearchDetailScreen",
          params: { result, changePartValue, partNut, changeValue, addFood,isMine },
        })
      }
    >
      <BtnText>{result.DESC_KOR[0]}</BtnText>
      {isMine ? (
        <CheckBtn
          onPress={() => {
          
            partNut.kcal -= parseInt(result.NUTR_CONT1[0]);
            partNut.carbs -= parseInt(result.NUTR_CONT2[0]);
            partNut.protein -= parseInt(result.NUTR_CONT3[0]);
            partNut.fat -= parseInt(result.NUTR_CONT4[0]);

            changePartValue(partNut);
            changeValue(
              -parseInt(result.NUTR_CONT1[0]),
              -parseInt(result.NUTR_CONT2[0]),
              -parseInt(result.NUTR_CONT3[0]),
              -parseInt(result.NUTR_CONT4[0]),
            );
            deleteFood(id);
          }}
        >
          <CheckText>✖</CheckText>
        </CheckBtn>
      ) : (
        <CheckBtn
          onPress={() => {
         

            partNut.kcal += parseInt(result.NUTR_CONT1[0]);
            partNut.carbs += parseInt(result.NUTR_CONT2[0]);
            partNut.protein += parseInt(result.NUTR_CONT3[0]);
            partNut.fat += parseInt(result.NUTR_CONT4[0]);

            changePartValue(partNut);
            changeValue(
              parseInt(result.NUTR_CONT1[0]),
              parseInt(result.NUTR_CONT2[0]),
              parseInt(result.NUTR_CONT3[0]),
              parseInt(result.NUTR_CONT4[0]),
            );
            addFood(result);
            Alert.alert("추가완료","",[{text: "확인"}])
          }}
        >
          <CheckText>☑</CheckText>
        </CheckBtn>
      )}
    </FoodBtn>
  </Container>
);

FoodItem.propType = {
  result: propType.object.isRequired,
};

export default withNavigation(FoodItem);
