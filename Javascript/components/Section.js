import React from "react";
import propType from "prop-types";
import styled from "styled-components";

const Container = styled.View`
  padding-vertical:15px;
`;

const Title = styled.Text`
  color: black;
  font-weight: 600;
  font-size:17px;
  padding-left: 20px;
  margin-bottom: 15px;
`;

const ScrollView = styled.ScrollView`
  /* padding-right:20px; */
  
`;

const Section = ({ title, children, horizontal = true }) => (
  <Container>
    <Title>{title}</Title>
    <ScrollView showsHorizontalScrollIndicator={false} horizontal={horizontal}>{children}</ScrollView>
  </Container>
);

Section.propType = {
  children: propType.oneOfType([
    propType.arrayOf(propType.node),
    propType.node,
  ]),
  title: propType.string.isRequired,
  horizontal: propType.bool,
};

export default Section;
