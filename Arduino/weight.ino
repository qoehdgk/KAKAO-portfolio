#include <HX711.h>

/*
 Example using the SparkFun HX711 breakout board with a scale
 By: Nathan Seidle
 SparkFun Electronics
 Date: November 19th, 2014
 License: This code is public domain but you buy me a beer if you use this and we meet someday (Beerware license).
 
 This is the calibration sketch. Use it to determine the calibration_factor that the main example uses. It also
 outputs the zero_factor useful for projects that have a permanent mass on the scale in between power cycles.
 
 Setup your scale and start the sketch WITHOUT a weight on the scale
 Once readings are displayed place the weight on the scale
 Press +/- or a/z to adjust the calibration_factor until the output readings match the known weight
 Use this calibration_factor on the example sketch
 
 This example assumes pounds (lbs). If you prefer kilograms, change the Serial.print(" lbs"); line to kg. The
 calibration factor will be significantly different but it will be linearly related to lbs (1 lbs = 0.453592 kg).
 
 Your calibration factor may be very positive or very negative. It all depends on the setup of your scale system
 and the direction the sensors deflect from zero state
 This example code uses bogde's excellent library: https://github.com/bogde/HX711
 bogde's library is released under a GNU GENERAL PUBLIC LICENSE
 Arduino pin 2 -> HX711 CLK
 3 -> DOUT
 5V -> VCC
 GND -> GND
 
 Most any pin on the Arduino Uno will be compatible with DOUT/CLK.
 
 The HX711 board can be powered from 2.7V to 5V so the Arduino 5V power should be fine.
 
*/


#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define LOADCELL_DOUT_PIN  12
#define LOADCELL_SCK_PIN  14

HX711 scale;
WiFiClient espClient;
PubSubClient client(espClient);
char msg[50];
const char* ssid = "V50"; // 자신의 환경에 맞는 무선 인터넷의 SSID
const char* password="11111111"; // 와 패스 워드를 입력합니다.
const char* mqtt_server = "192.168.43.241";

float calibration_factor = -2490; //-7050 worked for my 440lb max scale setup
float weight = 0; 
void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  Serial.println(password);
  int n = WiFi.scanNetworks ();
if(n){
  for(int i = 0;i <n ; i++){
    Serial.println(WiFi.SSID(i));
    Serial.println(WiFi.RSSI(i));
  }
}
  
  
  WiFi.begin(ssid,password);
  Serial.println();
  Serial.print("Connecting"); //  WiFi 에 연결중  "Connecting "출력
  Serial.println(WiFi.status());

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

  
  Serial.println("HX711 calibration sketch");
  Serial.println("Remove all weight from scale");
  Serial.println("After readings begin, place known weight on scale");
  Serial.println("Press + or a to increase calibration factor");
  Serial.println("Press - or z to decrease calibration factor");

  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();
  scale.tare();  //Reset the scale to 0

  long zero_factor = scale.read_average(); //Get a baseline reading
  Serial.print("Zero factor: "); //This can be used to remove the need to tare the scale. Useful in permanent scale projects.
  Serial.println(zero_factor);
}

void loop() {
    if (!client.connected()) {
    reconnect();
  }
  client.loop();

  scale.set_scale(calibration_factor); //Adjust to this calibration factor

  Serial.print("Reading: ");
  
  Serial.print(scale.get_units()*-0.453592, 2);
  weight = scale.get_units()*-0.453592;
  Serial.print(" lbs"); //Change this to kg and re-adjust the calibration factor if you follow SI units like a sane person
  sprintf(msg,"%.2f",weight);
  client.publish("sensor/weight",msg);
  Serial.print(" calibration_factor: ");
  Serial.print(calibration_factor);
  Serial.println();

  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == '+' || temp == 'a')
      calibration_factor += 10;
    else if(temp == '-' || temp == 'z')
      calibration_factor -= 10;
  }
  delay(5000);
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
