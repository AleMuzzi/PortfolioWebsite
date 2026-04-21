# Alessandro Muzzi — Portfolio Website

A dark-themed, space-aesthetic personal portfolio showcasing Alessandro's career as a Staff Software Engineer & Lead Architect. Built with React and TypeScript, it features interactive home navigation, a filterable projects grid, a work experience timeline, and an AI-powered digital twin named **Sandro** — a context-aware conversational agent built on top of MiniMax that can discuss any project or topic on the site in depth.

---

## Index

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Building](#building)
- [Deploying](#deploying)
- [Environment Variables Reference](#environment-variables-reference)
- [The Digital Twin — Sandro](#the-digital-twin--sandro)
- [AI-Assisted Development](#ai-assisted-development)
- [Adding Projects](#adding-projects)
- [Adding Work Experiences](#adding-work-experiences)
- [Performance Notes](#performance-notes)
- [Lighthouse Tips](#lighthouse-tips)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Plain CSS (no framework) |
| Animations | Framer Motion |
| Build | Vite |
| AI Backend | Express.js proxy → MiniMax API |

---

## Project Structure

```
PortfolioWebsite/
├── index.html
├── vite.config.ts
├── package.json
├── server/
│   └── index.ts              # Express server (Sandro AI backend)
├── src/
│   ├── App.tsx               # Main app + routing
│   ├── App.css
│   ├── index.css             # CSS variables, resets
│   ├── main.tsx
│   ├── i18n.ts               # EN/IT translations
│   ├── projectsData.ts      # Project/experience parsers
│   ├── types/
│   │   └── svg.d.ts
│   ├── assets/               # Images, fonts, SVG icons
│   ├── components/
│   │   ├── HomeView.tsx / .css
│   │   ├── ProjectsGridView.tsx / .css
│   │   ├── DetailsView.tsx / .css
│   │   ├── ExperienceView.tsx / .css
│   │   ├── AboutView.tsx / .css
│   │   ├── FilterModal.tsx / .css
│   │   ├── TagModal.tsx / .css
│   │   ├── TerminalModal.tsx / .css
│   │   ├── DigitalTwin.tsx / .css
│   │   └── about_me/
│   │       └── About_me.en.md
│   ├── summaries/             # Project markdown files
│   ├── experiences/           # Experience markdown files
│   └── utils/
│       └── analytics.ts
└── public/
    ├── summaries/
    └── experiences/
```

---

## Prerequisites

1. **Node.js ≥ 18**
2. A [MiniMax](https://www.minimax.io/) account with an API key

---

## Development Setup

### 1. Install dependencies

```bash
cd PortfolioWebsite
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
# Required for Sandro (Digital Twin AI chat)
MINIMAX_API_KEY=your_minimax_api_key_here

# Server port (optional, defaults to 3001)
PORT=3001

# Set to "production" to serve the React build from here
NODE_ENV=development
```

### 3. Start the backend (Sandro API)

```bash
npx tsx server/index.ts
```

### 4. Start the React dev server

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api/*` requests to `http://localhost:3001`.

---

## Building

```bash
npm run build
```

This runs `tsc -b && vite build`. The frontend build is output to `dist/`.

---

## Deploying

The project has two parts that must be deployed together:
1. **Frontend** — static React app (any static host)
2. **Backend** — Express server that handles Sandro AI requests (Railway, Render, Fly.io, etc.)

> **Important:** The MiniMax API key must **never** be exposed in the frontend. All AI requests must go through the backend server.

For full deployment instructions, see the [Portfolio Website readme](./src/summaries/0_Readme_Portfolio_Website.en.md).

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MINIMAX_API_KEY` | **Yes** | — | API key from [minimax.io](https://www.minimax.io/). Keep this **server-side only**. |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Set to `production` to serve React build |
| `VITE_API_BASE_URL` | Yes (production) | — | Full URL of the deployed backend, e.g. `https://api.yoursite.com`. Used by the React app to route Sandro requests. |

---

## The Digital Twin — Sandro

The most distinctive feature of this portfolio is **Sandro**, an AI agent that has full knowledge of Alessandro's career, projects, skills, and personality. Visitors can chat with Sandro in natural language, asking about his background, experience, or any of the projects on display.

### How It Works

1. The frontend `DigitalTwin` component sends messages along with the current page context to `/api/digitalTwin`.
2. The Express backend loads all markdown files from `src/summaries/` and `src/experiences/` at startup and injects them into a detailed system prompt.
3. The backend also injects the **current page context** (project name, description, technologies, etc.) into the prompt on every request, so Sandro always knows what the user is looking at.
4. Sandro can provide insights, summarize the current page, or answer questions about anything on screen — creating a seamless experience where the AI companion explains or expands upon whatever the visitor encounters.

### Context Awareness

During navigation, Sandro remains **context aware**. He knows which page the user is currently viewing and can tailor his responses accordingly. Whether the visitor is reading a project detail page, browsing the experience timeline, or reviewing a specific technology, Sandro can discuss it in depth without requiring the user to re-explain the context.

---

## AI-Assisted Development

This project was built with heavy assistance from several AI tools, each evaluated for strengths and weaknesses throughout development:

- **Gemini** (Google): Used for initial scaffolding, brainstorming architecture decisions, and generating boilerplate code. Good for rapid prototyping but sometimes produced generic or inconsistent output.
- **Junie** (JetBrains): Evaluated as a coding assistant within the IDE. Useful for autocompletion and simple refactoring tasks.
- **GitHub Copilot**: Used for inline code suggestions, particularly in TypeScript/React components. Performed well for repetitive patterns but struggled with non-obvious logic.
- **Opencode**: Primary assistant for this project. Used for understanding the codebase, writing new components, debugging, and producing documentation. Its ability to read files, search codebases, and execute commands made it well-suited for a multi-file, complex project like this.
- **Openclaw**: Explored for specialized tasks. An interesting emerging tool in the AI-assisted development space. Due to being relatively new technology and demanding in terms of permissions, Openclaw was run in a dedicated virtual machine.

No single tool was a silver bullet — the best results came from combining multiple tools and applying human judgment to validate and refine the output.

---

## Adding Projects

1. Create a markdown file in `src/summaries/` following the existing format.
2. The file name determines the project ID (e.g. `2_Readme_DIY_Drone.en.md` → id `diy-drone`).
3. Add a card image to `public/summaries/cards/{id}.png` (recommended size: 400×250px).

## Adding Work Experiences

1. Create a markdown file in `src/experiences/`.
2. The file name becomes the experience ID.

---

## Performance Notes

- All images use `alt` text for accessibility.
- Interactive elements have `aria-label` and keyboard support (`Enter`/`Space` triggers).
- CSS font sizes use `clamp()` for fluid scaling across viewport sizes.
- Google Fonts are preconnected; only the required weights/styles are loaded.
- No external UI frameworks — only the CSS you need is shipped.

---

## Lighthouse Tips

To maintain the 100/100 scores:

- **Accessibility** — Every `<img>` has meaningful `alt` text. All clickable `<div>` elements have `role="button"`, `tabIndex={0}`, `onKeyDown`, and `aria-label`.
- **Speed** — Avoid adding large third-party scripts. The backend runs separately so the frontend stays lean.
- **SEO** — `index.html` includes a meta description, Open Graph tags, and a lang attribute.