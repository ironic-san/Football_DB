from datetime import date
from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_query_service
from app.services.serialization import to_jsonable
from app.queries.registry import QUERIES


class FakeService:
    def execute(self, query_id, parameters):
        if query_id == "Q2":
            return [{"playerId": "P004432", "player": "Cristiano Ronaldo"}]
        if query_id == "Q15":
            return [{"playerId": parameters["playerId"], "player": "Test Player"}]
        return [{"query": query_id, "parameters": parameters}]


app.dependency_overrides[get_query_service] = lambda: FakeService()


def test_health_endpoints():
    client = TestClient(app)
    assert client.get("/health").json() == {"status": "ok"}


def test_registry_contains_approved_queries():
    assert set(QUERIES) == {f"Q{i}" for i in range(1, 19)}
    assert "search" in QUERIES["Q1"].parameters
    assert "playerId" in QUERIES["Q15"].parameters


def test_search_and_player_endpoints():
    client = TestClient(app)
    assert client.get("/api/v1/search/players?search=ronaldo").status_code == 200
    assert client.get("/api/v1/players/P004432").json()["queryId"] == "Q15"


def test_invalid_search_is_rejected():
    assert TestClient(app).get("/api/v1/search/players?search=").status_code == 422


def test_serialization_preserves_null_and_date():
    assert to_jsonable({"value": None, "day": date(2025, 1, 2)}) == {"value": None, "day": "2025-01-02"}
