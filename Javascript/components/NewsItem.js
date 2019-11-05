import React from "react";
import { Text } from "react-native";
import propType from "prop-types";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation, touch } from "react-navigation";
import Layout from "../constants/Layout";

const Container = styled.View`
  margin-left:10px;
  margin-right:10px;
  padding-left:10px;
  flex: 1;
  position: relative;
  width: ${Layout.width * 0.8};
  height: ${Layout.height / 4.8};
  flex-direction: row;
  border-radius: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: #ebebeb;
  align-items: center;
  justify-content: center;
`;

const BgImage = styled.Image`
  border-radius:15px;
  width: ${Layout.width * 0.8};
  opacity: 0.2;
  height: ${Layout.height / 4.8};
  position: absolute;
`;
const Column = styled.View`
  width: 60%;
  padding-left: 10px;
`;
const Title = styled.Text`
  font-size: 15px;
  font-weight: bold;
  padding-bottom:15px;
`;

const Image = styled.Image`
  width: 35%;
  height: 80%;
  border-radius: 15px;
  border-width: 1px;
  border-color: #ababab;
`;

const Btn = styled.TouchableOpacity`
  width:60%;
  align-items:center;
  background-color:#e74c3c; 
  padding:5px;
  border-radius:2.5px;
`; 

const BtnText = styled.Text`
  color:#dbdbdb;

`;

const NewsItem = ({ title, poster, navigation, author, description, url }) => (
  <Container>
    <BgImage source={{ uri: poster }} />
    <Image source={{ uri: poster }} />
    <Column>
      <Title>
        {title.length > 40 ? `${title.substring(0, 39)}...` : title}
      </Title>
      <Btn
        onPress={() =>
          navigation.navigate({
            routeName: "NewsScreen",
            params: { title, poster, author, url, description },
          })
        }
      ><BtnText>자세히보기</BtnText></Btn>
    </Column>
  </Container>
);

NewsItem.propType = {
  title: propType.string.isRequired,
  poster: propType.string.isRequired,
};

export default withNavigation(NewsItem);
