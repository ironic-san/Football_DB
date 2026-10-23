import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { DetailGrid, RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { useResource } from '../hooks/useResource.js'
import { getClubSeason } from '../services/api.js'

function seasonLabel(value) {
  const match = String(value || '').match(/^((?:19|20)\d{2})$/)
  if (!match) return ''
  const year = Number(match[1])
  return `${year}/${String((year + 1) % 100).padStart(2, '0')}`
}

export function ClubSeasonPage() {
  const { clubId, seasonId } = useParams()
  const location = useLocation()
  const resource = useResource(getClubSeason, [clubId, seasonId])
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading club season…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  const selectedSeason = location.state?.seasonLabel || data.seasonLabel || seasonLabel(data.season) || data.season
  const domesticLeaders = { topScorer: data.domesticTopScorer, topAssister: data.domesticTopAssister }
  const uclLeaders = { topScorer: data.uclTopScorer, topAssister: data.uclTopAssister }
  return <PageContainer><Link to={`/clubs/${encodeURIComponent(clubId)}`} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to club profile</Link><section className="surface p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Club season</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{data.club || 'Club season overview'}</h1><p className="mt-2 text-slate-600">{selectedSeason || 'Season label unavailable'}</p></section><SectionCard title="Domestic Performance"><DetailGrid data={data.domesticPerformance} /><DetailGrid data={domesticLeaders} /></SectionCard><SectionCard title="Domestic Matches"><RecordTable rows={data.domesticMatches} title="domestic matches" /></SectionCard><SectionCard title="UEFA Champions League Performance"><DetailGrid data={data.uclPerformance} /><DetailGrid data={uclLeaders} /></SectionCard><SectionCard title="UEFA Champions League Matches"><RecordTable rows={data.uclMatches} title="UCL matches" /></SectionCard><SectionCard title="Titles Won"><RecordTable rows={data.titlesWon} title="titles" /></SectionCard></PageContainer>
}
