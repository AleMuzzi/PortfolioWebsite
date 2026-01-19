# 🖨️ Gargantua - Large scale 3D Printer

## Summary
Custom 32-bit Marlin firmware and optimized slicing profiles for a large-format 3D printer.

## What this project is
This project documents a heavily customized 3D‑printer setup based on the MKS Monster8 32‑bit control board and Marlin 2.x firmware. It encompasses three main aspects:

- **Firmware and Electronics:** Custom Marlin 2.x configuration for the Monster8 board.
- **Slicer Configuration:** Optimized profiles for consistent and repeatable high-quality prints.
- **Documentation and Media:** A collection of time‑lapse videos and hardware documentation documenting the printer's evolution and tuning.

It serves as the central hub for the printer's technical specifications, firmware history, and print results.

## How it works

### Firmware and Controller
The system runs on Marlin 2.x firmware, an open‑source motion‑control system adapted for the MKS Monster8 (STM32F4-based MCU). The configuration is specifically tuned for this hardware to handle:

- **Precision Motion:** Stepper motor control for all axes and extruders.
- **Thermal Management:** Advanced PID tuning for the hotend and heated bed.
- **Input/Output:** Management of endstops, fans, and display interfaces.
- **Execution:** Efficient G‑code parsing from various sources (SD, USB, or host).

The control logic maps the Monster8’s physical pins to the printer’s specific components, ensuring reliable communication between the MCU and the hardware.

### Slicer Configuration and Print Pipeline
The workflow from digital model to physical object follows a structured pipeline:

1. **Model Preparation:** 3D models are processed in PrusaSlicer using custom-tuned material and printer profiles.
2. **Slicing:** The slicer generates layer‑by‑layer toolpaths and G‑code optimized for the machine's specific mechanics.
3. **Execution:** The Marlin firmware executes the G‑code in real-time, coordinating the mechanical movements and thermal controls.
4. **Monitoring:** A dedicated camera captures the printing process, providing visual feedback and creating time-lapse recordings for quality review and documentation.

### Machine-Specific Optimization
The configuration is optimized for a large‑format "Gargantua"‑style printer. Every aspect—from physical dimensions and acceleration limits to stepper currents and bed leveling—is precisely defined in the firmware and slicer presets to match the machine's mechanical capabilities.

## Technologies and tools
- **Marlin 2.x** firmware (customized for STM32F407).
- **MKS Monster8** 32-bit controller board.
- **PrusaSlicer** with custom-tuned printer and material profiles.
- **Precision Hardware:** Stepper motors, high-power heaters, and bed leveling sensors.
- **Media Tools:** Digital imaging for print monitoring and time-lapse creation.
