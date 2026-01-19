# 💧 Cellar Pump Controller

## Summary
Arduino-based automated pump controller with dual-level sensors and state-machine logic.

## What this project is
This project is an automated **Arduino-based controller** designed to manage a water extraction pump in environments prone to moisture accumulation, such as cellars or basements. By utilizing dual-level sensors, the system intelligently monitors water levels and activates the pump only when necessary, ensuring efficient drainage and preventing overflow.

The system is designed for standalone operation, providing a reliable and low-maintenance solution for water management.

## How it works

### Hardware Architecture
The controller interfaces with several key components to monitor and react to environmental conditions:

- **Dual Float Sensors:** Strategically placed "Full" and "Empty" sensors provide precise feedback on water levels.
- **Control Interface:** An Arduino-compatible microcontroller processes sensor inputs and coordinates the output signals.
- **Power Management:** A dedicated power LED indicates the system's operational status.
- **Pump Activation:** A relay or MOSFET driver translates the microcontroller's low-voltage signal into the power required to drive the water pump.
- **Visual Feedback:** A status LED provides a clear indication when the pump is actively engaged.

### Control Logic and State Machine
The system operates on a robust state machine logic to ensure reliable pump cycling:

1. **Cycle Activation:** When the water level reaches the "Full" sensor, the controller triggers the pump and illuminates the status LED.
2. **Steady-State Drainage:** The pump remains active until the water level drops below the "Empty" threshold. This hysteresis prevents the pump from rapidly toggling on and off near a single sensor point.
3. **Automatic Shutdown:** Once the "Empty" state is confirmed, the controller deactivates the pump and resets the system for the next cycle.
4. **Signal Debouncing:** Software-level debouncing is implemented to ignore transient sensor readings caused by water turbulence, preventing erratic behavior.

The logic is optimized for standalone deployment, requiring no external computer connection once the firmware is uploaded.

## Technologies and tools
- **Microcontroller:** Arduino platform (Atmel AVR or similar).
- **Sensors:** Mechanical or optical liquid level sensors (Float switches).
- **Power Electronics:** Relay modules or high-current MOSFET drivers for pump control.
- **Firmware:** Custom C++ (Arduino sketch) implementing state-based control logic.
- **Visual Indicators:** LED-based status and power monitoring.
