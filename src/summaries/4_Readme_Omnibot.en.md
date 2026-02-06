# 🤖 Omnibot

## Summary

An omnidirectional robot with video streaming, controlled via an Android app

## What this project is

Much like the [DIY Drone](http://project:diy-drone) project mentioned earlier, this project was born as a learning exercise to explore mobile robotics, specifically focusing on omnidirectional robots and the mechanics of omni-wheels. 
As an exploratory project without a specific end-use, the budget was kept to a minimum by starting with a toy robot base:

![omnibot_photo.png{width="400px"}{align="center"}{caption="Omniwheels robot"}](src/assets/omnibot_photo.png)

### Phase One: Learning the Original Mechanics

The first phase of the project involved assembling the robot and understanding the provided source code. Originally, the robot was equipped with an ESP32-CAM microcontroller that handled command execution and video transmission via a web interface.

Commands were sent via serial communication to a custom version of an Arduino Uno, which in turn controlled the DC motors connected to the omni-wheels.

### Phase Two: Customization

After grasping the basic operation of the robot, I decided to keep the original hardware but rewrite the ESP32-CAM software to integrate it with my custom Android controller.

I adapted the Android controller previously developed for the [DIY Drone](http://project:diy-drone) to suit the omnidirectional robot, adding specific features to manage omni-wheel movement and robot telemetry.

### Operational Features

The application facilitates seamless interaction between the user and the robotic hardware:

1. **Connection Management:** Automatically discovers or connects to the robot's control node using standard network protocols.
2. **Precision Control Surface:** Features virtual joysticks and interactive sliders for complex movements, including simultaneous translation (strafing) and rotation.
3. **Command Pipeline:** User inputs are serialized into a compact format and transmitted via Wi-Fi (UDP) to the robot's onboard computer, which then executes the movements. The communication protocol between the ESP32-CAM and the Arduino Uno was also modified to meet these new requirements.

### Results

The robot is capable of moving in any direction with ease, demonstrating the effectiveness of omni-wheels for omnidirectional mobility. The Android app provides an intuitive and responsive user interface for controlling the robot, enabling precise and fluid movements.

Real-time video streaming allows the user to see the surrounding environment, further enhancing the remote-control experience.

## Technologies and tools

* **Frameworks:** Android, Arduino, ESP32, ESP32-CAM
* **Languages:** C, Kotlin
* **Communication:** UDP, Serial
