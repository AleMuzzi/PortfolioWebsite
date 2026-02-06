# 🧟 Zombiecide

## Summary

Zombicide, but remote!

## What this project is

The need for this project arose during the pandemic, when social interactions were limited and it was impossible to play board games with friends and family.
At the time, I was taking a university exam focused on virtual reality and 3D app development, which required a project built with Unity. Since no digital version of Zombicide existed—only companion apps—I decided to combine business with pleasure.

I created a cooperative multiplayer game inspired by Zombicide, a popular zombie survival board game (specifically the [Rue Morgue](https://www.zombicide.com/rue-morgue/) version).

![zombicide_banner.webp{align="center"}](src/assets/zombicide_banner.png)

### The game

In Zombiecide, players take on the role of survivors in a post-apocalyptic world infested with zombies. They must work together to complete missions, gather resources, and fight off hordes of zombies.
Players control their pieces on a game grid, moving strategically to avoid zombies and reach mission objectives. Each player has unique abilities and can collect weapons and items to improve their chances of survival.
To win, players must complete the mission objectives before the zombies overwhelm them.

More info at [www.zombicide.com](https://www.zombicide.com/)

### Architecture

Multiplayer Zombiecide aims to recreate the board game's user experience remotely. Therefore, there are no complex automated game mechanics; the focus is instead on synchronizing the game state between multiple players connected in real-time.

The architecture is divided into two distinct components:

1. **Unity Client:** A graphical front-end developed in Unity that handles 3D rendering, player input, and character animations.
2. **Dedicated C# Server:** A robust backend service that orchestrates the game logic, maintains synchronized state, and manages communication between multiple connected players.

### Server Architecture

The server is a high-performance C# application designed for low-latency state synchronization:
- **Connection Management:** 
  - TCP Server to handle multiple simultaneous socket connections. Each client is associated with a player entity managed via sessions.
  - UDP Server for broadcasting high-frequency state updates, such as movements, rotations, and real-time actions.
- **Entity Modeling:** Features a full model layer representing players, game pieces, and various zombie types. This ensures the authoritative state of all game entities is maintained on the server.
- **Game Utilities:** Provides utility functions for managing game rules, such as zombie spawning, adding new players, and card shuffling.
- **Messaging Protocol:** The protocol is JSON-based, allowing for the transmission of movement commands, combat actions, dice rolls, etc.

### Client-Server Interaction

The gameplay experience is driven by a continuous synchronization loop:
1. **Initialization:** The Unity client establishes a connection to the server's TCP listener.
2. **Command Emission:** Player actions (like moving a piece or attacking) are sent as packets to the server.
3. **State Validation:** The server validates the action against the current game state and broadcasts the updated state to all connected clients.
4. **Visual Synchronization:** Unity clients receive state updates and interpolate the movements and actions of all entities, ensuring a consistent visual experience for all players.

### Gameplay

#### Server

Upon starting the server, the user is prompted for the NxM dimensions of the game grid. Then, the user must enter the tiles composing the grid and their orientation, separated by commas, starting from the top-left corner and proceeding row by row.
Below is an example with the corresponding resulting configuration:

<div style="display: flex; flex-direction: column; align-items: center">

![zombicide_server_esempio1.png{width="700px"}{align="center"}](src/assets/zombicide_server_esempio1.png)
![zombicide_client_esempio1.png{width="700px"}{align="center"}{caption="(up) Server configuration, (down) Results client side"}](src/assets/zombicide_client_esempio1.png)

</div>

At this point, both servers are running and reachable at the specified addresses and ports. To allow external access, I placed the server PC's IP address in the local network's DMZ and mapped my public IP via a DDNS service.

#### Client

On startup, the client verifies that communication with the server is working correctly; otherwise, it notifies the user and the application closes. If everything is functional, the user is asked to choose a character and enter an alias; the game then loads the configuration received from the server, and play can begin.

### Production and Development

The project utilizes industry-standard tools to ensure a scalable and maintainable codebase:

- **.NET Ecosystem:** The server is built as a standard .NET solution, facilitating dependency management and cross-platform deployment on Windows, Linux, and macOS.
- **Unity Engine:** The client leverages Unity's powerful rendering and physics engines for a responsive gameplay feel.

### Results

The application supports simultaneous play for up to 10 players; however, it is scalable, and the 10-player limit was set only to remain faithful to the original game.
In addition to testing during development, the application successfully handled two live gaming sessions: **2 hours with 6 players** and **3 hours with 8 players**.

Furthermore, the project was well-received by the university professor, who accepted and graded it as an exam project.

## Technologies and tools

* **Frameworks:** .NET, Unity
* **Languages:** C#
* **Supported OS:** Windows, Linux, macOS
* **Communication:** HTTP, RESTful API, UDP
