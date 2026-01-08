# Portfolio Website

A curated collection of hardware builds, mobile apps, games, and tools. Built with React, Vite, and TypeScript.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Docker

You can also run the website using Docker.

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```
   The website will be available at [http://localhost:8080](http://localhost:8080).

2. **Stop the container:**
   ```bash
   docker-compose down
   ```

## Project Structure

- `src/summaries/`: Contains project descriptions in Markdown format.
- `src/projectsData.ts`: Dynamically parses the Markdown files.
- `src/App.tsx`: Main UI and layout.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript
- **Content:** Markdown (rendered via `react-markdown`)
- **Deployment:** Nginx (via Docker)
