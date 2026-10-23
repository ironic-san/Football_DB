from datetime import date, datetime, time
from decimal import Decimal
from typing import Any


def to_jsonable(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, dict):
        return {str(key): to_jsonable(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [to_jsonable(item) for item in value]
    if hasattr(value, "data") and callable(value.data):
        return to_jsonable(value.data())
    if hasattr(value, "items"):
        return {str(key): to_jsonable(item) for key, item in value.items()}
    if hasattr(value, "iso_format") and callable(value.iso_format):
        return value.iso_format()
    return str(value)


def record_to_dict(record: Any) -> dict[str, Any]:
    if isinstance(record, dict):
        return to_jsonable(record)
    if hasattr(record, "data") and callable(record.data):
        return to_jsonable(record.data())
    if hasattr(record, "keys"):
        return {key: to_jsonable(record[key]) for key in record.keys()}
    return {"value": to_jsonable(record)}
