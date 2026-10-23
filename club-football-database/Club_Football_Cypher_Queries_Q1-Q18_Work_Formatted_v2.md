# Club Football Database — Cypher Queries Q1–Q18

This document contains all 18 supplied Cypher query sections, mapped to the project headings for easier review in ChatGPT Work.

## Instructions for Work
- Treat each numbered section as one query section and review it separately.
- Preserve the supplied query code unless explicitly asked to correct it.
- When auditing, compare the query with the actual Neo4j schema and database dump.
- Query code is enclosed in `cypher` fences for readability. Parameter names and comments inside the code are preserved.
- Q5 and Q6 are both included because both appeared in the supplied source file; check whether they are intentional duplicates.

---

## Q1 — Club Search

```cypher
MATCH (c:Club)
WHERE toLower(c.Club_Name) CONTAINS toLower($search)
RETURN c.Club_ID AS clubId, c.Club_Name AS club
ORDER BY club LIMIT 20;
```

---

## Q2 — Player Search

```cypher
MATCH (p:Player)
WHERE toLower(p.Player_Name) CONTAINS toLower($search)
RETURN p.Player_ID AS playerId,
       p.Player_Name AS player,
       p.Nationality AS nationality,
       p.Position AS position
ORDER BY player
LIMIT 20;
```

---

## Q3 — League Search

```cypher
MATCH (l:League)
WHERE toLower(l.League_Name) CONTAINS toLower($search)
RETURN l.League_ID AS leagueId,
       l.League_Name AS league,
       l.Country AS country,
       l.Tier AS tier
ORDER BY league;
```

---

## Q4 — Club Overview

```cypher
MATCH (c:Club {Club_ID: $clubId})

CALL (c) {
    OPTIONAL MATCH (c)-[:PARTICIPATED_IN]->(ls:LeagueSeason)
                  -[:FOR_LEAGUE]->(l:League)
    RETURN collect(DISTINCT l.League_Name) AS leagues
}

CALL (c) {
    OPTIONAL MATCH (c)-[:PARTICIPATED_IN]->(ls:LeagueSeason)
                  -[:FOR_SEASON]->(s:Season)
    OPTIONAL MATCH (ls)-[st:HAS_STANDING]->(c)
    OPTIONAL MATCH (ls)-[:FOR_LEAGUE]->(l:League)
    WITH s, st, l
    ORDER BY s.Season_Year DESC
    RETURN head(collect({
        season: s.Season_Year,
        league: l.League_Name,
        position: st.Rank_Position,
        points: st.Points,
        played: st.Matches_Played
    })) AS latestStanding
}

CALL (c) {
    OPTIONAL MATCH (c)-[wt:WON_TROPHY]->(t:Trophy)
    OPTIONAL MATCH (s:Season {Season_ID: wt.Season_ID})
    WITH t, wt, s
    ORDER BY s.Season_Year DESC, wt.Award_Date DESC
    RETURN head(collect({
        trophy: t.Trophy_Name,
        season: s.Season_Year,
        date: wt.Award_Date
    })) AS latestTrophy
}

CALL (c) {
    OPTIONAL MATCH (c)-[r:UCL_SEASON_RESULT]->(s:Season)
    WITH s, r
    ORDER BY s.Season_Year DESC
    RETURN head(collect({
        season: s.Season_Year,
        finalStage: r.Final_Stage,
        status: r.Status
    })) AS latestUCL
}

RETURN
    c.Club_ID AS clubId,
    c.Club_Name AS clubName,

    CASE
        WHEN size(leagues) = 0 THEN ["NA"]
        ELSE leagues
    END AS leagues,

    CASE
        WHEN latestStanding.season IS NULL THEN "NA"
        ELSE latestStanding
    END AS latestLeagueStanding,

    CASE
        WHEN latestTrophy.trophy IS NULL THEN "NA"
        ELSE latestTrophy
    END AS latestTrophy,

    CASE
        WHEN latestUCL.season IS NULL THEN "NA"
        ELSE latestUCL
    END AS latestUCLParticipation;
```

---

## Q5 — Club League History

```cypher
MATCH (c:Club {Club_ID: $clubId})-[:PARTICIPATED_IN]->(ls:LeagueSeason)
MATCH (ls)-[:FOR_LEAGUE]->(l:League)
MATCH (ls)-[:FOR_SEASON]->(s:Season)
OPTIONAL MATCH (ls)-[st:HAS_STANDING]->(c)

CALL (c, ls) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(c)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL
    RETURN p.Player_Name AS topScorer,
           r.Goals AS topScorerGoals
    ORDER BY r.Goals DESC, p.Player_Name
    LIMIT 1
}

CALL (c, ls) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(c)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Assists IS NOT NULL
    RETURN p.Player_Name AS topAssister,
           r.Assists AS topAssists
    ORDER BY r.Assists DESC, p.Player_Name
    LIMIT 1
}

RETURN
    l.League_Name AS league,
    s.Season_Year AS season,
    st.Rank_Position AS position,
    st.Matches_Played AS played,
    st.Wins AS wins,
    st.Draws AS draws,
    st.Losses AS losses,
    st.Goals_For AS goalsFor,
    st.Goals_Against AS goalsAgainst,
    st.Goal_Difference AS goalDifference,
    st.Points AS points,
    topScorer,
    topScorerGoals,
    topAssister,
    topAssists
ORDER BY s.Season_Year, l.League_Name;
```

