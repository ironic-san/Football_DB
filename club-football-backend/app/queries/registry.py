import re
from dataclasses import dataclass
from pathlib import Path

QUERY_FILE = Path(__file__).with_name("approved_queries.md")


@dataclass(frozen=True)
class QuerySpec:
    query_id: str
    title: str
    cypher: str
    parameters: tuple[str, ...]


def _load_queries() -> dict[str, QuerySpec]:
    text = QUERY_FILE.read_text(encoding="utf-8")
    headings = list(re.finditer(r"^## Q(\d+)\s*[—-]\s*(.+)$", text, re.MULTILINE))
    result: dict[str, QuerySpec] = {}
    for index, heading in enumerate(headings):
        query_id = f"Q{heading.group(1)}"
        end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
        section = text[heading.end():end]
        match = re.search(r"```cypher\s*(.*?)```", section, re.DOTALL | re.IGNORECASE)
        if not match:
            raise RuntimeError(f"No Cypher block found for {query_id}")
        cypher = match.group(1).strip()
        parameters = tuple(dict.fromkeys(re.findall(r"\$([A-Za-z_]\w*)", cypher)))
        result[query_id] = QuerySpec(query_id, heading.group(2).strip(), cypher, parameters)
    expected = {f"Q{i}" for i in range(1, 19)}
    if set(result) != expected:
        raise RuntimeError("The approved query file must contain exactly Q1-Q18")
    return result


QUERIES = _load_queries()


def get_query(query_id: str) -> QuerySpec:
    return QUERIES[query_id.upper()]
