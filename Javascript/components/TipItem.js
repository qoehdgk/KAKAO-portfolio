import React from "react";
import { Text } from "react-native";
import propType from "prop-types";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation, touch } from "react-navigation";

const Container = styled.View`
  align-items: center;
  width: 140;
  padding-right: 20px;
  padding-left: 20px;
`;
const Image = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 25px;
  border-width:1px;
  border-color:#ababab;
  margin-bottom: 5px;
`;

const TipItem = ({ title, poster, navigation, author, description, url }) => (
  <Container>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate({
          routeName: "NewsScreen",
          params: { title, poster, author, url, description },
        })
      }
    >
      <Image source={{ uri: poster }} />
      <Text>{title.length > 20 ? `${title.substring(0, 19)}...` : title}</Text>
    </TouchableOpacity>
  </Container>
);

TipItem.propType = {
  title: propType.string.isRequired,
  poster: propType.string.isRequired,
};

export default withNavigation(TipItem);
