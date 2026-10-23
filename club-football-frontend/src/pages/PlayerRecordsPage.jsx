import { ArrowLeft, Award } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { PlayerHeader } from '../components/PlayerHeader.jsx'
import { StatCards } from '../components/PlayerStats.jsx'
import { getPlayerRecords } from '../services/api.js'
import { usePlayerResource } from '../hooks/usePlayerResource.js'

export function PlayerRecordsPage() {
  const { playerId } = useParams()
  const resource = usePlayerResource(getPlayerRecords, [playerId])
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading records and awards…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  const player = { playerId: data.playerId || playerId, playerName: data.playerName }
  const combined = { goals: data.combinedGoals, assists: data.combinedAssists, appearances: data.combinedAppearances, starts: data.combinedStarts, minutes: data.combinedMinutes, yellowCards: data.combinedYellowCards, redCards: data.combinedRedCards }
  function records(prefix) { return { appearances: data[`${prefix}Appearances`], starts: data[`${prefix}Starts`], minutes: data[`${prefix}Minutes`], goals: data[`${prefix}Goals`], assists: data[`${prefix}Assists`], yellowCards: data[`${prefix}YellowCards`], redCards: data[`${prefix}RedCards`] } }
  return <PageContainer><Link to={`/players/${encodeURIComponent(playerId)}`} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to player profile</Link><PlayerHeader player={player} /><div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">All-time records</p><h2 className="mt-2 text-2xl font-bold text-ink">Career totals</h2><div className="mt-6 space-y-8"><StatCards stats={records('domestic')} title="Domestic records" /><StatCards stats={records('ucl')} title="UEFA Champions League records" /><StatCards stats={combined} title="Combined records" /></div></div><section className="mt-12"><div className="flex items-center gap-3"><Award className="text-pitch" size={22} /><h2 className="text-2xl font-bold text-ink">Awards and honours</h2></div>{data.awards?.length ? <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Award</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Season</th><th className="px-4 py-3">Club</th></tr></thead><tbody className="divide-y divide-slate-100">{data.awards.map((award, index) => <tr key={`${award.award || 'award'}-${index}`}><td className="px-4 py-3 font-medium text-ink">{award.award || '—'}</td><td className="px-4 py-3 text-slate-600">{award.awardType || '—'}</td><td className="px-4 py-3 text-slate-600">{award.season || '—'}</td><td className="px-4 py-3 text-slate-600">{award.club || '—'}</td></tr>)}</tbody></table></div> : <div className="surface mt-5 p-6 text-sm text-slate-500">No awards were returned for this player.</div>}</section></PageContainer>
}
