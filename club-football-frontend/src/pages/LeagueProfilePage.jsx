import { ArrowLeft, BarChart3, Calendar } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DetailGrid, RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { useResource } from '../hooks/useResource.js'
import { getLeagueHistory, getLeagueOverview } from '../services/api.js'

export function LeagueProfilePage() {
  const { leagueId } = useParams()
  const overview = useResource(getLeagueOverview, [leagueId])
  const history = useResource(getLeagueHistory, [leagueId])
  if ([overview, history].some((item) => item.status === 'loading')) return <PageContainer><LoadingState label="Loading league profile…" /></PageContainer>
  if (overview.status === 'error') return <PageContainer><ErrorState message={overview.error} /></PageContainer>
  if (history.status === 'error') return <PageContainer><ErrorState message={history.error} /></PageContainer>
  const league = overview.data
  return <PageContainer><Link to="/" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to home</Link><section className="surface p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white"><BarChart3 size={26} /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">League profile</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{league.league || 'Unnamed league'}</h1><p className="mt-2 text-slate-600">{[league.country, league.tier ? `Tier ${league.tier}` : ''].filter(Boolean).join(' · ')}</p></div></div><div className="mt-8"><DetailGrid data={{ seasonsRecorded: league.seasonsRecorded, totalMatches: league.totalMatches, totalClubs: league.totalClubs }} /></div></section><SectionCard title="Available seasons"><RecordTable rows={league.availableSeasons} title="available seasons" seasonHref={(seasonId) => `/leagues/${encodeURIComponent(leagueId)}/seasons/${encodeURIComponent(seasonId)}`} /></SectionCard><SectionCard title="League history"><RecordTable rows={history.data} title="league history" /></SectionCard><div className="mt-8 flex flex-wrap gap-3"><Link to={`/leagues/${encodeURIComponent(leagueId)}/records`} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-green-200 hover:text-pitch-dark"><BarChart3 size={17} /> Domestic all-time records</Link><span className="self-center text-xs text-slate-400">Covered period: 2000–2025</span></div></PageContainer>
}
