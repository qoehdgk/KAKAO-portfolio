import React from "react";
import ChatPresenter from "./ChatPresenter";
import { StyleSheet } from "react-native";
import { DanbeeApi } from "../../api";
import uuidv1 from "uuid/v1";
import axios from "axios";

export default class ChatContainer extends React.Component {
  state = {
    newMsg: "",
    Messages: {},
    welcomeResult: null,
    sendResult: null,
    chatflow_id: "",
    ins_id: "",
    intent_id: "",
    node_id: "",
    param_id: "",
    parameters: "",
    session_id: "",
    error: null,
    date: new Date(),
  };

  async componentWillMount() {
    let welcomeResult, error;
    try {
      welcomeResult = await DanbeeApi.getWelcome();
    } catch (error) {
      error = "Can't get Welcome.";
    } finally {
      this.setState({
        welcomeResult,
        error,
      });
    }
  }

  controllNewMsg = text => {
    this.setState({
      newMsg: text,
    });
  };

  addMsg = () => {
    const { newMsg } = this.state;
    if (newMsg != "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newMsgObj = {
          [ID]: {
            id: ID,
            text: newMsg,
            createAt: new Date(),
            isDanbee: false,
          },
        };
        const newState = {
          ...prevState,
          newMsg: "",
          Messages: {
            ...prevState.Messages,
            ...newMsgObj,
          },
        };
        return { ...newState };
      });
    }
  };

  sendMsg = async (sendResult, error) => {
    const {
      newMsg,
      intent_id,
      param_id,
      session_id,
      node_id,
      ins_id,
      chatflow_id,
    } = this.state;
    let parameters;
    console.log(intent_id, param_id);
    console.log("1");

    if (newMsg !== "") {
      console.log("newMsg" + newMsg);
      try {
        console.log("param : " + parameters);
        sendResult = await DanbeeApi.getAnswer(
          newMsg,
          intent_id,
          param_id,
          parameters,
          session_id,
          node_id,
          ins_id,
          chatflow_id,
        );
      } catch (error) {
        error = "Can't get Answer";
      } finally {
        this.setState({
          sendResult,
          error,
          intent_id: sendResult.data.responseSet.result.intent_id,
          param_id: sendResult.data.responseSet.result.param_id,
          ins_id: sendResult.data.responseSet.result.ins_id,
          session_id: sendResult.data.responseSet.result.session_id,
          node_id: sendResult.data.responseSet.result.node_id,
          chatflow_id: sendResult.data.responseSet.result.chatflow_id,
        });

        console.log(sendResult);
      }
      this.setState(prevState => {
        const ID = uuidv1();
        const newMsgObj = {
          [ID]: {
            id: ID,
            text: sendResult.data.responseSet.result.result[0].message,
            createAt: new Date(),
            isDanbee: true,
          },
        };
        const newState = {
          ...prevState,
          newMsg: "",
          Messages: {
            ...prevState.Messages,
            ...newMsgObj,
          },
        };
        return { ...newState };
      });
    }
  };

  render() {
    const {
      newMsg,
      Messages,
      welcomeResult,
      sendResult,
      date,
    } = this.state;
    return (
      <ChatPresenter
        welcomeResult={welcomeResult}
        sendResult={sendResult}
        date={date}
        newMsg={newMsg}
        controllNewMsg={this.controllNewMsg}
        addMsg={this.addMsg}
        sendMsg={this.sendMsg}
        Messages={Messages}
      />
    );
  }
}
