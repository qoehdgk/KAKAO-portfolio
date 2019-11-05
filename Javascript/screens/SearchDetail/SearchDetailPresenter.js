import React from "react";
import { Text, Platform } from "react-native";
import styled from "styled-components";
import propType from "prop-types";
import { withNavigation } from "react-navigation";
import AwesomeButton from "react-native-really-awesome-button";
const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  height: 10%;
  padding-top: 20px;
  align-items: center;
  padding-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const Body = styled.View`
  padding-top: 30px;
  padding-left: 50px;
  padding-right: 50px;
  height: 80%;
  margin-left: 10px;
  margin-right: 10px;
  border: 2px solid #7d7d7d;
  background-color: #f0eded;
`;

const Footer = styled.View`
  height: 10%;
  padding-top: 15px;
  padding-right: 15px;
  align-items: flex-end;
`;

const FooterText = styled.Text`
  font-size: 20px;
  font-weight: 500;
`;

const NutBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 2px;
  border-bottom-color: black;
`;

const NutValue = styled.Text`
  padding-bottom: 3px;
  padding-top: 3px;
  font-size: 18px;
  font-weight: 500;
`;

const BtnContainer = styled.View`
  padding-top: 30px;
  align-items: center;
`;

const SearchDetailPresenter = ({
  navigation,
  result,
  changePartValue,
  partNut,
  changeValue,
  addFood,
  isMine,
}) => (
  <Container>
    <Header>
      <Title>{result.DESC_KOR[0]}</Title>
    </Header>
    <Body>
      <NutBox>
        <NutValue>1회제공량 </NutValue>
        <NutValue>{result.SERVING_WT[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>열량 </NutValue>
        <NutValue>{result.NUTR_CONT1[0]}(kcal)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>탄수화물 </NutValue>
        <NutValue>{result.NUTR_CONT2[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>단백질 </NutValue>
        <NutValue>{result.NUTR_CONT3[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>지방 </NutValue>
        <NutValue>{result.NUTR_CONT4[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>당류 </NutValue>
        <NutValue>{result.NUTR_CONT5[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>나트륨 </NutValue>
        <NutValue>{result.NUTR_CONT6[0]}(mg)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>콜레스테롤 </NutValue>
        <NutValue>{result.NUTR_CONT7[0]}(mg)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>포화지방산 </NutValue>
        <NutValue>{result.NUTR_CONT8[0]}(g)</NutValue>
      </NutBox>
      <NutBox>
        <NutValue>트랜스지방산</NutValue>
        <NutValue>{result.NUTR_CONT9[0]}(g)</NutValue>
      </NutBox>
      <BtnContainer>
        {!isMine ? (
          <AwesomeButton
            width={160}
            height={50}
            onPress={() => {
              partNut.kcal += parseInt(result.NUTR_CONT1[0]);
              partNut.carbs += parseInt(result.NUTR_CONT2[0]);
              partNut.protein += parseInt(result.NUTR_CONT3[0]);
              partNut.fat += parseInt(result.NUTR_CONT4[0]);

              console.log(partNut.kcal, partNut.carbs);

              navigation.navigate({ routeName: "SearchScreen" });
              changePartValue(partNut);
              changeValue(
                parseInt(result.NUTR_CONT1[0]),
                parseInt(result.NUTR_CONT2[0]),
                parseInt(result.NUTR_CONT3[0]),
                parseInt(result.NUTR_CONT4[0]),
              );
              addFood(result);
            }}
          >
            <Text>+ 추가하기</Text>
          </AwesomeButton>
        ) : (
          <AwesomeButton
            width={160}
            height={50}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text>+ 뒤로가기</Text>
          </AwesomeButton>
        )}
      </BtnContainer>
    </Body>
    <Footer>
      <FooterText>식품의약품안전처 제공</FooterText>
    </Footer>
  </Container>
);

export default withNavigation(SearchDetailPresenter);
