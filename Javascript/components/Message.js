import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import { GREY_COLOR } from "../constants/Colors";

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toDoValue: props.text };
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    createAt: PropTypes.object.isRequired,
    isDanbee: PropTypes.bool.isRequired
  };

  render() {
    const { toDoValue } = this.state;
    const { text, id, createAt, isDanbee } = this.props;
    const styles = StyleSheet.create({
      Main: {
        alignItems: "center",
        flexDirection: isDanbee ? "row" : "row-reverse"
      },
      Msg: {
        borderRadius: 10,
        backgroundColor: "#2ff7ed",
        padding: 10,
        maxWidth: 220,
        margin: 10
      },
      time: {
        fontSize: 12,
        color: "#808080"
      },
      MsgText:{
        fontWeight:"600"
      }
    });
    return (
      <View style={styles.Main}>
        <View style={styles.Msg}>
          <Text style={styles.MsgText}>{text}</Text>
        </View>
        <Text style={styles.time}>
          {createAt.getHours() < 13
            ? `오전 ${
                createAt.getHours() < 10
                  ? `0${createAt.getHours()}`
                  : createAt.getHours()
              }`
            : `오후 ${
                createAt.getHours() - 12 < 10
                  ? `0${createAt.getHours() - 12}`
                  : createAt.getHours() - 12
              }`}

          {createAt.getMinutes() < 10
            ? `:0${createAt.getMinutes()}`
            : `:${createAt.getMinutes()}`}
        </Text>
      </View>
    );
  }
}