---

## Q6 — Club UEFA Champions League History

```cypher
MATCH (c:Club {Club_ID: $clubId})-[part:UCL_PARTICIPATED_IN]->(s:Season)


CALL (c, s) {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s)
    WHERE r.Club_ID = c.Club_ID
      AND r.Goals IS NOT NULL
    RETURN p.Player_Name AS topScorer,
           r.Goals AS topScorerGoals
    ORDER BY r.Goals DESC, p.Player_Name
    LIMIT 1
}

CALL (c, s) {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s)
    WHERE r.Club_ID = c.Club_ID
      AND r.Assists IS NOT NULL
    RETURN p.Player_Name AS topAssister,
           r.Assists AS topAssists
    ORDER BY r.Assists DESC, p.Player_Name
    LIMIT 1
}


OPTIONAL MATCH (c)-[result:UCL_SEASON_RESULT]->(s)

WITH s,
     collect(DISTINCT part.Stage) AS stages,
     collect(DISTINCT part.Stage_Category) AS stageCategories,
     collect(DISTINCT part.Source_Type) AS sourceTypes,
     collect(DISTINCT result.Status) AS statuses,
     collect(DISTINCT result.Final_Stage) AS finalStages,
     head(collect(topScorer)) AS topScorer,
     head(collect(topScorerGoals)) AS topScorerGoals,
     head(collect(topAssister)) AS topAssister,
     head(collect(topAssists)) AS topAssists

RETURN
    s.Season_Year AS season,
    stages,
    stageCategories,
    sourceTypes,
    finalStages,
    statuses,
    topScorer,
    topScorerGoals,
    topAssister,
    topAssists
ORDER BY season;
```

---

## Q7 — Club Season Overview

