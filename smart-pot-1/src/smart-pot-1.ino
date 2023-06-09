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
const pin_t GREEN_LED = D4;
const pin_t RED_LED = D0;
const pin_t YELLOW_LED = D2;
const pin_t SENSOR_PIN = A5;
const int SAMPLING_PERIOD = 50;
const int WAITING_PERIOD = 333;
bool flash_on = true;
char* buffer = (char*)malloc(64 * sizeof(char));
const unsigned int LOOPS_UNTIL_SAMPLE = 300;
const unsigned int SAMPLES_PER_PACKET = 10;
unsigned int period = WAITING_PERIOD;
unsigned int waiting_count = 0;
unsigned int sample_count = 0;
unsigned int running_sum = 0;

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
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);

  Serial.begin(9600);
  waitFor(Serial.isConnected, 30000);

  Particle.function("toggle", toggle);
}

// The loop() method is called frequently.
void loop()
{
  if (flash_on)
  {
    // Determine mode
    bool waiting_mode = waiting_count < LOOPS_UNTIL_SAMPLE;
    period = (waiting_mode) ? WAITING_PERIOD : SAMPLING_PERIOD;


    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
    // Serial.println("Switching to blue!");
    delay(period);

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    // Serial.println("Switching to red!");
    delay(period);

    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    // Serial.println("Switching to yellow!");
    delay(period);

    int sensor_val = analogRead(SENSOR_PIN);
    Serial.printf("sensor_val = %d | running_sum = %d | sample # %d\n", sensor_val, running_sum, sample_count);



    // Loop slowly until it is time to sample
    if (waiting_mode) {
      waiting_count++;
    }
    // Loop quickly during sampling
    else if (sample_count < SAMPLES_PER_PACKET) {
      running_sum += sensor_val;
      sample_count++;
    } 
    // Reset, publish, and start looping slowly again
    else {
      sprintf(buffer, "%d", running_sum / SAMPLES_PER_PACKET);
      Particle.publish("raw-moisture-sensor", buffer);
      running_sum = 0;
      sample_count = 0;
      waiting_count = 0;
    }
    


  }




}