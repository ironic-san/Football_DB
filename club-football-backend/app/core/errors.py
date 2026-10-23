class BackendError(Exception):
    """Base application error safe to expose through the API."""


class DatabaseUnavailable(BackendError):
    pass


class QueryExecutionError(BackendError):
    pass
