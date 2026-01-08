# Domo

## Summary
A Material Design UI library for Android, bringing modern aesthetics to legacy devices.

## What this project is
Domo is an Android library and demonstration suite designed to showcase and implement custom Material Design UI components. Its primary goal is to provide high-quality, Material-inspired widgets—such as buttons, dialogs, and inputs—that bring a modern aesthetic to older Android devices (supporting back to Android 4.0).

The project is structured as a reusable library module, allowing developers to easily integrate these components into their own applications.

## How it works

### Library Architecture
The core logic resides in the `MaterialDesign` library module. It is built using a robust Gradle configuration that ensures broad compatibility:

- **Backward Compatibility:** Uses `minSdkVersion 14` and relies on libraries like `NineOldAndroids` to backport property animations and smooth transitions to legacy Android versions.
- **Modern Integration:** Compiled against modern SDKs to ensure it remains functional within current development environments.
- **Resource Management:** Includes a rich set of custom attributes, styles, and assets (`res` and `assets`) that define the visual language of the components, including ripple effects and elevation shadows.

### UI Components
The library implements a variety of custom views, each encapsulated with its own drawing logic and interaction handling. Key components include:
- **Responsive Buttons:** Flat and raised buttons with integrated ripple feedback.
- **Dialogs:** Custom-styled modal windows for alerts and user input.
- **Floating Action Buttons (FAB):** Modern action triggers with support for various positioning and animation styles.

### Integration Workflow
Integrating the library involves adding the module as a project dependency. Once included, developers can use the widgets directly in their XML layout files by referencing the library's package. This approach allows for a clean separation between the UI component definitions and the application's business logic.

## Technologies and tools
- **Android Library Module** (Gradle-based).
- **NineOldAndroids & AndroidX Legacy Support** for backported animations.
- **Custom View Drawing:** Implementation of Material Design visual patterns.
- **Gradle Publishing:** Configuration for library distribution and version management.
