# Zombiecide

## Summary
Multiplayer survival game featuring a Unity 3D client and a dedicated C# server.

## What this project is
Zombiecide is a multiplayer game project that blends real-time action with cooperative strategic elements. The architecture is split into two distinct components:

1. **Unity Client:** A graphical front-end developed in Unity that handles 3D rendering, player input, and character animations.
2. **Dedicated C# Server:** A robust backend service that orchestrates game logic, maintains synchronized state, and manages communication between multiple connected players.

Inspired by cooperative survival games, Zombiecide challenges players to work together to navigate maps, combat evolving zombie threats, and achieve mission objectives.

## How it works

### Dedicated Server Architecture
The server is a high-performance C# application designed for low-latency state synchronization:

- **Connection Management:** Implements a custom TCP server capable of handling multiple concurrent socket connections. Each client is associated with a session-managed player entity.
- **Entity Modeling:** Features a comprehensive model layer representing players, pawns, and various zombie types. This ensures that the authoritative state of all game entities is maintained on the server.
- **Messaging Protocol:** Uses a custom serialization format to transmit movement commands, combat actions, and status updates between the clients and the server.
- **Turn & Logic Orchestration:** Manages the game's internal clock, including pawn movement validation, zombie AI spawning patterns, and victory/defeat conditions.

### Client-Server Interaction
The gameplay experience is driven by a continuous synchronization loop:

1. **Initialization:** The Unity client establishes a connection to the server's TCP listener.
2. **Command Issuance:** Player actions (such as moving a pawn or attacking) are sent as packets to the server.
3. **State Validation:** The server validates the action against the current game state and broadcasts the updated state to all connected clients.
4. **Visual Synchronization:** The Unity clients receive state updates and interpolate the movements and actions of all entities, ensuring a consistent visual experience for all players.

### Production & Development
The project leverages industry-standard tools to ensure a scalable and maintainable codebase:
- **.NET Ecosystem:** The server is built as a standard .NET solution, facilitating easy dependency management and cross-platform deployment.
- **Unity Engine:** The client takes advantage of Unity's powerful rendering and physics engines for a responsive gameplay feel.
- **Modular Utilities:** Includes reusable C# components for logging, unique ID generation, and network protocol handling.

## Technologies and tools
- **Game Engine:** Unity for 3D client-side gameplay and rendering.
- **Backend Language:** C# / .NET for the dedicated multiplayer server.
- **Networking:** Custom TCP socket implementation for real-time synchronization.
- **Data Modeling:** Object-oriented representation of complex game entities and board states.
- **Serialization:** Efficient data transfer protocols for client-server communication.
