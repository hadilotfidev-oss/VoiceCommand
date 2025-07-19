
// include dht library and instaniate a dht object
#include "DHT.h";
DHT dht(6, DHT11);

String reading = "";
void setup() {
  pinMode(8, OUTPUT);
  
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  // read temperature and save it in t
  float t = dht.readTemperature();
  // read from the esp8266
  if(Serial.available() != 0) {
    reading = Serial.readStringUntil('\n');
    // if esp sends high turn the relay on
    if(reading == "high") {
      digitalWrite(8, HIGH);
      delay(100);
    // if esp sends low turn the relay off
    }else if(reading == "low") {
      digitalWrite(8, LOW);
      delay(100);
    // if esp sends temp send the most recent temp reading
    }else if (reading == "temp") {
      // check if the temp failed and send error message to esp
      if (isnan(t)) {
      Serial.println("Failed to read temperature");
      }else {
      // send the temperature to esp
        Serial.println("");
        Serial.println("the temperature is: "+ String(t) + " C");
      }
    }
    else {
      // write whatever esp sends to the serial monitor
      Serial.println(reading);
    }
  }
}