```cypher
MATCH (c:Club {Club_ID: $clubId})

CALL (c) {
    OPTIONAL MATCH (c)-[:PARTICIPATED_IN]->
        (ls:LeagueSeason {Season_ID: $seasonId})
    OPTIONAL MATCH (ls)-[:FOR_LEAGUE]->(l:League)
    OPTIONAL MATCH (ls)-[st:HAS_STANDING]->(c)
    WITH ls, l, st
    RETURN collect({
        league: l.League_Name,
        seasonId: ls.Season_ID,
        position: st.Rank_Position,
        matchesPlayed: st.Matches_Played,
        wins: st.Wins,
        draws: st.Draws,
        losses: st.Losses,
        goalsFor: st.Goals_For,
        goalsAgainst: st.Goals_Against,
        goalDifference: st.Goal_Difference,
        points: st.Points
    }) AS domesticRows
}

CALL (c) {
    OPTIONAL MATCH (c)-[r:UCL_PARTICIPATED_IN]->
        (s:Season {Season_ID: $seasonId})
    OPTIONAL MATCH (c)-[res:UCL_SEASON_RESULT]->(s)
    OPTIONAL MATCH (c)-[st:UCL_STANDING]->(s)
    WITH s,
         collect(DISTINCT r.Stage) AS stages,
         collect(DISTINCT r.Stage_Category) AS categories,
         collect(DISTINCT res.Final_Stage) AS finalStages,
         collect(DISTINCT res.Status) AS statuses,
         collect(DISTINCT st) AS standings
    RETURN CASE
        WHEN s IS NULL THEN null
        ELSE {
            seasonId: s.Season_ID,
            stages: [x IN stages WHERE x IS NOT NULL],
            stageCategories: [x IN categories WHERE x IS NOT NULL],
            finalStage: head([x IN finalStages WHERE x IS NOT NULL]),
            status: head([x IN statuses WHERE x IS NOT NULL]),
            standings: [x IN standings WHERE x IS NOT NULL | {
                position: x.Rank_Position,
                matchesPlayed: x.Matches_Played,
                wins: x.Wins,
                draws: x.Draws,
                losses: x.Losses,
                goalsFor: x.Goals_For,
                goalsAgainst: x.Goals_Against,
                goalDifference: x.Goal_Difference,
                points: x.Points
            }]
        }
    END AS ucl
}

CALL (c) {
    OPTIONAL MATCH (m:Match)
    WHERE m.Season_ID = $seasonId
      AND (m.Home_Club_ID = c.Club_ID
           OR m.Away_Club_ID = c.Club_ID)
    WITH m
    ORDER BY CASE
        WHEN m IS NULL THEN "9999-99-99"
        ELSE "20" + substring(m.Match_Date, 6, 2) + "-"
             + substring(m.Match_Date, 3, 2) + "-"
             + substring(m.Match_Date, 0, 2)
    END
    RETURN collect(
        CASE WHEN m IS NULL THEN null ELSE {
            date: m.Match_Date,
            opponent: CASE
                WHEN m.Home_Club_ID = c.Club_ID
                THEN m.Away_Club_Name
                ELSE m.Home_Club_Name
            END,
            venue: CASE
                WHEN m.Home_Club_ID = c.Club_ID
                THEN "Home"
                ELSE "Away"
            END,
            score: toString(m.Home_Score) + "-"
                   + toString(m.Away_Score),
            result: CASE
                WHEN m.Home_Score = m.Away_Score THEN "Draw"
                WHEN (m.Home_Club_ID = c.Club_ID
                      AND m.Home_Score > m.Away_Score)
                  OR (m.Away_Club_ID = c.Club_ID
                      AND m.Away_Score > m.Home_Score)
                THEN "Win"
                ELSE "Loss"
            END
        } END
    ) AS rawMatches
}

CALL (c) {
    OPTIONAL MATCH (m:UCLMatch)
    WHERE m.Season_ID = $seasonId
      AND (m.Home_Club_ID = c.Club_ID
           OR m.Away_Club_ID = c.Club_ID)
    WITH m ORDER BY m.Match_Date
    RETURN collect(
        CASE WHEN m IS NULL THEN null ELSE {
            date: m.Match_Date,
            opponent: CASE
                WHEN m.Home_Club_ID = c.Club_ID
                THEN m.Away_Club_Name
                ELSE m.Home_Club_Name
            END,
            venue: CASE
                WHEN m.Home_Club_ID = c.Club_ID
                THEN "Home"
                ELSE "Away"
            END,
            score: toString(m.Home_Score) + "-"
                   + toString(m.Away_Score),
            stage: m.Stage,
            result: CASE
                WHEN m.Home_Score = m.Away_Score THEN "Draw"
                WHEN (m.Home_Club_ID = c.Club_ID
                      AND m.Home_Score > m.Away_Score)
                  OR (m.Away_Club_ID = c.Club_ID
                      AND m.Away_Score > m.Home_Score)
                THEN "Win"
                ELSE "Loss"
            END
        } END
    ) AS rawUclMatches
}

CALL (c) {
    OPTIONAL MATCH (c)-[:PARTICIPATED_IN]->
        (ls:LeagueSeason {Season_ID: $seasonId})
    OPTIONAL MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(c)
    WHERE ls IS NOT NULL
      AND r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL
    WITH p, r
    ORDER BY r.Goals DESC, p.Player_Name
    RETURN head(collect(
        CASE WHEN p IS NULL THEN null ELSE {
            player: p.Player_Name,
            goals: r.Goals
        } END
    )) AS domesticTopScorer
}

CALL (c) {
    OPTIONAL MATCH (c)-[:PARTICIPATED_IN]->
        (ls:LeagueSeason {Season_ID: $seasonId})
    OPTIONAL MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(c)
    WHERE ls IS NOT NULL
      AND r.League_Season_ID = ls.League_Season_ID
      AND r.Assists IS NOT NULL
    WITH p, r
    ORDER BY r.Assists DESC, p.Player_Name
    RETURN head(collect(
        CASE WHEN p IS NULL THEN null ELSE {
            player: p.Player_Name,
            assists: r.Assists
        } END
    )) AS domesticTopAssister
}

CALL (c) {
    OPTIONAL MATCH (p:Player)-[r:UCL_STATS_FOR]->
        (:Season {Season_ID: $seasonId})
    WHERE r.Club_ID = c.Club_ID
      AND r.Goals IS NOT NULL
    WITH p, r
    ORDER BY r.Goals DESC, p.Player_Name
    RETURN head(collect(
        CASE WHEN p IS NULL THEN null ELSE {
            player: p.Player_Name,
            goals: r.Goals
        } END
    )) AS uclTopScorer
}

CALL (c) {
    OPTIONAL MATCH (p:Player)-[r:UCL_STATS_FOR]->
        (:Season {Season_ID: $seasonId})
    WHERE r.Club_ID = c.Club_ID
      AND r.Assists IS NOT NULL
    WITH p, r
    ORDER BY r.Assists DESC, p.Player_Name
    RETURN head(collect(
        CASE WHEN p IS NULL THEN null ELSE {
            player: p.Player_Name,
            assists: r.Assists
        } END
    )) AS uclTopAssister
}

CALL (c) {
    OPTIONAL MATCH (c)-[r:WON_TROPHY]->(t:Trophy)
    WHERE r.Season_ID = $seasonId
    RETURN collect(
        CASE WHEN t IS NULL THEN null ELSE {
            trophy: t.Trophy_Name,
            competition: t.Competition,
            type: t.Trophy_Type,
            awardDate: r.Award_Date
        } END
    ) AS rawTrophies
}

WITH c, $seasonId AS season,
     head([x IN domesticRows
           WHERE x.league IS NOT NULL]) AS domestic,
     ucl,
     [x IN rawMatches WHERE x IS NOT NULL] AS domesticMatches,
     [x IN rawUclMatches WHERE x IS NOT NULL] AS uclMatches,
     domesticTopScorer,
     domesticTopAssister,
     uclTopScorer,
     uclTopAssister,
     [x IN rawTrophies WHERE x IS NOT NULL] AS trophies

RETURN
    c.Club_Name AS club,
    season AS season,

    CASE
        WHEN domestic IS NULL THEN "NA"
        ELSE domestic
    END AS domesticPerformance,

    coalesce(ucl, "NA") AS uclPerformance,

    coalesce(domesticTopScorer, "NA")
        AS domesticTopScorer,

    coalesce(domesticTopAssister, "NA")
        AS domesticTopAssister,

    coalesce(uclTopScorer, "NA")
        AS uclTopScorer,

    coalesce(uclTopAssister, "NA")
        AS uclTopAssister,

    CASE
        WHEN size(domesticMatches) = 0 THEN "NA"
        ELSE domesticMatches
    END AS domesticMatches,

    CASE
        WHEN size(uclMatches) = 0 THEN "NA"
        ELSE uclMatches
    END AS uclMatches,

    CASE
        WHEN size(trophies) = 0 THEN "NA"
        ELSE trophies
    END AS titlesWon;
```

