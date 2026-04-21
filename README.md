# Alessandro Muzzi — Portfolio Website

A dark-themed, space-aesthetic personal portfolio showcasing Alessandro's career as a Staff Software Engineer & Lead Architect. Features interactive home navigation, a projects grid, work experience timeline, and an AI-powered digital twin named **Sandro** built atop MiniMax.

---

## Lighthouse Scores

| Metric | Score |
|--------|-------|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

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
1. **Frontend** — static React app (Vercel or Netlify)
2. **Backend** — Express server that handles Sandro AI requests (Railway, Render, Fly.io, or the same Vercel/Netlify function)

> **Important:** The MiniMax API key must **never** be exposed in the frontend. All AI requests must go through the backend server.

### Option A — Vercel

#### Backend (Express → Railway or Render)

1. Push the project to GitHub.
2. Create a new **Railway** (or Render) project, connect your GitHub repo.
3. Set the following environment variables in your backend host:

   ```
   MINIMAX_API_KEY=your_key_here
   NODE_ENV=production
   PORT=3001
   ```

4. Set the start command to: `npx tsx server/index.ts`
5. Note the deployed URL (e.g. `https://your-backend.railway.app`).

#### Frontend (Vercel)

1. Log in to [Vercel](https://vercel.com) and import your GitHub repo.
2. In **Project Settings → Environment Variables**, add:

   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

3. Set the **Root Directory** to `PortfolioWebsite`.
4. Set the **Build Command** to: `npm run build`
5. Set the **Output Directory** to: `dist`
6. Deploy.

The frontend will now send `/api/digitalTwin` requests to your backend URL.

#### Updating the Vercel proxy URL

If your backend URL changes, update `VITE_API_BASE_URL` in Vercel project settings and redeploy.

---

### Option B — Netlify

Netlify Functions can handle the Sandro backend.

#### 1. Move the server to `netlify/functions/`

Create `netlify/functions/sandro.ts` and copy the relevant route code from `server/index.ts` into it.

#### 2. Install `serverless-http`

```bash
npm install serverless-http dotenv
```

#### 3. Create `netlify/functions/sandro.ts`

```ts
import 'dotenv/config';
import { handler } from '../../server/index'; // wrap the Express app
import { Handler } from '@netlify/functions';

export const main: Handler = handler as any;
```

#### 4. Set environment variables

In **Netlify → Site Settings → Environment Variables**, add:

```
MINIMAX_API_KEY=your_key_here
```

#### 5. Set build environment variable for the frontend

```
VITE_API_BASE_URL=https://your-site.netlify.app/.netlify/functions
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MINIMAX_API_KEY` | **Yes** | — | API key from [minimax.io](https://www.minimax.io/). Keep this **server-side only**. |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Set to `production` to serve React build |
| `VITE_API_BASE_URL` | Yes (production) | — | Full URL of the deployed backend, e.g. `https://api.yoursite.com`. Used by the React app to route Sandro requests. |

---

## How Sandro Works

1. The frontend `DigitalTwin` component sends messages + the current page context to `/api/digitalTwin`.
2. The Express backend prepends a detailed system prompt containing Alessandro's full CV (projects, experience, recommendations).
3. The backend also injects the **current page context** (project name, description, technologies, etc.) into the system prompt, so Sandro can answer questions about whatever the user is currently viewing.
4. The backend calls the MiniMax Messages API and returns the response to the frontend.

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