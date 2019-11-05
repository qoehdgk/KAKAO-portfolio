import { AsyncStorage} from "react-native";
import init from "react_native_mqtt";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});


const client = new Paho.MQTT.Client("192.168.1.21", 9001, "/mqtt", "uname");
    console.log(client);
    
      export default client;