# 🌐 Portfolio Website

## Summary

A bilingual personal portfolio with an AI-powered digital twin built with React, TypeScript, Express, and framer-motion

## What this project is

This is my personal portfolio website ? a modern, interactive showcase of my work, experience, and personal projects. It features a timeline-based experience view, a project gallery with filtering and tagging, and a unique AI-powered "Digital Twin" that allows visitors to chat with a virtual version of me, trained on my entire career context.

### Architecture

The project follows a **client-server architecture** with a clear separation between frontend and backend.

**Frontend** is a React 19 + TypeScript SPA built with Vite. It renders multiple views:
- **HomeView**: Entry point with a high-level overview
- **ProjectsGridView**: Filterable grid of personal projects, backed by markdown files under `src/summaries/`
- **ExperienceView**: Vertical timeline of work experience and education
- **DetailsView**: Full detail view for a single project or experience, rendering markdown with `react-markdown`
- **AboutView**: Static "About Me" section
- **DigitalTwin**: AI chat interface powered by a backend LLM proxy

The frontend uses **framer-motion** for animations, **react-markdown** with `rehype-raw` and `remark-gfm` to render rich markdown (including custom extensions like `{width="400px"}` for images), and **Plausible Analytics** for privacy-friendly analytics.

**Backend** is a lightweight Express 5 server (`server/index.ts`) running on port 3001. Its primary role is to serve as a proxy for the MiniMax API ? it loads all CV context (experiences, projects, about me, recommendations) from markdown files at startup, injects it into a system prompt, and forwards chat messages from the Digital Twin to the MiniMax LLM API. It also handles SPA routing in production by serving the Vite build.

The `src/summaries/` directory contains all project write-ups in both English and Italian. The server reads and concatenates these files, strips custom markdown extensions, and uses them as context for the AI.

**Data model** is simple: each project and experience is defined in `projectsData.ts` and `experiencesData.ts` with an `id` that maps to a markdown file in `src/summaries/`. The detail view loads and renders the corresponding markdown file.

**Internationalization** is handled manually with a lightweight `i18n.ts` module supporting English and Italian throughout the UI.

**Tagging system**: every technology listed in a project or experience becomes a clickable tag. Clicking any tag opens a modal that cross-references all other projects and experiences sharing that same skill or technology, making it easy to navigate the portfolio by competency rather than by chronology.

Building the project requires both a frontend build (Vite/TypeScript) and a backend process:

```bash
# Install dependencies
npm install

# Run development (frontend on :5173, backend on :3001)
npm run dev:all

# Production build
npm run build
```

In production, the Express server runs the Vite build from its `dist/` folder and proxies API requests.

## The Digital Twin

The most distinctive feature is the **Digital Twin** ? an AI agent named "Sandro" that has full knowledge of my career, projects, skills, and personality. When the backend starts, it loads all markdown files from `src/summaries/` and `src/experiences/`, combines them into a comprehensive context prompt, and sends it to the MiniMax LLM API. The result is a conversational interface where visitors can ask Sandro about my background, experience, or projects in natural language.

## AI-Assisted Development

This project was built with heavy assistance from several AI tools, each evaluated for strengths and weaknesses throughout development:

- **Gemini** (Google): Used for initial scaffolding, brainstorming architecture decisions, and generating boilerplate code. Good for rapid prototyping but sometimes produced generic or inconsistent output.
- **Junie** (JetBrains): Evaluated as a coding assistant within the IDE. Useful for autocompletion and simple refactoring tasks.
- **GitHub Copilot**: Used for inline code suggestions, particularly in TypeScript/React components. Performed well for repetitive patterns but struggled with non-obvious logic.
- **Opencode**: Primary assistant for this project. Used for understanding the codebase, writing new components, debugging, and producing this very document. Its ability to read files, search codebases, and execute commands made it well-suited for a multi-file, complex project like this.
- **Openclaw**: Explored for specialized tasks. An interesting emerging tool in the AI-assisted development space.

No single tool was a silver bullet ? the best results came from combining multiple tools and applying human judgment to validate and refine the output.

## Technologies and tools

* **Languages:** TypeScript
* **Frameworks:** React, Express
* **Analytics:** Plausible Analytics
* **AI:** MiniMax API (proxy), Digital Twin architecture
* **Infrastructure:** Docker, Docker Compose