const API_PREFIX = '/api/v1'

const endpointByCategory = {
  players: 'search/players',
  clubs: 'search/clubs',
  leagues: 'search/leagues',
}

function getBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!configured) {
    throw new Error('API is not configured. Set VITE_API_BASE_URL in .env.local and restart Vite.')
  }
  return configured.replace(/\/$/, '')
}

function getApiUrl(path) {
  const base = getBaseUrl()
  const prefix = base.endsWith(API_PREFIX) ? '' : API_PREFIX
  return `${base}${prefix}/${path.replace(/^\//, '')}`
}

function errorMessage(status, payload) {
  if (payload && typeof payload.detail === 'string') return payload.detail
  if (status === 404) return 'The search endpoint was not found.'
  if (status >= 500) return 'The football database is temporarily unavailable.'
  return `Search request failed (HTTP ${status}).`
}

async function getJson(path, signal) {
  let response
  try {
    response = await fetch(getApiUrl(path), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Unable to reach the football backend. Check that FastAPI is running.')
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('The backend returned an invalid response.')
  }

  if (!response.ok) throw new Error(errorMessage(response.status, payload))
  if (!payload || !Array.isArray(payload.results)) throw new Error('The backend returned an unexpected response.')
  if (!payload.results.length) throw new Error('The requested record was not found.')
  return payload.results[0]
}

async function getRows(path, signal) {
  let response
  try {
    response = await fetch(getApiUrl(path), { method: 'GET', headers: { Accept: 'application/json' }, signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Unable to reach the football backend. Check that FastAPI is running.')
  }
  let payload
  try { payload = await response.json() } catch { throw new Error('The backend returned an invalid response.') }
  if (!response.ok) throw new Error(errorMessage(response.status, payload))
  if (!payload || !Array.isArray(payload.results)) throw new Error('The backend returned an unexpected response.')
  return payload.results
}

export async function searchEntities(category, search, signal) {
  const path = endpointByCategory[category]
  if (!path) throw new Error('Choose a valid search category.')

  const response = await fetch(`${getApiUrl(path)}?search=${encodeURIComponent(search)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('The backend returned an invalid response.')
  }

  if (!response.ok) throw new Error(errorMessage(response.status, payload))
  if (!payload || !Array.isArray(payload.results)) throw new Error('The backend returned an unexpected search response.')

  return payload
}

export function getPlayerOverview(playerId, signal) {
  return getJson(`players/${encodeURIComponent(playerId)}`, signal)
}

export function getPlayerCareer(playerId, signal) {
  return getJson(`players/${encodeURIComponent(playerId)}/career`, signal)
}

export function getPlayerSeason(playerId, seasonId, signal) {
  return getJson(`players/${encodeURIComponent(playerId)}/seasons/${encodeURIComponent(seasonId)}`, signal)
}

export function getPlayerRecords(playerId, signal) {
  return getJson(`players/${encodeURIComponent(playerId)}/records`, signal)
}

export function getClubOverview(clubId, signal) { return getJson(`clubs/${encodeURIComponent(clubId)}`, signal) }
export function getClubDomesticHistory(clubId, signal) { return getRows(`clubs/${encodeURIComponent(clubId)}/domestic-history`, signal) }
export function getClubUclHistory(clubId, signal) { return getRows(`clubs/${encodeURIComponent(clubId)}/ucl-history`, signal) }
export function getClubSeason(clubId, seasonId, signal) { return getJson(`clubs/${encodeURIComponent(clubId)}/seasons/${encodeURIComponent(seasonId)}`, signal) }
export function getLeagueOverview(leagueId, signal) { return getJson(`leagues/${encodeURIComponent(leagueId)}`, signal) }
export function getLeagueHistory(leagueId, signal) { return getRows(`leagues/${encodeURIComponent(leagueId)}/history`, signal) }
export function getLeagueSeason(leagueId, seasonId, signal) { return getJson(`leagues/${encodeURIComponent(leagueId)}/seasons/${encodeURIComponent(seasonId)}`, signal) }
export function getDomesticRecords(leagueId, signal) { return getJson(`leagues/${encodeURIComponent(leagueId)}/records`, signal) }
export function getUclHistory(signal) { return getRows('champions-league/history', signal) }
export function getUclSeason(seasonId, signal) { return getJson(`champions-league/seasons/${encodeURIComponent(seasonId)}`, signal) }
export function getUclRecords(signal) { return getJson('champions-league/records', signal) }

export const searchCategories = [
  { value: 'players', label: 'Players' },
  { value: 'clubs', label: 'Clubs' },
  { value: 'leagues', label: 'Leagues' },
]
