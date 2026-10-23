import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { PlayerHeader } from '../components/PlayerHeader.jsx'
import { StatCards } from '../components/PlayerStats.jsx'
import { getPlayerSeason } from '../services/api.js'
import { usePlayerResource } from '../hooks/usePlayerResource.js'

export function PlayerSeasonPage() {
  const { playerId, seasonId } = useParams()
  const location = useLocation()
  const resource = usePlayerResource(getPlayerSeason, [playerId, seasonId])
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading season statistics…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  const player = { playerId: data.playerId || playerId, playerName: data.playerName }
  const seasonLabel = data.seasonLabel || data.season || location.state?.seasonLabel
  return <PageContainer><Link to={`/players/${encodeURIComponent(playerId)}`} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to player profile</Link><PlayerHeader player={player} /><div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Season statistics</p><h2 className="mt-2 text-2xl font-bold text-ink">{seasonLabel || 'Season label unavailable'}</h2></div><div className="mt-6 space-y-8"><div><StatCards stats={data.domesticStats} title="Domestic statistics" /><p className="mt-3 text-sm text-slate-500">Clubs: {data.domesticStats?.clubs?.length ? data.domesticStats.clubs.join(', ') : '—'}</p></div><StatCards stats={data.uclStats} title="UEFA Champions League statistics" /></div></PageContainer>
}
