import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getClubDomesticHistory, getClubOverview, getClubSeason, getClubUclHistory, getDomesticRecords, getLeagueHistory, getLeagueOverview, getLeagueSeason, getPlayerCareer, getPlayerOverview, getPlayerRecords, getPlayerSeason, getUclHistory, getUclRecords, getUclSeason, searchEntities } from './api.js'

describe('searchEntities', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('maps each category to the backend search endpoint and returns the response contract', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ queryId: 'Q2', count: 1, results: [{ playerId: 'P004432', player: 'Cristiano Ronaldo' }] }) })
    const payload = await searchEntities('players', 'ronaldo')
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/search/players?search=ronaldo', expect.objectContaining({ method: 'GET' }))
    expect(payload.results[0].playerId).toBe('P004432')
  })

  it('surfaces backend errors without exposing implementation details', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ detail: 'Neo4j is not configured or unavailable' }) })
    await expect(searchEntities('clubs', 'united')).rejects.toThrow('Neo4j is not configured or unavailable')
  })

  it('rejects malformed success responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) })
    await expect(searchEntities('leagues', 'premier')).rejects.toThrow('unexpected search response')
  })

  it('uses the established Q15-Q18 player endpoint paths', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ queryId: 'Q15', count: 1, results: [{ playerId: 'P004432' }] }) })
    await getPlayerOverview('P004432')
    await getPlayerCareer('P004432')
    await getPlayerSeason('P004432', '2011')
    await getPlayerRecords('P004432')
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      'http://localhost:8000/api/v1/players/P004432',
      'http://localhost:8000/api/v1/players/P004432/career',
      'http://localhost:8000/api/v1/players/P004432/seasons/2011',
      'http://localhost:8000/api/v1/players/P004432/records',
    ])
  })

  it('uses the established Q4-Q14 endpoint paths', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ queryId: 'query', count: 1, results: [{}] }) })
    await getClubOverview('CLUB_0127')
    await getClubDomesticHistory('CLUB_0127')
    await getClubUclHistory('CLUB_0127')
    await getClubSeason('CLUB_0127', '2011')
    await getLeagueOverview('L001')
    await getLeagueHistory('L001')
    await getLeagueSeason('L001', '2011')
    await getDomesticRecords('L001')
    await getUclHistory()
    await getUclSeason('2011')
    await getUclRecords()
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      'http://localhost:8000/api/v1/clubs/CLUB_0127',
      'http://localhost:8000/api/v1/clubs/CLUB_0127/domestic-history',
      'http://localhost:8000/api/v1/clubs/CLUB_0127/ucl-history',
      'http://localhost:8000/api/v1/clubs/CLUB_0127/seasons/2011',
      'http://localhost:8000/api/v1/leagues/L001',
      'http://localhost:8000/api/v1/leagues/L001/history',
      'http://localhost:8000/api/v1/leagues/L001/seasons/2011',
      'http://localhost:8000/api/v1/leagues/L001/records',
      'http://localhost:8000/api/v1/champions-league/history',
      'http://localhost:8000/api/v1/champions-league/seasons/2011',
      'http://localhost:8000/api/v1/champions-league/records',
    ])
  })
})
