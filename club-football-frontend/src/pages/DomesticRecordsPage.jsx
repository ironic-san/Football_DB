import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { useResource } from '../hooks/useResource.js'
import { getDomesticRecords } from '../services/api.js'

export function DomesticRecordsPage() {
  const { leagueId } = useParams()
  const resource = useResource(getDomesticRecords, [leagueId])
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading domestic records…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  return <PageContainer><Link to={`/leagues/${encodeURIComponent(leagueId)}`} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to league profile</Link><section className="surface p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Domestic all-time records</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{data.league || 'Domestic records'}</h1><p className="mt-2 text-slate-600">Covered period: {data.period || '2000–2025'}</p></section><SectionCard title="Most titles"><RecordTable rows={data.mostTitles} title="title records" /></SectionCard><SectionCard title="Most runner-up finishes"><RecordTable rows={data.mostRunnerUps} title="runner-up records" /></SectionCard><SectionCard title="Most golden boots"><RecordTable rows={data.mostGoldenBoots} title="golden boot records" /></SectionCard><SectionCard title="Highest-scoring seasons"><RecordTable rows={data.highestScoringSeasons} title="scoring seasons" /></SectionCard><SectionCard title="Top ten goalscorers"><RecordTable rows={data.top10Goalscorers} title="goalscorers" /></SectionCard><SectionCard title="Top ten assisters"><RecordTable rows={data.top10Assisters} title="assisters" /></SectionCard></PageContainer>
}
