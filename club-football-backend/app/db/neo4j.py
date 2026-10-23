from typing import Any
from neo4j import Driver, GraphDatabase
from app.core.config import Settings
from app.core.errors import DatabaseUnavailable, QueryExecutionError


class Neo4jManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.driver: Driver | None = None

    def start(self) -> None:
        if self.settings.neo4j_password:
            self.driver = GraphDatabase.driver(self.settings.neo4j_uri, auth=(self.settings.neo4j_username, self.settings.neo4j_password))

    def close(self) -> None:
        if self.driver is not None:
            self.driver.close()
            self.driver = None

    def verify(self) -> bool:
        if self.driver is None:
            return False
        try:
            self.driver.verify_connectivity()
            return True
        except Exception:
            return False

    def read(self, cypher: str, parameters: dict[str, Any]) -> list[Any]:
        if self.driver is None:
            raise DatabaseUnavailable("Neo4j is not configured or unavailable")
        try:
            with self.driver.session(database=self.settings.neo4j_database) as session:
                return list(session.run(cypher, parameters))
        except Exception as exc:
            raise QueryExecutionError("Neo4j query execution failed") from exc
