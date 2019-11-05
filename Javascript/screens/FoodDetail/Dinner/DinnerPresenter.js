import React from "react";
import { Text, Platform } from "react-native";
import styled from "styled-components";
import propType from "prop-types";
import { withNavigation } from "react-navigation";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import Layout from "../../../constants/Layout";
import AwesomeButton from "react-native-really-awesome-button";
import FoodItem from "../../../components/FoodItem";

const MainContainer = styled.View`
  flex: 1;
`;

const Container = styled.View`
  height: 55%;
  justify-content:space-around;

`;
const ResultContainer = styled.ScrollView`
  padding-top:10px;

  height: 45%;
`;

const Header = styled.View`
  padding-top: 20px;
  align-items: center;
  padding-bottom: 20px;
`;

const KcalBax = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;

const MyKcal = styled.Text`
  font-size: 40px;
  font-weight: bold;
`;

const Kcal = styled.Text`
  padding-bottom: 15px;
  font-size: 15px;
  font-weight: bold;
`;

const NutContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 40px;
  flex-direction: row;
  justify-content: space-around;
`;
const NutBox = styled.View`
  align-items: center;
  justify-content: center;
`;

const NutName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  text-decoration-line:underline;
  text-decoration-color:green;
  padding-bottom:10px;
`;

const NutValue = styled.Text`
  font-size:17px;
  font-weight:400;
`;

const Body = styled.View`
  flex-direction: row;
  padding-left: 30px;
  padding-right: 25px;
  justify-content: space-between;
  align-items:center;
`;

const TitleBox = styled.View``;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 500;
`;

const EmptyView= styled.View`
  align-items:center;
  padding-top:50px;
`;

const EmptyText = styled.Text`
  color:#cccccc;
  font-size:22px;
`;

const DinnerPresenter = ({
  navigation,
  DinnerNut,
  changePartValue,
  changeValue,
  addDinner,
  deleteDinner,
  FoodList,
  myNut,
}) => (
  <MainContainer>
    <Container>
      <Header>
        <KcalBax>
          <MyKcal>{DinnerNut.kcal}</MyKcal>
          <Kcal> / {Math.floor(myNut * 0.25)} kcal(권장)</Kcal>
        </KcalBax>
        <ProgressBarAnimated
          width={Layout.width / 1.2}
          value={
            DinnerNut.kcal > myNut * 0.25
              ? 100
              : DinnerNut.kcal / ((myNut * 0.25) / 100)
          }
          maxValue={500}
          height={20}
          backgroundColor="#2dcf93"
          borderColor="#2dcf93"
        />
      </Header>
      <NutContainer>
        <NutBox>
          <NutName>탄수화물</NutName>
          <NutValue>{DinnerNut.carbs} g</NutValue>
        </NutBox>
        <NutBox>
          <NutName>단백질</NutName>
          <NutValue>{DinnerNut.protein} g</NutValue>
        </NutBox>
        <NutBox>
          <NutName>지방</NutName>
          <NutValue>{DinnerNut.fat} g</NutValue>
        </NutBox>
      </NutContainer>
      <Body>
        <TitleBox>
          <Title>음식리스트</Title>
        </TitleBox>
        <AwesomeButton
          width={80}
          height={30}
          onPress={() =>
            navigation.navigate({
              routeName: "SearchScreen",
              params: {
                changeValue,
                changePartValue,
                partNut: DinnerNut,
                addFood: addDinner,
              },
            })
          }
        >
          <Text>+ 음식추가</Text>
        </AwesomeButton>
      </Body>
    </Container>
    <ResultContainer>
      {JSON.stringify(FoodList)!=="{}"?Object.values(FoodList).map(food => (
        <FoodItem
          key={food.id}
          id={food.id}
          result={food.obj}
          isMine={true}
          partNut={DinnerNut}
          changePartValue={changePartValue}
          changeValue={changeValue}
          deleteFood={deleteDinner}

        />
      )):<EmptyView><EmptyText>음식을 추가해주세요!</EmptyText></EmptyView>}
    </ResultContainer>
  </MainContainer>
);

DinnerPresenter.propType = {};

export default withNavigation(DinnerPresenter);
