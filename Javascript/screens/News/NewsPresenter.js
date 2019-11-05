import React from "react";
import { Text, StyleSheet ,TouchableOpacity } from "react-native";
import styled from "styled-components";
import propType from "prop-types";
import Layout from "../../constants/Layout";
import { LinearGradient } from "expo-linear-gradient";
import { Linking } from "expo";

const Container = styled.View`
  position: relative;
  flex: 1;
`;

const BgImage = styled.Image`
  width: ${Layout.width};
  height: ${Layout.height};
  position: absolute;
  opacity: 0.08;
  top: 0;
`;
const MainImage = styled.Image`
  width: ${Layout.width * 0.9};
  height: ${Layout.height / 3.4};
  border-radius: 20px;
`;

const Header = styled.View`
  align-items: center;
  padding-bottom: 35px;
`;

const Title = styled.Text`
  padding-left: 15px;
  font-size: 20px;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 15px;
`;

const Body = styled.View`
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 20px;
`;

const BodyContent = styled.Text`
  font-size: 15px;
`;
const Author = styled.View`
  align-items: flex-end;
  padding-right: 15px;
  padding-bottom: 20px;
`;

const AuthorName = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const SourceContainer = styled.View`
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
`;

const Source = styled.View`
  width: 70%;
`;

const SourceText = styled.Text``;

const Btn = styled.TouchableOpacity`
  background-color: yellow;
  border: 2px solid black;
  border-radius: 10px;
  width: 70px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const BtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;



const NewsPresenter = ({ title, poster, author, description, url,navigation }) => (
  <Container>
    <BgImage source={{ uri: poster }}  />
    <Header>
      <Title>{title}</Title>
      <MainImage source={{ uri: poster }}  />
    </Header>
    <Body>
      <BodyContent>요약문 : {description.replace("<b>","").replace("</b>","")}</BodyContent>
    </Body>
    <Author>
      <AuthorName>By {author}</AuthorName>
    </Author>
    <SourceContainer>
      <Source>
        <SourceText>출처 : {url}</SourceText>
      </Source>
      <Btn onPress={()=>Linking.openURL(url)}>
        <BtnText>원문 보기</BtnText>
      </Btn>
    </SourceContainer>
  </Container>
);

NewsPresenter.propType = {};

const styles = StyleSheet.create({});

export default NewsPresenter;
