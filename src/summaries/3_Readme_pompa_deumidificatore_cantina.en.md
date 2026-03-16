# 💧 Automatic Drainage System

## Summary

Arduino-based automated system for dehumidifier water drainage

## What this project is

This project was born from the need to automatically empty the water collected by the dehumidifier in my cellar, without having to intervene manually every time the tank fills up. The result is an **automated Arduino-based controller** equipped with dual-level sensors that allow it to autonomously manage water levels and activate the pump only when necessary, ensuring efficient drainage and preventing overflows.

The system is designed for autonomous operation, providing a reliable, zero-maintenance solution for water management.

### Hardware Architecture

This project has undergone significant evolution over time.

#### First Iteration
![pompa_cantina_1_circuito.jpg{width="400px"}{align="right"}{caption="Simulazione circuito su EveryCircuit"}](/summaries/pompa_cantina_1_circuito.jpg)
The initial idea, inspired by the mechanics of toilet tanks, involved using a single float sensor to detect the water level.

Once the "Full" level was reached, the circuit was closed, resulting in the following:

* An electromagnetic latch engaged to hold the float in place, keeping the circuit active.
* An NE555 timer, configured with a preset duration, started.
* The pump was activated to empty the tank.

When the timer expired, the latch deactivated, allowing the float to drop with the now-emptied water level, opening the circuit and turning off the pump. The circuit was designed on EveryCircuit and subsequently built on a perfboard. Although this solution worked, likely due to circuit errors or humidity, the NE555 timer was unreliable and frequently failed, requiring constant repairs and manual emptying—the very thing I wanted to avoid.

#### Current Iteration

Later, I decided to completely abandon the analog circuit in favor of a much simpler and more reliable digital solution based on an **Arduino Nano** microcontroller.

The controller interfaces with two float sensors: one positioned at the "Full" level and the other at the "Empty" level. These sensors provide precise feedback on water levels, allowing the microcontroller to make informed decisions regarding pump activation. 
The Arduino code, less than 40 lines long, implements state machine logic that manages pumping cycles reliably and informs the user of the system status via dedicated LEDs. 
A relay was used to translate the microcontroller's low-voltage signal into the power required to drive the water pump.

<div style="display: flex; flex-direction: column; align-items: center; gap: 20px">

![pompa_cantina_foto_off.jpg{width="399px"}](/summaries/pompa_cantina_foto_off.jpg)
![pompa_cantina_foto_on.jpg{width="600px"}](/summaries/pompa_cantina_foto_on.jpg)
</br>
<label class="image-caption" style="display: flex; flex-direction: column; align-items: center;">Off State (left) and Active State (right) with status LED lit</label>

</div>

In the photos above, you can see:

* The power LED (left) indicating the system is powered.
* The status LED (lit on the right) indicating the pump is active and draining water from the tank.
* The two float sensors (top right) monitoring "Full" and "Empty" levels.
* The water inlet pipe from the dehumidifier (green, top right).
* The drainage pipe for water pumped out of the tank (white, top left).
* The emergency overflow pipe (white, left) which prevents flooding in case of system failure by diverting water to an external bucket.
* The manual override switch (black, top right above the tank) allowing for manual pump activation if needed.

### Control Logic and State Machine

The system operates on simple and robust state machine logic to ensure reliable pumping cycles:

1. **Cycle Activation:** When the water reaches the "Full" sensor, the controller activates the pump and turns on the status LED.
2. **Steady-State Drainage:** The pump remains active until the water level drops below the "Empty" threshold. This hysteresis prevents the pump from rapidly cycling on and off near a single sensor point.
3. **Automatic Shutdown:** Once the "Empty" state is confirmed, the controller deactivates the pump and resets the system for the next cycle. The "Empty" level was strategically placed to ensure the tank is sufficiently drained but not completely, preventing the risk of damaging the pump by running it dry.

The logic is optimized for standalone implementation, requiring no connection to an external computer once the firmware is uploaded.

## Technologies and tools
* **Languages:** C, Kotlin
* **Framework:** Arduino, Android
* **Hardware:** Arduino Nano
* **Circuit Design Software:** EveryCircuit
* **Prototyping Tools:** Perfboard, 3D print FDM