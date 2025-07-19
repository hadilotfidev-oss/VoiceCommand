#include <ESP8266WiFi.h>

// save router ssid and password
const char* ssid = "Galaxy";
const char* password = "bahaabahaa4";
// const char* ssid = "Tenda";
// const char* password = "P@ss_.1991";
// specify the server port at 8888
WiFiServer server(8888);

void setup() 
{
  Serial.begin(9600);

  Serial.print("\n\n");
  Serial.print("Connecting to ");
  Serial.println(ssid);
  //connect to the router
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(100);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to WiFi");
  // print local IP address
  Serial.print("IP: ");  Serial.println(WiFi.localIP());
  // start the server
  server.begin();
}

void loop() 
{
  // check that the server is still up
  WiFiClient client = server.available();
  // exit the loop if server shuts down
  if (!client) {
  return;
  }
  // wait for a client to send a request
  while(!client.available()){
  }
  // parse request
  String request = client.readStringUntil('\r');
  client.flush();

  //response to be sent if the client connected to /
  String response = "connection established";

  // check if client connected to /ON
  if (request.indexOf("/ON") != -1) 
  {
    // send high to the arduino to turn the relay on
    Serial.write("high\n");
    // change the response
    response = "The light turned on";
  } 
  // check if client connected to /OFF
  if (request.indexOf("/OFF") != -1)
  {
    // send low to the arduino to turn the relay off
    Serial.write("low\n");
    // change the response
    response = "the light turned off";
  }
  // check if client connected to /TEMP
  if (request.indexOf("/TEMP") != -1) {
    // send to temp to arduino to send most recent reading
    Serial.write("temp\n");
    // wait for arduino to send the temp reading
    while(Serial.available() <= 0) {
      delay(10);
    }
    // read the temp from the arduino
    String temperature = Serial.readString();
    // set the response to temperature
    response = temperature;
  }
    // response status
  client.println("HTTP/1.1 200 OK");
  // cors bypass
  client.println("Access-Control-Allow-Origin: *");
  // ngrok warning page bypass
  client.println("Access-Control-Allow-Headers: ngrok-skip-browser-warning");
  // print empty string to signal end of response header
  client.println("");
  // send response variable in response body
  client.println(response);
  Serial.println("");
}