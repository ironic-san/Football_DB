from functools import lru_cache
from app.core.config import get_settings
from app.db.neo4j import Neo4jManager
from app.services.query_service import QueryService


@lru_cache
def get_db() -> Neo4jManager:
    db = Neo4jManager(get_settings())
    db.start()
    return db


def get_query_service() -> QueryService:
    return QueryService(get_db())
