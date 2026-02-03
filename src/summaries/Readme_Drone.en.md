# 🚁 Drone

## Summary
A custom drone platform featuring an Android telemetry app and optimized flight control.

## What this project is
The Drone project is a comprehensive development and documentation workspace for a custom hobby drone platform. It integrates multiple disciplines, including:

- **Mobile Control:** A custom-built Android application for drone operation and telemetry monitoring.
- **Flight Systems:** Configuration and calibration profiles for flight control hardware (such as the KK2 board).
- **Media & Analysis:** A curated archive of flight footage and photographic documentation used for performance tuning and airframe inspection.

This workspace serves as both the technical foundation for the drone's operation and a historical record of its development and flight history.

## How it works

### Android Control Application
The core of the user interface is a dedicated Android application. Designed for real-time interaction, the app facilitates:

![Drone Control App{width="300px"}{align="right"}](src/summaries/res/drone_architecture.png)

- **Command Transmission:** Sends precise control signals (throttle, yaw, pitch, roll) and flight mode switches to the drone's receiver via wireless protocols (Wi-Fi, Bluetooth, or custom radio links).
- **Telemetry Feedback:** Displays live data from the drone, including battery voltage, altitude, orientation (attitude), and GPS coordinates, using a dynamic HUD-style interface.
- **Data Logging:** Capable of recording flight telemetry for post-flight analysis and performance optimization.

The application follows standard Android architectural patterns, ensuring reliable performance and low-latency communication with the drone's hardware.

### Flight Configuration and Tuning
Successful flight requires precise hardware calibration. This project includes specialized resources for:

- **PID Tuning:** Documentation and settings for optimizing the Proportional-Integral-Derivative (PID) controllers to ensure stable flight characteristics.
- **Electronic Speed Controller (ESC) Calibration:** Parameters for motor synchronization and response timing.
- **Hardware Documentation:** Detailed diagrams and photographs of the airframe, wiring layouts, and component positioning to assist with repairs and future upgrades.

### Flight Media
The integrated media archive includes both onboard and ground-based footage. These videos are not just for display; they are critical for:
- Identifying vibration issues or mechanical instabilities.
- Reviewing flight maneuvers and battery performance under load.
- Documenting successful missions and testing new software or hardware iterations.

## Technologies and tools
- **Frameworks**: Android
- **Android Development:** Gradle-based application architecture for mobile control.
- **Flight Control Hardware:** Multi-rotor flight controllers (e.g., KK2), ESCs, and brushless motors.
- **Wireless Communication:** Implementation of protocols for real-time telemetry and command link.
- **Digital Imaging:** Tools for flight recording and photographic hardware documentation.
- **Telemetry Analysis:** Techniques for reviewing and interpreting sensor data from the flight system.
