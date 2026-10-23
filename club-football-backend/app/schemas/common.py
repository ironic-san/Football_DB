from pydantic import BaseModel, Field


class QueryResponse(BaseModel):
    queryId: str
    count: int
    results: list[dict] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    database: str | None = None
