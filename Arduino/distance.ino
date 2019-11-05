

#include <Wire.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define GY_US42_I2C_ADDRESS 112
byte tMSB, tLSB;
int distance;

const char* ssid = "610_LAN"; // 자신의 환경에 맞는 무선 인터넷의 SSID
const char* password= "610610LAN"; // 와 패스 워드를 입력합니다.
const char* mqtt_server = "192.168.1.21";

unsigned long starttime;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int dis;
int value = 0;

void setup()
{
  Wire.begin();
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.println();
  Serial.print("Connecting"); //  WiFi 에 연결중  "Connecting "출력

  while(WiFi.status() != WL_CONNECTED)
   {
    delay(500);
    Serial.print("."); //연결될때 까지 출력
   }

   Serial.println("success!");  //연결이 완료되면..
   Serial.print("IP Address is: ");
   Serial.println(WiFi.localIP());   // 연결된 아이피가 출력됩니다.
   client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  
  
  starttime = millis();
  
}

int getDistance()
{
  //temp registers (11h-12h) get updated automatically every 64s
  Wire.beginTransmission(112);
  Wire.write(byte(81));
  Wire.endTransmission();
  delay(70);
  Wire.requestFrom(112, 2);
 
  if(2 <= Wire.available()) {
    Serial.print("djkd");
    int reading = Wire.read();
    reading = reading << 8;
    reading |= Wire.read();

    Serial.print("Us42 ");
    Serial.print(reading);
    Serial.print("cm");
    return reading;
    
   

  }
  else {
    //error! no data!
  }
  return distance;
}
void loop()
{
    if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
 long now = millis();
  if (now - lastMsg > 2000) {
    dis = getDistance();
    lastMsg = now;
    ++value;
    sprintf(msg,"%d",dis);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("sensor/distance", msg);
  }
}
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  /*
  if ((char)payload[0] == '1') {
    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is acive low on the ESP-01)
  } else {
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }
  */

}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("aaa", "hello world");
      // ... and resubscribe
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
