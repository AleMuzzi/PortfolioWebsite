# Portfolio Website

A curated collection of hardware builds, mobile apps, games, and tools. Built with React, Vite, and TypeScript.

## Getting Started

### Local Development

1. Copy the environment file and fill in your API key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `MINIMAX_API_KEY` (get one at https://console.minimax.io).

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This starts the React frontend on [http://localhost:5173](http://localhost:5173).

4. In a second terminal, start the Sandro backend (the Digital Twin API):
   ```bash
   npx tsx server/index.ts
   ```
   The API server runs on port 3001 and proxies through Vite via `/api`.

### Digital Twin — Sandro

Sandro is Alessandro's AI agent, trained on all CV/experience and project markdown files. He can answer questions about Alessandro's career, technical decisions, and project details.

- **Desktop:** A 🤖 button appears next to the language toggle in the header. Click it to open the chat.
- **Mobile:** On mobile devices, the site experience is replaced by a full-screen chat with Sandro.
- Quick-start chips give you common conversation starters.
- The agent connects to MiniMax's API (`MiniMax-M2.7` model) for responses.

### Docker

The Docker setup serves both the frontend and the Sandro backend in a single container.

1. Copy and configure your environment:
   ```bash
   cp .env.example .env
   # Edit .env and set MINIMAX_API_KEY
   ```

2. Build and run:
   ```bash
   docker compose up -d --build
   ```
   The site is available at [http://localhost:8080](http://localhost:8080).

3. Stop the container:
   ```bash
   docker compose down
   ```

#### Environment Variables (Docker)

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | Yes | API key for the Sandro Digital Twin agent |
| `PORT` | No | External port (default: `8080`) |

## Project Structure

- `src/summaries/` — Personal project descriptions in Markdown
- `src/experiences/` — Work experience descriptions in Markdown
- `src/components/` — UI components (views, modals, etc.)
- `src/digitalTwin/` — Digital Twin chat component and context
- `server/` — Express backend for the Sandro API
- `src/projectsData.ts` — Parses the Markdown files into structured data

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Framer Motion
- **Backend:** Express.js (for Sandro API)
- **AI:** MiniMax API (MiniMax-M2.7 model)
- **Content:** Markdown (rendered via `react-markdown`)
- **Deployment:** Node.js container (Docker)
