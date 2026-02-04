# 🚿 SmartSprinkler

## Summary
Cross-platform Flutter application for remote irrigation control and zone management.

## What this project is
SmartSprinkler is a cross-platform mobile application developed with **Flutter** that serves as an intuitive control interface for a network-connected irrigation system. It provides homeowners and enthusiasts with the ability to:

- **Monitor System Health:** Real-time visibility into the status of the irrigation controller.
- **Zone Management:** Precise control over individual irrigation zones or specific plants.
- **On-Demand Dispensing:** Functionality to dispense a measured volume of water (in milliliters) for targeted irrigation.
- **Remote Configuration:** Flexible settings to adapt the app to different network environments and backend endpoints.

## How it works

### Application Architecture
The app follows a clean, reactive architecture that separates the user interface from the underlying business logic:

- **Reactive UI:** Built with Flutter's widget system, the UI uses `ListenableBuilder` patterns to ensure that the dashboard automatically reflects the latest state of the hardware without manual refreshes.
- **ViewModel Pattern:** Employs a dedicated ViewModel layer to orchestrate the irrigation logic, keeping the presentation code focused and maintainable.
- **Data Persistence:** Includes a configuration module for storing and managing system-wide settings, such as API endpoints and connection parameters.

### Operational Workflow
The interaction between the app and the irrigation hardware is designed for reliability and ease of use:

1. **User Interaction:** Through the "Irrigation Control" dashboard, users select a target zone and an action (Start, Stop, or Dispense).
2. **Command Processing:** The app serializes these actions into structured commands (JSON) containing the target zone, the desired action, and any quantitative parameters (like water volume).
3. **Network Communication:** Commands are transmitted via HTTP POST requests to the irrigation controller's API. The app is designed to handle various network conditions, providing clear feedback through a toast-based notification system.
4. **Hardware Feedback:** The system parses server responses to confirm successful execution or provide detailed error reporting in case of connectivity issues or hardware faults.

### Backend Integration
The application is designed to be backend-agnostic, communicating over a standard HTTP interface. This allows it to interface with a variety of hardware controllers, from custom ESP32/Arduino-based solutions to small servers, provided they implement the documented command API.

## Technologies and tools
- **Frontend**: Flutter, Dart
- **Networking**: package:http
- **State Management**: Listenable-based reactive patterns
- **User Feedback**: Fluttertoast
- **Pattern**: ViewModel-based separation of concerns