---

## Q8 — League Overview

```cypher
MATCH (l:League {League_ID: $leagueId})
OPTIONAL MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
OPTIONAL MATCH (ls)-[:FOR_SEASON]->(s:Season)

WITH l,
     collect(DISTINCT {
         seasonId: s.Season_ID,
         seasonYear: s.Season_Year
     }) AS seasonData,
     count(DISTINCT ls) AS leagueSeasons

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    MATCH (m:Match)-[:IN_LEAGUE_SEASON]->(ls)
    RETURN count(DISTINCT m) AS totalMatches
}

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    MATCH (ls)-[:HAS_STANDING]->(c:Club)
    RETURN count(DISTINCT c) AS totalClubs
}

UNWIND seasonData AS x

WITH l, leagueSeasons, totalMatches, totalClubs, x
WHERE x.seasonId IS NOT NULL

WITH l, leagueSeasons, totalMatches, totalClubs, x
ORDER BY toInteger(x.seasonId)

WITH l, leagueSeasons, totalMatches, totalClubs,
     collect(x) AS availableSeasons

RETURN
    l.League_Name AS league,
    l.Country AS country,
    l.Tier AS tier,
    leagueSeasons AS seasonsRecorded,
    totalMatches,
    totalClubs,
    availableSeasons;
```

---

## Q9 — League History

```cypher
MATCH (l:League {League_ID: $leagueId})
MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
MATCH (ls)-[:FOR_SEASON]->(s:Season)

CALL (ls, l) {
    OPTIONAL MATCH (m:Match)-[:IN_LEAGUE_SEASON]->(ls)
    RETURN count(DISTINCT m) AS matchCount
}

CALL (ls) {
    OPTIONAL MATCH (ls)-[st:HAS_STANDING]->(c:Club)
    WITH c, st
    ORDER BY st.Rank_Position ASC
    RETURN
        head(collect(
            CASE WHEN st.Rank_Position = 1 THEN {
                club: c.Club_Name,
                position: st.Rank_Position,
                points: st.Points,
                wins: st.Wins,
                draws: st.Draws,
                losses: st.Losses,
                goalsFor: st.Goals_For,
                goalsAgainst: st.Goals_Against,
                goalDifference: st.Goal_Difference
            } END
        )) AS champion,
        head(collect(
            CASE WHEN st.Rank_Position = 2 THEN {
                club: c.Club_Name,
                position: st.Rank_Position,
                points: st.Points,
                wins: st.Wins,
                draws: st.Draws,
                losses: st.Losses,
                goalsFor: st.Goals_For,
                goalsAgainst: st.Goals_Against,
                goalDifference: st.Goal_Difference
            } END
        )) AS runnerUp,
        count(DISTINCT c) AS clubsWithStandings
}

CALL (ls) {
    OPTIONAL MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL

    WITH p, r
    ORDER BY r.Goals DESC

    WITH max(r.Goals) AS highestGoals,
         collect({
             player: p.Player_Name,
             goals: r.Goals
         }) AS playerStats

    RETURN
        highestGoals AS goldenBootGoals,
        [x IN playerStats
         WHERE x.goals = highestGoals] AS goldenBootWinners
}

RETURN
    l.League_Name AS league,
    s.Season_Year AS season,
    ls.League_Season_ID AS leagueSeasonId,
    matchCount,
    champion,
    runnerUp,
    clubsWithStandings,
    goldenBootWinners,
    goldenBootGoals
ORDER BY toInteger(s.Season_ID);
```

---

## Q10 — League Season History

```cypher
MATCH (l:League {League_ID: $leagueId})
MATCH (ls:LeagueSeason {League_Season_ID: $leagueId + "_" + $seasonId})
      -[:FOR_LEAGUE]->(l)
MATCH (ls)-[:FOR_SEASON]->(s:Season)

CALL (ls) {
    OPTIONAL MATCH (ls)-[st:HAS_STANDING]->(c:Club)
    WITH c, st
    ORDER BY st.Rank_Position ASC
    RETURN
        head(collect(
            CASE WHEN st.Rank_Position = 1 THEN {
                club: c.Club_Name,
                position: st.Rank_Position,
                points: st.Points,
                wins: st.Wins,
                draws: st.Draws,
                losses: st.Losses,
                goalsFor: st.Goals_For,
                goalsAgainst: st.Goals_Against,
                goalDifference: st.Goal_Difference
            } END
        )) AS champion,
        head(collect(
            CASE WHEN st.Rank_Position = 2 THEN {
                club: c.Club_Name,
                position: st.Rank_Position,
                points: st.Points,
                wins: st.Wins,
                draws: st.Draws,
                losses: st.Losses,
                goalsFor: st.Goals_For,
                goalsAgainst: st.Goals_Against,
                goalDifference: st.Goal_Difference
            } END
        )) AS runnerUp,
        count(DISTINCT c) AS clubsWithStandings
}

CALL (ls) {
    MATCH (m:Match)-[:IN_LEAGUE_SEASON]->(ls)
    RETURN collect({
        matchId: m.Match_ID,
        date: m.Match_Date,
        home: m.Home_Club_Name,
        away: m.Away_Club_Name,
        homeScore: m.Home_Score,
        awayScore: m.Away_Score
    }) AS matches
}

CALL (ls) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL
    WITH p, sum(r.Goals) AS goals
    ORDER BY goals DESC, p.Player_Name ASC
    RETURN collect({
        player: p.Player_Name,
        goals: goals
    })[0..5] AS top5Goalscorers
}

CALL (ls) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Assists IS NOT NULL
    WITH p, sum(r.Assists) AS assists
    ORDER BY assists DESC, p.Player_Name ASC
    RETURN collect({
        player: p.Player_Name,
        assists: assists
    })[0..5] AS top5Assisters
}

RETURN
    l.League_Name AS league,
    s.Season_Year AS season,
    ls.League_Season_ID AS leagueSeasonId,
    champion,
    runnerUp,
    clubsWithStandings,
    top5Goalscorers,
    top5Assisters,
    matches
;
```

