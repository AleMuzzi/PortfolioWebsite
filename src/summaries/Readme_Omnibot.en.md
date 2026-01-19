# 🤖 Omnibot

## Summary
Android remote control and real-time telemetry dashboard for omnidirectional robots.

## What this project is
Omnibot is a specialized Android application designed to serve as the **primary remote control and telemetry dashboard** for an omnidirectional robotic platform. Optimized for tablet and mobile use, it provides an intuitive interface for real-time robot navigation, system monitoring, and hardware configuration over a wireless network.

## How it works

### Application Architecture
The app is built using modern Android development standards, featuring a full-screen, landscape-optimized interface designed for precision control:

- **Landscape-First UI:** The interface is locked to landscape orientation, providing maximum space for control surfaces and telemetry visualizations, similar to a professional gamepad or industrial dashboard.
- **Custom Application Lifecycle:** Implements a custom application class to manage global state, including networking clients and persistent configuration settings.
- **Enhanced Networking:** Configured with specific network security rules to allow reliable communication with local robotic controllers, even in restricted or self-hosted network environments.

### Operational Features
The application facilitates a seamless interaction between the user and the robotic hardware:

1. **Connection Management:** Automatically discovers or connects to the robot's control node using standard network protocols.
2. **Precision Control Surface:** Features virtual joysticks and interactive sliders for complex movement, including simultaneous translation (strafing) and rotation.
3. **Real-Time Telemetry:** Monitors and displays critical robot data, such as battery health, motor velocity, and connection quality.
4. **Command Pipeline:** User inputs are serialized into a high-performance messaging format (such as JSON or binary packets) and transmitted over Wi-Fi (TCP/UDP) to the robot's onboard computer, which then executes the movements.

## Technologies and tools
- **Android Development:** Native application written in **Kotlin** and built with **Gradle**.
- **User Interface:** Material Design components optimized for full-screen landscape interaction.
- **Wireless Networking:** Wi-Fi based communication protocols for low-latency command execution.
- **State Management:** Robust handling of connection states and real-time telemetry updates.
