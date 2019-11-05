import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from "react-native";
import Dialog from "react-native-dialog";
import AwesomeButton from "react-native-really-awesome-button";

export default class DialogTester extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible: false,
      searchTerm: "",
      selected: "",
    };
  }

  handleActivity = value => {
    this.props.changeValue(value);
  };

  handleGender = value => {
    this.props.changeValue(value);
    this.setState({ dialogVisible: false });
  };

  changeSelect = value => {
    this.setState({
      selected: value,
    });
  };

  handleInputUpdate = text => {
    this.setState({
      searchTerm: text,
    });
  };

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleMeasure = () => {
    if (this.props.connected === "1") {
      console.log(this.props.sensorValue);
      this.props.changeValue(this.props.sensorValue);
      this.setState({ dialogVisible: false });
     
    } else {
      console.log("연결 안됨");
      Alert.alert("Error", "연결이 원활하지 않습니다.", [{
        text: "확인",
        onPress: this.handleCancel,
      }]);
    }
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleInput = () => {
    this.props.changeValue(this.state.searchTerm);
    this.setState({ dialogVisible: false, searchTerm: "" });
  };

  render() {
    const { name, type } = this.props;
    const { searchTerm, selected } = this.state;
    if (type === "선택") {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Select", `"측정하기" or "입력하기"`, [
                {
                  text: "측정하기",
                  onPress: () => {
                    this.showDialog();
                    this.changeSelect("측정");
                  },
                },
                {
                  text: "입력하기",
                  onPress: () => {
                    this.showDialog();
                    this.changeSelect("입력");
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ])
            }
          >
            <Image
              source={require("../assets/btn.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          {selected === "입력" ? (
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{`${name}`}</Dialog.Title>
              <Dialog.Description>{`빈칸에 ${name}를 입력해주세요.`}</Dialog.Description>
              <Dialog.Input
                placeholder={
                  name === "나이"
                    ? "Ex) 25 , 30"
                    : name === "키"
                    ? "Ex) 160.5 , 180"
                    : "Ex) 48.5 , 74 "
                }
                keyboardType={"numeric"}
                onChangeText={this.handleInputUpdate}
                value={searchTerm}
              />
              <Dialog.Button label="취소" onPress={this.handleCancel} />
              <Dialog.Button label="입력" onPress={this.handleInput} />
            </Dialog.Container>
          ) : (
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{`${name}`}</Dialog.Title>
              {name === "키" ? (
                <Dialog.Description>{`체중계 위에 올라선 후 
허리를 곧게 피고  
"측정" 을 눌러주세요.`}</Dialog.Description>
              ) : (
                <Dialog.Description>{`체중계 위에 올라선 후 
"측정" 을 눌러주세요.`}</Dialog.Description>
              )}
              <Dialog.Button label="취소" onPress={this.handleCancel} />
              <Dialog.Button label="측정" onPress={this.handleMeasure} />
            </Dialog.Container>
          )}
        </View>
      );
    } else if (type == "입력") {
      return (
        <View>
          <TouchableOpacity onPress={this.showDialog}>
            <Image
              source={require("../assets/btn.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>{`${name}`}</Dialog.Title>
            <Dialog.Description>{`빈칸에 ${name}를 입력해주세요.`}</Dialog.Description>
            <Dialog.Input
              placeholder={
                name === "나이"
                  ? "Ex) 25 , 30"
                  : name === "키"
                  ? "Ex) 160.5 , 180"
                  : "Ex) 48.5 , 74 "
              }
              keyboardType={"number-pad"}
              onChangeText={this.handleInputUpdate}
              value={searchTerm}
            />
            <Dialog.Button label="취소" onPress={this.handleCancel} />
            <Dialog.Button label="입력" onPress={this.handleInput} />
          </Dialog.Container>
        </View>
      );
    } else if (type == "측정") {
      return (
        <View>
          <TouchableOpacity onPress={this.showDialog}>
            <Image
              source={require("../assets/btn.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>{`${name}`}</Dialog.Title>
            {name === "체온" ? (
              <Dialog.Description>{`체온센서에 손을 근접시킨 후  
"측정" 을 눌러주세요.`}</Dialog.Description>
            ) : (
              <Dialog.Description>{`심박수센서에 검지손가락을 댄 후 
"측정" 을 눌러주세요.`}</Dialog.Description>
            )}

            <Dialog.Button label="취소" onPress={this.handleCancel} />
            <Dialog.Button label="측정" onPress={this.handleMeasure} />
          </Dialog.Container>
        </View>
      );
    } else if (type == "성별") {
      return (
        <View>
          <TouchableOpacity onPress={this.showDialog}>
            <Image
              source={require("../assets/btn.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>{`${name}`}</Dialog.Title>
            <Dialog.Description>{`${name}을 선택해주세요`}</Dialog.Description>

            <Dialog.Button
              label="남성"
              onPress={() => {
                this.props.changeValue("남성");
                this.handleCancel();
              }}
            />
            <Dialog.Button
              label="여성"
              onPress={() => {
                this.props.changeValue("여성");
                this.handleCancel();
              }}
            />
          </Dialog.Container>
        </View>
      );
    } else if (type === "활동량") {
      if (Platform.OS === "ios") {
        return (
          <View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("하루 활동량", "", [
                  {
                    text: "(1)활동이 적거나 운동을 안할 경우",
                    onPress: () => this.props.changeValue("거의 없음"),
                  },
                  {
                    text: "(2)가벼운 활동 및 운동",
                    onPress: () => {
                      this.props.changeValue("조금 있음");
                    },
                  },
                  {
                    text: "(3)보통의 활동 및 운동",
                    onPress: () => {
                      this.props.changeValue("보통");
                    },
                  },
                  {
                    text: "(4)적극적인 활동 및 운동",
                    onPress: () => {
                      this.props.changeValue("많음");
                    },
                  },
                  {
                    text: "(5)아주 적극적인 활동 및 운동",
                    onPress: () => {
                      this.props.changeValue("아주 많음");
                    },
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ])
              }
            >
              <Image
                source={require("../assets/btn.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View>
            <TouchableOpacity onPress={this.showDialog}>
              <Image
                source={require("../assets/btn.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>{`${name}`}</Dialog.Title>
              <Dialog.Description>{`(1)활동이 적거나 운동을 안할 경우
(2)가벼운 활동 및 운동
(3)보통의 활동 및 운동
(4)적극적인 활동 및 운동
(5)아주 적극적인 활동 및 운동`}</Dialog.Description>

              <Dialog.Button
                label="( 1 )"
                onPress={() => {
                  this.props.changeValue("거의 없음");
                  this.handleCancel();
                }}
              />
              <Dialog.Button
                label="( 2 )"
                onPress={() => {
                  this.props.changeValue("조금 있음");
                  this.handleCancel();
                }}
              />
              <Dialog.Button
                label="( 3 )"
                onPress={() => {
                  this.props.changeValue("보통");
                  this.handleCancel();
                }}
              />
              <Dialog.Button
                label="( 4 )"
                onPress={() => {
                  this.props.changeValue("많음");
                  this.handleCancel();
                }}
              />
              <Dialog.Button
                label="( 5 )"
                onPress={() => {
                  this.props.changeValue("아주 많음");
                  this.handleCancel();
                }}
              />
            </Dialog.Container>
          </View>
        );
      }
    } else {
      return null;
    }
  }
}
