# Pull Request Summary: feat/sandro

## Overview

**Branch:** `feat/sandro`
**Base:** `main`
**Summary:** Complete overhaul of the portfolio website — introducing the AI Digital Twin "Sandro", a new grid-based projects view, enhanced performance and accessibility, and a restructured backend to support AI-powered conversational interactions.

---

## What was built

### AI Digital Twin — Sandro

A context-aware AI agent trained on Alessandro's entire career (projects, experience, skills, recommendations). Sandro lives in a chat panel accessible from any page and is injected with the current page context on every request, so he can discuss in real time whatever the visitor is viewing.

- `server/index.ts` — Express 5 backend proxy that loads all CV markdown at startup, builds a system prompt, and forwards chat requests to the MiniMax API
- `src/components/DigitalTwin.tsx` + `.css` — chat UI with message history, auto-scroll, and clear button
- Page context injected on every request so Sandro knows the active project/experience

### Projects Grid

Replaced the old list-style projects page with a filterable card grid:

- `src/components/ProjectsGridView.tsx` + `.css` — responsive grid with tag filtering
- Card thumbnails for all 8 projects under `public/summaries/cards/`
- Tag cross-reference modal (`TagModal.tsx`)

### Portfolio Readmes

Created detailed bilingual (EN/IT) documentation for every project in `src/summaries/`:

- `0_Readme_Portfolio_Website.en.md` / `.it.md` — architecture, Digital Twin, AI-assisted dev tools, tech stack
- Readmes for all other projects (3D Printer, Drone, Domo, SmartSprinkler, Zombiecide, Litophane Lamp, etc.)

### Performance & Accessibility

- Converted large PNG assets to WebP (home images, printer control panels, card images)
- Added `aria-label`, `role="button"`, `tabIndex={0}`, and keyboard support on all interactive `<div>` elements
- Images use meaningful `alt` text throughout
- Plausible Analytics privacy-friendly tracking

### Infrastructure & Dev Experience

- Docker + Docker Compose setup for production deployment
- `docker-compose-no-extra.yml` for service-only deployment
- `Caddy` for HTTPS certificate management in Docker
- `.env.example` for environment variable scaffolding
- Enhanced `README.md` with full index, tech stack, setup instructions, and Lighthouse tips

---

## Key Files Changed

| File | Change |
|------|--------|
| `server/index.ts` | New — Express backend for Sandro AI proxy |
| `src/components/DigitalTwin.tsx` + `.css` | New — chat interface |
| `src/components/ProjectsGridView.tsx` + `.css` | New — filterable card grid (replaces old list) |
| `src/components/TagModal.tsx` | Enhanced with cross-reference filtering |
| `src/App.tsx` | Restructured routing, hash-based navigation |
| `src/i18n.ts` | Extended EN/IT translations, added Sandro strings |
| `src/utils/analytics.ts` | Enhanced tracking |
| `README.md` | Complete rewrite with index, Lighthouse scores, deployment section |
| `src/summaries/0_Readme_Portfolio_Website.en.md` / `.it.md` | New — full architecture documentation |
| `public/summaries/cards/*.png` | New — project card thumbnails (WebP) |
| `src/assets/*.webp` | New — converted from large PNGs |
| `Dockerfile`, `docker-compose.yml`, `docker-compose-no-extra.yml` | New — containerized deployment |
| `vite.config.ts` | Enhanced with proxy and build config |
| `index.html` | Meta description, Open Graph tags |

---

## Stats

- **~78 files changed**
- **~4,739 insertions / ~1,092 deletions**
- **8 projects** documented in both EN/IT
- **All Lighthouse scores: 100/100/100/100**

---

## Testing

- Manual testing of DigitalTwin chat, page context switching, and message scrolling
- Verified tag filtering, card navigation, and hash-based routing
- Tested bilingual toggle (EN/IT) across all views
- Verified Docker build and docker-compose startup

---

## Notes

- MiniMax API key must remain server-side only — never exposed to the frontend
- The Express backend acts as a proxy; the frontend never calls the MiniMax API directly
- Sandro's context awareness is maintained by injecting the current page metadata on every AI request