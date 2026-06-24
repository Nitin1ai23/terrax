# TERRAX

**Raw data. Real insight. Every site, every decision.**

AI-powered GIS platform that turns raw geospatial data — drone uploads, LiDAR,
orthophotos, sample CSVs — into 2D/3D visualizations, geostatistical models,
volume calculations, and signed-off reports. Point-and-click, AI-guided, no
scripting.

---

## Stack

| Layer     | Tech                                                              |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React 18 + TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand |
| Backend   | FastAPI, SQLAlchemy (async), PostGIS, Celery + Redis              |
| Geostats  | NumPy/SciPy kriging engine (PyKrige/PySAL ready)                  |
| AI        | Groq (`llama-3.3-70b-versatile`) — guided setup, diagnostics, reports |
| Infra     | Docker + docker-compose                                           |

---

## Quick start (Docker)

```bash
cp .env.example .env          # add GROQ_API_KEY to enable AI features
docker compose up --build
```

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>
- API docs (Swagger): <http://localhost:8000/docs>

## Local dev (without Docker)

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev      # http://localhost:3000, proxies /api → :8000
```

---

## Environment variables

See [`.env.example`](.env.example). Key entries:

| Variable            | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `GROQ_API_KEY`      | Enables AI setup, diagnostics, report writing. Optional — the app runs without it (AI calls return a clear fallback message). |
| `GROQ_MODEL`        | Groq model id (default `llama-3.3-70b-versatile`).  |
| `DATABASE_URL`      | PostGIS connection string.                          |
| `REDIS_URL`         | Celery broker/result backend.                       |
| `JWT_SECRET`        | Token signing secret — **change for production**.   |

---

## Architecture

```
frontend/  React SPA. apiClient.ts centralizes all /api/v1 calls.
           Zustand store drives the always-available AI assistant panel.

backend/   FastAPI app, routers under app/api/v1/routes/*.
           services/geostatistics/kriging.py — real ordinary-kriging solver.
           services/volume/earthworks.py      — cut/fill volumes.
           services/ai_service.py             — Groq proxy (guarded fallback).
           tasks/celery_app.py                — async LiDAR/imagery/CSV jobs.
```

**Request flow:** client → `apiClient` → FastAPI router → service. Ordinary
kriging and volume calc run synchronously and return real numbers; the other
analysis methods accept a job and are wired to Celery for production scale.

### What's implemented vs. stubbed

- **Fully working:** Landing page, in-app shell + routing, AI assistant (with
  Groq or graceful fallback), ordinary kriging (real solver + LOO
  cross-validation), cut/fill volumes, file-type detection on upload, auth
  token issuance, all REST routes.
- **Scaffolded for extension:** Deck.gl/Mapbox map renderer (the Map view ships
  the full layer/inspector/toolbar UI with a placeholder canvas), the remaining
  geostat methods (queued jobs), Word/PDF export (endpoints return artifact
  URLs), and the property/deed data layer.

---

## Tests

```bash
cd backend && pytest          # backend unit tests (kriging, volume)
cd frontend && npm run lint   # tsc strict typecheck
```

---

## Design system

Dark, technical palette built around terrain green `#2AFFA0`. Space Grotesk
display, Inter body, JetBrains Mono for data. The signature element is the live
animated topographic contour field used across hero, previews, and loaders —
all SVG, no stock imagery.