---

## Q11 — Domestic League All-Time Records (2000–2025)

```cypher
MATCH (l:League {League_ID: $leagueId})

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    WHERE toInteger(ls.Season_ID) >= 2000
      AND toInteger(ls.Season_ID) <= 2025
    MATCH (ls)-[st:HAS_STANDING]->(c:Club)
    WHERE st.Rank_Position = 1
    WITH c, count(*) AS titles
    ORDER BY titles DESC, c.Club_Name ASC
    WITH collect({
        club: c.Club_Name,
        titles: titles
    }) AS records
    RETURN records[0..10] AS mostTitles
}

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    WHERE toInteger(ls.Season_ID) >= 2000
      AND toInteger(ls.Season_ID) <= 2025
    MATCH (ls)-[st:HAS_STANDING]->(c:Club)
    WHERE st.Rank_Position = 2
    WITH c, count(*) AS runnerUpFinishes
    ORDER BY runnerUpFinishes DESC, c.Club_Name ASC
    WITH collect({
        club: c.Club_Name,
        runnerUpFinishes: runnerUpFinishes
    }) AS records
    RETURN records[0..10] AS mostRunnerUps
}

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    WHERE toInteger(ls.Season_ID) >= 2000
      AND toInteger(ls.Season_ID) <= 2025
    MATCH (s:Season)
    WHERE s.Season_ID = ls.Season_ID
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL
    WITH ls, p, sum(r.Goals) AS goals
    WITH ls, max(goals) AS highestGoals,
         collect({
             player: p.Player_Name,
             goals: goals
         }) AS candidates
    UNWIND candidates AS candidate
    WITH candidate
    WHERE candidate.goals = highestGoals
    WITH candidate.player AS player,
         count(*) AS goldenBootAwards
    ORDER BY goldenBootAwards DESC, player ASC
    WITH collect({
        player: player,
        goldenBootAwards: goldenBootAwards
    }) AS records
    RETURN records[0..10] AS mostGoldenBoots
}

CALL (l) {
    MATCH (ls:LeagueSeason)-[:FOR_LEAGUE]->(l)
    WHERE toInteger(ls.Season_ID) >= 2000
      AND toInteger(ls.Season_ID) <= 2025
    MATCH (s:Season)
    WHERE s.Season_ID = ls.Season_ID
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_Season_ID = ls.League_Season_ID
      AND r.Goals IS NOT NULL
    WITH p, ls, s, sum(r.Goals) AS goals
    ORDER BY goals DESC, p.Player_Name ASC
    WITH collect({
        player: p.Player_Name,
        season: s.Season_Year,
        seasonId: ls.League_Season_ID,
        goals: goals
    }) AS records
    RETURN records[0..10] AS highestScoringSeasons
}

CALL (l) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_ID = l.League_ID
      AND toInteger(r.Season_ID) >= 2000
      AND toInteger(r.Season_ID) <= 2025
      AND r.Goals IS NOT NULL
    WITH p, sum(r.Goals) AS totalGoals
    ORDER BY totalGoals DESC, p.Player_Name ASC
    WITH collect({
        player: p.Player_Name,
        totalGoals: totalGoals
    }) AS records
    RETURN records[0..10] AS top10Goalscorers
}

CALL (l) {
    MATCH (p:Player)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WHERE r.League_ID = l.League_ID
      AND toInteger(r.Season_ID) >= 2000
      AND toInteger(r.Season_ID) <= 2025
      AND r.Assists IS NOT NULL
    WITH p, sum(r.Assists) AS totalAssists
    ORDER BY totalAssists DESC, p.Player_Name ASC
    WITH collect({
        player: p.Player_Name,
        totalAssists: totalAssists
    }) AS records
    RETURN records[0..10] AS top10Assisters
}

RETURN
    l.League_Name AS league,
    "2000-2025" AS period,
    mostTitles,
    mostRunnerUps,
    mostGoldenBoots,
    highestScoringSeasons,
    top10Goalscorers,
    top10Assisters;
```

---

## Q12 — UCL History (2011–2025)

