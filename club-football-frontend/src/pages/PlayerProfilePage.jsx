import { ArrowLeft, Award } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { PlayerClubs } from '../components/PlayerClubs.jsx'
import { PlayerHeader } from '../components/PlayerHeader.jsx'
import { CareerHistory } from '../components/PlayerStats.jsx'
import { getPlayerCareer, getPlayerOverview } from '../services/api.js'
import { usePlayerResource } from '../hooks/usePlayerResource.js'

export function PlayerProfilePage() {
  const { playerId } = useParams()
  const overview = usePlayerResource(getPlayerOverview, [playerId])
  const career = usePlayerResource(getPlayerCareer, [playerId])
  if (overview.status === 'loading' || career.status === 'loading') return <PageContainer><LoadingState label="Loading player profile…" /></PageContainer>
  if (overview.status === 'error') return <PageContainer><ErrorState message={overview.error} /></PageContainer>
  if (career.status === 'error') return <PageContainer><ErrorState message={career.error} /></PageContainer>
  const player = overview.data
  return <PageContainer><Link to="/" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to home</Link><PlayerHeader player={player} /><section className="mt-10"><h2 className="text-2xl font-bold tracking-tight text-ink">Clubs played for</h2><div className="mt-4"><PlayerClubs domesticClubs={player.domesticClubs} uclClubs={player.uclClubs} /></div></section><section className="mt-12"><CareerHistory domesticHistory={career.data.domesticHistory} uclHistory={career.data.uclHistory} playerId={playerId} /></section><Link to={`/players/${encodeURIComponent(playerId)}/records`} className="focus-ring mt-10 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-green-200 hover:text-pitch-dark"><Award size={17} /> View all-time records and awards</Link></PageContainer>
}
