# Club Football Backend

FastAPI backend for the audited Club Football Neo4j graph. The approved Q1–Q18 Cypher definitions are copied unchanged into `app/queries/approved_queries.md`; the source query file outside this project remains untouched.

## Architecture

- `app/core`: environment configuration and safe application errors.
- `app/db`: managed official Neo4j Python driver.
- `app/queries`: query registry that loads only the approved Q1–Q18 definitions.
- `app/services`: query execution and Neo4j-to-JSON serialization.
- `app/api`: health, search, player, club, league, and Champions League routes.
- `tests`: mock-backed API and unit tests that do not require Neo4j.

## Windows PowerShell setup

From this directory:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
```

Set the real local password only in `.env`. Never commit or print that file.

## Run

```powershell
python -m uvicorn app.main:app --reload
```

Open Swagger UI at `http://localhost:8000/docs`. API routes use `/api/v1`.

## Test

```powershell
python -m pytest -q
```

The ordinary suite uses a fake service and does not claim live database coverage.

## Live checks

With Neo4j running locally and `.env` configured:

```powershell
Invoke-WebRequest http://localhost:8000/health/database
Invoke-WebRequest 'http://localhost:8000/api/v1/players/P004432'
```

The backend uses `bolt://localhost:7687`, the configured database, and read-only query execution. It does not expose arbitrary Cypher or modify graph data. A separate live integration suite should be run on the Windows machine where Neo4j is reachable.

## Endpoint mapping

Q1 clubs search; Q2 players search; Q3 leagues search; Q4–Q7 club endpoints; Q8–Q11 league endpoints; Q12–Q14 Champions League endpoints; Q15–Q18 player endpoints. Unified search calls Q1–Q3 and returns separate collections.

## Current limitation

Python was not installed in the build environment used to create this project, so local automated execution could not be performed here. Install Python 3.12 on the development PC and run the commands above; the code and tests are ready for that verification.