```cypher
/* Q12: UCL History, 2011-2025 */

MATCH (s:Season)
WHERE toInteger(s.Season_ID) >= 2011
  AND toInteger(s.Season_ID) <= 2025
  AND EXISTS {
      MATCH (:UCLMatch)-[:IN_SEASON]->(s)
  }

CALL (s) {
    OPTIONAL MATCH (m:UCLMatch)-[:IN_SEASON]->(s)
    RETURN count(DISTINCT m) AS matchCount
}

CALL (s) {
    OPTIONAL MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s)
    WHERE r.Status = "CHAMPION"
    RETURN collect(DISTINCT c.Club_Name) AS champions
}

CALL (s) {
    OPTIONAL MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s)
    WHERE r.Status = "RUNNER_UP"
    RETURN collect(DISTINCT c.Club_Name) AS runnersUp
}

CALL (s) {
    OPTIONAL MATCH (c:Club)-[:UCL_PARTICIPATED_IN]->(s)
    RETURN count(DISTINCT c) AS participatingClubs
}

CALL (s) {
    OPTIONAL MATCH (p:Player)-[r:UCL_STATS_FOR]->(s)
    WITH p, sum(coalesce(r.Goals, 0)) AS goals
    WHERE p IS NOT NULL
    WITH collect({
        player: p.Player_Name,
        goals: goals
    }) AS candidates
    WITH candidates,
         reduce(maxGoals = 0, x IN candidates |
             CASE
                 WHEN x.goals > maxGoals THEN x.goals
                 ELSE maxGoals
             END
         ) AS highestGoals
    UNWIND candidates AS candidate
    WITH candidate, highestGoals
    WHERE candidate.goals = highestGoals
    RETURN collect({
        player: candidate.player,
        goals: candidate.goals
    }) AS topScorers
}

RETURN
    "UEFA Champions League" AS competition,
    s.Season_Year AS season,
    s.Season_ID AS seasonId,
    matchCount,
    participatingClubs,
    champions,
    runnersUp,
    topScorers
ORDER BY toInteger(s.Season_ID);
```

---

## Q13 — UCL Season History

```cypher
/* Q13: UCL Season History */

MATCH (s:Season {Season_ID: $seasonId})
WHERE toInteger(s.Season_ID) >= 2011
  AND toInteger(s.Season_ID) <= 2025

CALL (s) {
    OPTIONAL MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s)
    WHERE r.Status = "CHAMPION"
    RETURN collect(DISTINCT c.Club_Name) AS champions
}

CALL (s) {
    OPTIONAL MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s)
    WHERE r.Status = "RUNNER_UP"
    RETURN collect(DISTINCT c.Club_Name) AS runnersUp
}

CALL (s) {
    OPTIONAL MATCH (c:Club)-[r:UCL_STANDING]->(s)
    WITH c, r
    WHERE c IS NOT NULL
    RETURN collect({
        club: c.Club_Name,
        stage: r.Stage,
        stageCategory: r.Stage_Category,
        position: r.Rank_Position,
        matchesPlayed: r.Matches_Played,
        wins: r.Wins,
        draws: r.Draws,
        losses: r.Losses,
        goalsFor: r.Goals_For,
        goalsAgainst: r.Goals_Against,
        goalDifference: r.Goal_Difference,
        points: r.Points
    }) AS standings
}

CALL (s) {
    OPTIONAL MATCH (p:Player)-[r:UCL_STATS_FOR]->(s)
    WITH p, sum(coalesce(r.Goals, 0)) AS goals
    WHERE p IS NOT NULL
    ORDER BY goals DESC, p.Player_Name ASC
    WITH collect({
        player: p.Player_Name,
        goals: goals
    }) AS scorers
    RETURN scorers[0..5] AS top5Goalscorers
}

CALL (s) {
    OPTIONAL MATCH (p:Player)-[r:UCL_STATS_FOR]->(s)
    WITH p, sum(coalesce(r.Assists, 0)) AS assists
    WHERE p IS NOT NULL
    ORDER BY assists DESC, p.Player_Name ASC
    WITH collect({
        player: p.Player_Name,
        assists: assists
    }) AS assisters
    RETURN assisters[0..5] AS top5Assisters
}

CALL (s) {
    OPTIONAL MATCH (m:UCLMatch)-[:IN_SEASON]->(s)
    WITH m
    ORDER BY m.Match_Date ASC
    RETURN collect({
        matchId: m.Match_ID,
        date: m.Match_Date,
        stage: m.Stage,
        home: m.Home_Club_Name,
        away: m.Away_Club_Name,
        homeScore: m.Home_Score,
        awayScore: m.Away_Score,
        scoreText: m.Score_Text,
        result: m.Result,
        penaltyHome: m.Penalty_Home,
        penaltyAway: m.Penalty_Away,
        shootoutWinner: m.Shootout_Winner
    }) AS matches
}

RETURN
    "UEFA Champions League" AS competition,
    s.Season_Year AS season,
    s.Season_ID AS seasonId,
    champions,
    runnersUp,
    standings,
    top5Goalscorers,
    top5Assisters,
    matches;
```

---

## Q14 — UCL All-Time Records (2011–2025)

