from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.deps import get_db
from app.api.router import router
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_db()
    yield
    get_db().close()
    get_db.cache_clear()


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=True, allow_methods=["GET"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/database")
def database_health():
    available = get_db().verify()
    return {"status": "ok" if available else "unavailable", "database": settings.neo4j_database}


app.include_router(router, prefix=settings.api_prefix)
