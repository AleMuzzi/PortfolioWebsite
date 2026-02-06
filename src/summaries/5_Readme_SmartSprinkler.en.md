# 🚿 SmartSprinkler

## Summary

Smart irrigation system based on Bayesian Inference

## What this project is

SmartSprinkler is a smart irrigation system that utilizes Bayesian inference techniques to optimize water usage based on various environmental factors and plant needs. Designed to be efficient and adaptable, SmartSprinkler aims to reduce water waste while simultaneously improving plant health.

The system integrates sensors to monitor soil moisture, temperature, and weather conditions, using this data to make informed decisions about irrigation. Paired with this system is a mobile application that allows the user to monitor and control the irrigation system remotely.

### Project Status

Currently, the project is in the development and testing phase.

Primarily for hardware testing purposes, the remote control portion was the first to be developed and functions correctly, along with several sensors, including the air temperature and humidity sensor and the soil moisture sensor. The integration with the remaining sensors and the implementation of Bayesian inference are currently ongoing.

The ultimate goal is to create a fully automated system that can dynamically adapt to environmental conditions to optimize irrigation.

### Architecture

The system consists of two main components: the irrigation hardware and the clients that interact with it, whether they are a manually operated app or an automated control system based on Bayesian inference.

#### Irrigation Hardware

The irrigation hardware is managed by an ESP32-CAM, which acts as the central node for control and communication. The board was programmed using the Arduino framework, with code written in C.

Upon startup, the ESP32 connects to the local Wi-Fi network and launches an HTTP server that exposes a RESTful API for system interaction. Requests can be for:

* **status:** to obtain information from the sensors and the current irrigation status
* **command:** to send specific irrigation instructions, such as "Start", "Stop", and "Dispense", along with parameters like the plant to be irrigated and the volume of water to be delivered.

In its first version, the system is equipped with a water pump connected to an external tank, which is activated via a MOSFET controlled by the ESP32. A solenoid valve directs the water flow toward the selected plant. Currently, the system is equipped with only one solenoid valve, allowing it to choose between 2 plants (valve open or closed), but the idea is to expand the system by adding more solenoid valves in a binary system to manage multiple plants (<math display="inline"><mi>n</mi></math> valves for <math display="inline"><mn>2</mn><sup>n</sup></math> plants).

<div style="display: flex; flex-direction: column; align-items: center">

![smart_sprinkler_photo_closed.jpg{width="400px"}](src/assets/summaries/smart_sprinkler_photo_closed.jpg)
![smart_sprinkler_photo_open.jpg{width="354px"}](src/assets/summaries/smart_sprinkler_photo_open.jpg)

</div>

As shown in the photos above, the system is currently in a prototype phase, without a dedicated case or a structural board, but it is nonetheless functional. In the internal photo, the ESP32-CAM and the MOSFET controlling the water pump can be seen, while the external photo shows the DHT22 sensor for air temperature and humidity.

#### Mobile Application

The mobile app, developed using Flutter and Dart, provides an intuitive user interface for monitoring and controlling the irrigation system. The app follows a clean and reactive architecture that separates the user interface from the underlying business logic:

* **Reactive UI:** Built with Flutter's widget system, the UI uses `ListenableBuilder` patterns to ensure the dashboard automatically reflects the hardware's latest state without manual updates.
* **ViewModel Pattern:** Employs a dedicated ViewModel layer to orchestrate irrigation logic, keeping the code focused and maintainable.
* **Data Persistence:** Includes a configuration module to store and manage system settings, such as API endpoints and connection parameters.

#### Bayesian Inference Controller

⚠️ Under development ⚠️

#### Communication

The home network was configured to assign a dedicated IP address to the ESP32, which was mapped through a reverse proxy (Nginx) to allow external access via a domain pointing to my public IP.

## Technologies and tools

* **Frameworks:** Flutter, Arduino, Bayesian Inference
* **Languages:** Dart, C
* **Hardware:** ESP32, MOSFET, Solenoid Valve, Water Pump
* **Communication:** HTTP, RESTful API
* **Design Patterns:** MVVM