```cypher
/* Q14: UCL All-Time Records, 2011-2025 */

/* 1. Most UCL titles */
CALL () {
    MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s:Season)
    WHERE r.Status = "CHAMPION"
      AND toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH c, count(*) AS titles
    ORDER BY titles DESC, c.Club_Name ASC
    RETURN collect({
        club: c.Club_Name,
        titles: titles
    })[0..10] AS mostTitles
}

/* 2. Most runner-up finishes */
CALL () {
    MATCH (c:Club)-[r:UCL_SEASON_RESULT]->(s:Season)
    WHERE r.Status = "RUNNER_UP"
      AND toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH c, count(*) AS runnerUpFinishes
    ORDER BY runnerUpFinishes DESC, c.Club_Name ASC
    RETURN collect({
        club: c.Club_Name,
        runnerUpFinishes: runnerUpFinishes
    })[0..10] AS mostRunnerUps
}

/* 3. Most UCL top-scorer awards, counting ties */
CALL () {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s:Season)
    WHERE toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH s, p, sum(coalesce(r.Goals, 0)) AS goals
    WITH s, max(goals) AS highestGoals,
         collect({
             player: p.Player_Name,
             goals: goals
         }) AS candidates
    UNWIND candidates AS candidate
    WITH s, highestGoals, candidate
    WHERE candidate.goals = highestGoals
    WITH candidate.player AS player,
         count(*) AS topScorerAwards
    ORDER BY topScorerAwards DESC, player ASC
    RETURN collect({
        player: player,
        topScorerAwards: topScorerAwards
    })[0..10] AS mostTopScorerAwards
}

/* 4. Highest-scoring individual seasons */
CALL () {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s:Season)
    WHERE toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH p, s, sum(coalesce(r.Goals, 0)) AS goals
    ORDER BY goals DESC, p.Player_Name ASC
    RETURN collect({
        player: p.Player_Name,
        seasonId: s.Season_ID,
        season: s.Season_Year,
        goals: goals
    })[0..10] AS highestScoringSeasons
}

/* 5. Top 10 UCL goalscorers */
CALL () {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s:Season)
    WHERE toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH p, sum(coalesce(r.Goals, 0)) AS totalGoals
    ORDER BY totalGoals DESC, p.Player_Name ASC
    RETURN collect({
        player: p.Player_Name,
        totalGoals: totalGoals
    })[0..10] AS top10Goalscorers
}

/* 6. Top 10 UCL assisters */
CALL () {
    MATCH (p:Player)-[r:UCL_STATS_FOR]->(s:Season)
    WHERE toInteger(s.Season_ID) >= 2011
      AND toInteger(s.Season_ID) <= 2025
    WITH p, sum(coalesce(r.Assists, 0)) AS totalAssists
    ORDER BY totalAssists DESC, p.Player_Name ASC
    RETURN collect({
        player: p.Player_Name,
        totalAssists: totalAssists
    })[0..10] AS top10Assisters
}

RETURN
    "UEFA Champions League" AS competition,
    "2011-2025" AS period,
    mostTitles,
    mostRunnerUps,
    mostTopScorerAwards,
    highestScoringSeasons,
    top10Goalscorers,
    top10Assisters;
```

---

## Q15 — Player Overview and Clubs Played For

```cypher
MATCH (p:Player {Player_ID: $playerId})

CALL (p) {
    OPTIONAL MATCH (p)-[r:DOMESTIC_STATS_FOR]->(c:Club)
    WITH c,
         collect(DISTINCT r.League_ID) AS leagueIds,
         collect(DISTINCT r.Season_ID) AS seasons
    WHERE c IS NOT NULL
    RETURN collect({
        clubId: c.Club_ID,
        club: c.Club_Name,
        leagues: leagueIds,
        seasons: seasons
    }) AS domesticClubs
}

CALL (p) {
    OPTIONAL MATCH (p)-[r:UCL_STATS_FOR]->(s:Season)
    OPTIONAL MATCH (c:Club {Club_ID: r.Club_ID})
    WITH c, collect(DISTINCT s.Season_Year) AS seasons
    WHERE c IS NOT NULL
    RETURN collect({
        clubId: c.Club_ID,
        club: c.Club_Name,
        uclSeasons: seasons
    }) AS uclClubs
}

RETURN
    p.Player_ID AS playerId,
    p.Player_Name AS playerName,
    p.DOB AS dateOfBirth,
    p.Nationality AS nationality,
    p.Position AS position,
    domesticClubs,
    uclClubs;
```

---

## Q16 — Player Career Statistics History

```cypher
MATCH (p:Player {Player_ID: $playerId})

CALL (p) {
    OPTIONAL MATCH (p)-[r:DOMESTIC_STATS_FOR]->(:Club)
    WITH
        r.Season_ID AS seasonId,
        r.League_ID AS leagueId,
        r.League_Season_ID AS leagueSeasonId,
        sum(coalesce(r.Appearances, 0)) AS appearances,
        sum(coalesce(r.Starts, 0)) AS starts,
        sum(coalesce(r.Minutes, 0)) AS minutes,
        sum(coalesce(r.Goals, 0)) AS goals,
        sum(coalesce(r.Assists, 0)) AS assists,
        sum(coalesce(r.Yellow_Cards, 0)) AS yellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS redCards
    WHERE seasonId IS NOT NULL
    RETURN collect({
        seasonId: seasonId,
        leagueId: leagueId,
        leagueSeasonId: leagueSeasonId,
        appearances: appearances,
        starts: starts,
        minutes: minutes,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards
    }) AS domesticHistory
}

CALL (p) {
    OPTIONAL MATCH (p)-[r:UCL_STATS_FOR]->(s:Season)
    WITH
        s.Season_ID AS seasonId,
        s.Season_Year AS season,
        sum(coalesce(r.Appearances, 0)) AS appearances,
        sum(coalesce(r.Starts, 0)) AS starts,
        sum(coalesce(r.Minutes, 0)) AS minutes,
        sum(coalesce(r.Goals, 0)) AS goals,
        sum(coalesce(r.Assists, 0)) AS assists,
        sum(coalesce(r.Yellow_Cards, 0)) AS yellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS redCards
    WHERE seasonId IS NOT NULL
    RETURN collect({
        seasonId: seasonId,
        season: season,
        appearances: appearances,
        starts: starts,
        minutes: minutes,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards
    }) AS uclHistory
}

RETURN
    p.Player_ID AS playerId,
    p.Player_Name AS playerName,
    domesticHistory,
    uclHistory;
```

