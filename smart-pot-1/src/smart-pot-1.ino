/*
 * Project smart-pot-1
 * Description: Reading moisture data from moisture sensor
 * Author: Ryan Almizyed
 * Date: 04-20-2023
 */

// We define MY_LED to be the LED that we want to blink.
//
// In this tutorial, we're using the blue D7 LED (next to D7 on the Photon
// and Electron, and next to the USB connector on the Argon and Boron).
const pin_t BLUE_LED = D0;
const pin_t RED_LED = D3;
const pin_t YELLOW_LED = D0;
const int period = 100;
bool flash_on = true;

// The following line is optional, but recommended in most firmware. It
// allows your code to run before the cloud is connected. In this case,
// it will begin blinking almost immediately instead of waiting until
// breathing cyan,
SYSTEM_THREAD(ENABLED);


int toggle(String args)
{
  flash_on = !flash_on;
  Serial.println("Recieved a toggle from the API!");
  return 1;
}

// The setup() method is called once when the device boots.
void setup()
{
  // In order to set a pin, you must tell Device OS that the pin is
  // an OUTPUT pin. This is often done from setup() since you only need
  // to do it once.
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);

  Serial.begin(9600);
  waitFor(Serial.isConnected, 30000);

  Particle.function("toggle", toggle);
}

// The loop() method is called frequently.
void loop()
{
  if (flash_on)
  {
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(BLUE_LED, HIGH);
    // Serial.println("Switching to blue!");
    delay(period);

    digitalWrite(BLUE_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    // Serial.println("Switching to red!");
    delay(period);

    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    // Serial.println("Switching to yellow!");
    delay(period);

    IPAddress test_url = WiFi.resolve("www.google.com");
    int num_packets = WiFi.ping(test_url);
    Serial.printf("Received %d packets\n", num_packets);

    Serial.printf("`www.google.com` resolves to ");
    Serial.println(test_url);
  }




}