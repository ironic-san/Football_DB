import { ArrowLeft, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { useResource } from '../hooks/useResource.js'
import { getUclRecords } from '../services/api.js'

export function UclRecordsPage() {
  const resource = useResource(getUclRecords)
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading Champions League records…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  const data = resource.data
  return <PageContainer><Link to="/competitions/ucl" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to Champions League</Link><section className="surface p-6 sm:p-8"><div className="flex items-start gap-4"><Trophy className="mt-1 text-pitch" size={25} /><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">All-time records</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">UEFA Champions League records</h1><p className="mt-2 text-slate-600">Covered period: {data.period || '2011–2025'}</p></div></div></section><SectionCard title="Most titles"><RecordTable rows={data.mostTitles} title="title records" /></SectionCard><SectionCard title="Most runner-up finishes"><RecordTable rows={data.mostRunnerUps} title="runner-up records" /></SectionCard><SectionCard title="Most top-scorer awards"><RecordTable rows={data.mostTopScorerAwards} title="top-scorer awards" /></SectionCard><SectionCard title="Highest-scoring seasons"><RecordTable rows={data.highestScoringSeasons} title="scoring seasons" seasonLinks /></SectionCard><SectionCard title="Top ten goalscorers"><RecordTable rows={data.top10Goalscorers} title="goalscorers" /></SectionCard><SectionCard title="Top ten assisters"><RecordTable rows={data.top10Assisters} title="assisters" /></SectionCard></PageContainer>
}
