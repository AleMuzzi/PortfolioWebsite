# 🚿 SmartSprinkler

## Summary
Autonomous irrigation system with Bayesian decision-making, ESP32 relay control, and a mobile app for manual override

## What this project is
SmartSprinkler is a smart irrigation system that utilizes a Bayesian network to optimize water usage based on environmental factors and plant-specific needs. Designed to be efficient and adaptable, SmartSprinkler aims to reduce water waste while simultaneously improving plant health.

The system integrates sensors to monitor soil moisture, temperature, and weather conditions, using this data to make informed irrigation decisions. A Python/FastAPI server handles Bayesian inference and automates the irrigation process. The mobile app and a web dashboard allow the user to monitor and control the system remotely.

### Project Status
The project is in advanced development stage. The main components are operational:

- **ESP32 Hardware**: Functional with air temperature/humidity (DHT22) and soil moisture (HW-390) sensors
- **BayesianSprinkler Server**: Implemented and operational with 8-node Bayesian network, Open-Meteo API integration, automatic scheduler, and weight refinement
- **Flutter Mobile App**: Operational with toggle for direct ESP or Bayesian server routing
- **React Web Frontend**: Complete dashboard with Dashboard, Control, and Settings tabs

### Architecture
The system consists of three main components: ESP32 + Arduino Nano (sensor slave) hardware, BayesianSprinkler server (Python/FastAPI), and clients (Flutter mobile app + React web frontend).

#### ESP32 + Arduino Nano Hardware
The hardware is managed by an ESP32-CAM as the main controller with an Arduino Nano as a sensor slave. The system exposes an HTTP API (port 80):
- `GET /status` — returns `air_temperature`, `air_humidity`, `soil_moisture`, `water_pump`, `rotary_position`, `water_low_alert`
- `POST /command` — accepts `{"action": "START|STOP|DISPENSE_SPECIFIC_AMOUNT", "target": "PLANT_NAME", "amount": <ml>}`

The ESP32 controls a water pump connected to an external tank (GPIO 12). Plant selection is done via a **3D-printed rotary selector** driven by an **SG90 servo motor** (GPIO 13), which directs water flow to the selected plant. The Nano reads 4 HW-390 soil moisture sensors, a DHT22, and a water level float switch, communicating with the ESP32 via serial.

The system supports 4 plants: Habanero, Naga Morich, Carolina Reaper, and Rosmarino, each with different thresholds and water needs. Servo positions are: Habanero (0°), Naga Morich (15°), Carolina Reaper (30°), Rosmarino (45°).

#### BayesianSprinkler Server
FastAPI server (port 8080) that manages the autonomous decision loop:

- **8-node Bayesian Network**: AirTemperature, AirHumidity, CloudCover → EvaporationRisk → NeedWater + SoilMoisture, PlantType, RainForecast
- **APScheduler**: hourly sensor polling + inference cycle every 30 minutes
- **Open-Meteo API**: integration for cloud cover and rain forecast
- **SQLite**: database for sensor history with Bayesian weight refinement
- **Main endpoints**: `POST /api/plants/manual-water`, `GET /api/plants/status`, `GET /api/weather/status`

#### Flutter Mobile App
The mobile app provides an interface to monitor and control the system:
- Reactive dashboard with real-time sensor status (2s polling)
- Toggle to choose between direct ESP or Bayesian server routing
- Plant selection and irrigation control (Start/Stop/Dispense)
- Settings page to configure ESP32 and Bayesian Server URLs

#### React Web Frontend
Web dashboard with three tabs:
- **Dashboard**: sensor telemetry, weather context, per-plant Bayesian probabilities
- **Control**: plant selector, Direct ESP/Via Bayesian toggle, Start/Stop buttons, volume presets
- **Settings**: URL configuration and polling interval

#### Communication
The home network is configured to assign a dedicated IP to the ESP32, accessible via Nginx reverse proxy. The BayesianSprinkler server can be containerized with Docker and docker-compose.

## GitHub
https://github.com/AleMuzzi/SmartSprinkler

## Technologies and tools
- **Languages:** Dart, C/C++, Python, JavaScript
- **Frameworks:** Flutter, PlatformIO, FastAPI, React
- **Hardware:** ESP32-CAM, Arduino Nano, DHT22, HW-390, SG90 servo, Relay pump
- **Communication:** HTTP, RESTful API
- **Database:** SQLite
- **Design Patterns:** MVVM, Bayesian Network
- **Tools:** Docker, Nginx, APScheduler, Open-Meteo API