---

## Q17 — Player Season-Specific Statistics

```cypher
MATCH (p:Player {Player_ID: $playerId})

CALL (p) {
    OPTIONAL MATCH (p)-[r:DOMESTIC_STATS_FOR]->(c:Club)
    WHERE r.Season_ID = $seasonId
    WITH
        sum(coalesce(r.Appearances, 0)) AS appearances,
        sum(coalesce(r.Starts, 0)) AS starts,
        sum(coalesce(r.Minutes, 0)) AS minutes,
        sum(coalesce(r.Goals, 0)) AS goals,
        sum(coalesce(r.Assists, 0)) AS assists,
        sum(coalesce(r.Yellow_Cards, 0)) AS yellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS redCards,
        collect(DISTINCT c.Club_Name) AS clubs,
        collect(DISTINCT r.League_ID) AS leagues
    RETURN {
        appearances: appearances,
        starts: starts,
        minutes: minutes,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards,
        clubs: [x IN clubs WHERE x IS NOT NULL],
        leagues: [x IN leagues WHERE x IS NOT NULL]
    } AS domesticStats
}

CALL (p) {
    OPTIONAL MATCH (p)-[r:UCL_STATS_FOR]->(s:Season)
    WHERE r.Season_ID = $seasonId
    WITH
        sum(coalesce(r.Appearances, 0)) AS appearances,
        sum(coalesce(r.Starts, 0)) AS starts,
        sum(coalesce(r.Minutes, 0)) AS minutes,
        sum(coalesce(r.Goals, 0)) AS goals,
        sum(coalesce(r.Assists, 0)) AS assists,
        sum(coalesce(r.Yellow_Cards, 0)) AS yellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS redCards
    RETURN {
        appearances: appearances,
        starts: starts,
        minutes: minutes,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards
    } AS uclStats
}

RETURN
    p.Player_ID AS playerId,
    p.Player_Name AS playerName,
    $seasonId AS seasonId,
    domesticStats,
    uclStats;
```

---

## Q18 — Player All-Time Records and Awards

```cypher
MATCH (p:Player {Player_ID: $playerId})

CALL (p) {
    OPTIONAL MATCH (p)-[r:DOMESTIC_STATS_FOR]->(:Club)
    RETURN
        sum(coalesce(r.Goals, 0)) AS domesticGoals,
        sum(coalesce(r.Assists, 0)) AS domesticAssists,
        sum(coalesce(r.Appearances, 0)) AS domesticAppearances,
        sum(coalesce(r.Starts, 0)) AS domesticStarts,
        sum(coalesce(r.Minutes, 0)) AS domesticMinutes,
        sum(coalesce(r.Yellow_Cards, 0)) AS domesticYellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS domesticRedCards
}

CALL (p) {
    OPTIONAL MATCH (p)-[r:UCL_STATS_FOR]->(:Season)
    RETURN
        sum(coalesce(r.Goals, 0)) AS uclGoals,
        sum(coalesce(r.Assists, 0)) AS uclAssists,
        sum(coalesce(r.Appearances, 0)) AS uclAppearances,
        sum(coalesce(r.Starts, 0)) AS uclStarts,
        sum(coalesce(r.Minutes, 0)) AS uclMinutes,
        sum(coalesce(r.Yellow_Cards, 0)) AS uclYellowCards,
        sum(coalesce(r.Red_Cards, 0)) AS uclRedCards
}

CALL (p) {
    OPTIONAL MATCH (p)-[r:WON_AWARD]->(a:Award)
    OPTIONAL MATCH (c:Club {Club_ID: r.Club_ID})
    WITH r, a, c
    WHERE a IS NOT NULL
    RETURN
        collect({
            award: a.Award_Name,
            awardType: a.Award_Type,
            seasonId: r.Season_ID,
            club: c.Club_Name
        }) AS awards,
        count(a) AS awardCount
}

RETURN
    p.Player_ID AS playerId,
    p.Player_Name AS playerName,

    domesticGoals,
    domesticAssists,
    domesticAppearances,
    domesticStarts,
    domesticMinutes,
    domesticYellowCards,
    domesticRedCards,

    uclGoals,
    uclAssists,
    uclAppearances,
    uclStarts,
    uclMinutes,
    uclYellowCards,
    uclRedCards,

    domesticGoals + uclGoals AS combinedGoals,
    domesticAssists + uclAssists AS combinedAssists,
    domesticAppearances + uclAppearances AS combinedAppearances,
    domesticStarts + uclStarts AS combinedStarts,
    domesticMinutes + uclMinutes AS combinedMinutes,
    domesticYellowCards + uclYellowCards AS combinedYellowCards,
    domesticRedCards + uclRedCards AS combinedRedCards,

    awards,
    awardCount;
```

