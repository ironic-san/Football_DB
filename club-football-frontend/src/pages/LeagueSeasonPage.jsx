import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DetailGrid, RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { useResource } from '../hooks/useResource.js'
import { getLeagueSeason } from '../services/api.js'

export function LeagueSeasonPage() {
  const { leagueId, seasonId } = useParams()
  const resource = useResource(getLeagueSeason, [leagueId, seasonId])
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading league season…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  return <PageContainer><Link to={`/leagues/${encodeURIComponent(leagueId)}`} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to league profile</Link><section className="surface p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">League season</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{data.league || 'League season history'}</h1><p className="mt-2 text-slate-600">Season {data.season || 'Selected season'}</p></section><SectionCard title="Champion and runner-up"><DetailGrid data={{ champion: data.champion, runnerUp: data.runnerUp, clubsWithStandings: data.clubsWithStandings }} /></SectionCard><SectionCard title="Top five goalscorers"><RecordTable rows={data.top5Goalscorers} title="goalscorers" /></SectionCard><SectionCard title="Top five assisters"><RecordTable rows={data.top5Assisters} title="assisters" /></SectionCard><SectionCard title="Matches"><RecordTable rows={data.matches} title="matches" /></SectionCard></PageContainer>
}
