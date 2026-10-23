import os
import pytest
from fastapi.testclient import TestClient


pytestmark = pytest.mark.skipif(os.getenv("RUN_LIVE_TESTS") != "1", reason="Set RUN_LIVE_TESTS=1 to run against local Neo4j")


def test_live_ronaldo_profile_and_database_health():
    from app.main import app
    with TestClient(app) as client:
        assert client.get("/health/database").json()["status"] == "ok"
        response = client.get("/api/v1/players/P004432")
        assert response.status_code == 200
        assert response.json()["queryId"] == "Q15"
