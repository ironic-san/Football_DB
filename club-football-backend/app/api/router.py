from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.deps import get_query_service
from app.core.errors import BackendError, DatabaseUnavailable
from app.services.query_service import QueryService

router = APIRouter()


def _run(query_id: str, params: dict, service: QueryService, *, entity: bool = False, exists_query: str | None = None, exists_params: dict | None = None):
    try:
        results = service.execute(query_id, params)
    except DatabaseUnavailable as exc:
        raise HTTPException(503, detail=str(exc)) from exc
    except BackendError as exc:
        raise HTTPException(502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc)) from exc
    if entity and not results:
        if exists_query is None:
            raise HTTPException(404, detail="Entity not found")
        try:
            exists = service.execute(exists_query, exists_params or params)
        except BackendError as exc:
            raise HTTPException(502, detail=str(exc)) from exc
        if not exists:
            raise HTTPException(404, detail="Entity not found")
    return {"queryId": query_id, "count": len(results), "results": results}


@router.get("/search/players")
def search_players(search: str = Query(min_length=1, max_length=100), service: QueryService = Depends(get_query_service)):
    return _run("Q2", {"search": search}, service)


@router.get("/search/clubs")
def search_clubs(search: str = Query(min_length=1, max_length=100), service: QueryService = Depends(get_query_service)):
    return _run("Q1", {"search": search}, service)


@router.get("/search/leagues")
def search_leagues(search: str = Query(min_length=1, max_length=100), service: QueryService = Depends(get_query_service)):
    return _run("Q3", {"search": search}, service)


@router.get("/search")
def search_all(search: str = Query(min_length=1, max_length=100), service: QueryService = Depends(get_query_service)):
    return {"search": search, "players": _run("Q2", {"search": search}, service)["results"], "clubs": _run("Q1", {"search": search}, service)["results"], "leagues": _run("Q3", {"search": search}, service)["results"]}


@router.get("/players/{player_id}")
def player(player_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q15", {"playerId": player_id}, service, entity=True)


@router.get("/players/{player_id}/career")
def player_career(player_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q16", {"playerId": player_id}, service, entity=True, exists_query="Q15")


@router.get("/players/{player_id}/seasons/{season_id}")
def player_season(player_id: str, season_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q17", {"playerId": player_id, "seasonId": season_id}, service, entity=True, exists_query="Q15", exists_params={"playerId": player_id})


@router.get("/players/{player_id}/records")
def player_records(player_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q18", {"playerId": player_id}, service, entity=True)


@router.get("/clubs/{club_id}")
def club(club_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q4", {"clubId": club_id}, service, entity=True)


@router.get("/clubs/{club_id}/domestic-history")
def club_domestic(club_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q5", {"clubId": club_id}, service, entity=True, exists_query="Q4")


@router.get("/clubs/{club_id}/ucl-history")
def club_ucl(club_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q6", {"clubId": club_id}, service, entity=True, exists_query="Q4")


@router.get("/clubs/{club_id}/seasons/{season_id}")
def club_season(club_id: str, season_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q7", {"clubId": club_id, "seasonId": season_id}, service, entity=True, exists_query="Q4", exists_params={"clubId": club_id})


@router.get("/leagues/{league_id}")
def league(league_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q8", {"leagueId": league_id}, service, entity=True)


@router.get("/leagues/{league_id}/history")
def league_history(league_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q9", {"leagueId": league_id}, service, entity=True, exists_query="Q8")


@router.get("/leagues/{league_id}/seasons/{season_id}")
def league_season(league_id: str, season_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q10", {"leagueId": league_id, "seasonId": season_id}, service, entity=True, exists_query="Q8", exists_params={"leagueId": league_id})


@router.get("/leagues/{league_id}/records")
def league_records(league_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q11", {"leagueId": league_id}, service, entity=True, exists_query="Q8")


@router.get("/champions-league/history")
def champions_history(service: QueryService = Depends(get_query_service)):
    return _run("Q12", {}, service)


@router.get("/champions-league/seasons/{season_id}")
def champions_season(season_id: str, service: QueryService = Depends(get_query_service)):
    return _run("Q13", {"seasonId": season_id}, service, entity=True)


@router.get("/champions-league/records")
def champions_records(service: QueryService = Depends(get_query_service)):
    return _run("Q14", {}, service)
