from typing import Any
from app.db.neo4j import Neo4jManager
from app.queries.registry import get_query
from app.services.serialization import record_to_dict


class QueryService:
    def __init__(self, db: Neo4jManager):
        self.db = db

    def execute(self, query_id: str, parameters: dict[str, Any]) -> list[dict[str, Any]]:
        spec = get_query(query_id)
        missing = [name for name in spec.parameters if name not in parameters]
        if missing:
            raise ValueError(f"Missing query parameters: {', '.join(missing)}")
        return [record_to_dict(record) for record in self.db.read(spec.cypher, parameters)]
