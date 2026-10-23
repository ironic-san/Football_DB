# Club Football Frontend

Stage 2 adds live search and discovery for players, clubs, and leagues while preserving the Stage 1 shell and placeholder pages.

## Stage 2 API contract

The frontend uses the existing FastAPI backend only:

- `GET /api/v1/search/players?search=...` → Q2; results use `playerId`, `player`, `nationality`, and `position`.
- `GET /api/v1/search/clubs?search=...` → Q1; results use `clubId` and `club`.
- `GET /api/v1/search/leagues?search=...` → Q3; results use `leagueId`, `league`, `country`, and `tier`.

Each endpoint returns `{ queryId, count, results }`.

## Setup

From this directory in Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
notepad .env.local
```

The existing backend README documents the local API at `http://localhost:8000`. Keep this frontend setting in `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The frontend does not make requests until a search is submitted.

### CORS requirement

The backend currently defaults `FRONTEND_ORIGINS` to `http://localhost:3000`, while Vite serves this frontend at `http://localhost:5173`. Do not change the database or query code. Set the backend environment value to:

```env
FRONTEND_ORIGINS=http://localhost:5173
```

Restart FastAPI after changing it. If your backend already has an explicit origin configured, keep that configuration only if it includes the actual Vite origin you use.

## Run and test

Start the backend from the backend directory using its documented command:

```powershell
cd "..\club-football-backend"
python -m uvicorn app.main:app --reload
```

In a second PowerShell window, start the frontend:

```powershell
cd "..\club-football-frontend"
npm run dev
```

Open `http://localhost:5173/` or the exact URL printed by Vite.

Run automated checks:

```powershell
npm test
npm run build
```

## Stage boundary

This stage does not implement real profile pages, statistics, histories, season data, UCL data, authentication, or new backend endpoints. Search result links intentionally open the existing Stage 1 placeholder pages.
