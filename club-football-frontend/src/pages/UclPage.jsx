import { ArrowLeft, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { useResource } from '../hooks/useResource.js'
import { getUclHistory } from '../services/api.js'

export function UclPage() {
  const resource = useResource(getUclHistory)
  if (resource.status === 'loading') return <PageContainer><LoadingState label="Loading Champions League history…" /></PageContainer>
  if (resource.status === 'error') return <PageContainer><ErrorState message={resource.error} /></PageContainer>
  return <PageContainer><Link to="/" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to home</Link><section className="surface p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white"><Trophy size={26} /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Competition history</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">UEFA Champions League</h1><p className="mt-2 text-slate-600">Historical competition records returned for the available seasons.</p></div></div></section><SectionCard title="Season history"><RecordTable rows={resource.data} title="UCL seasons" seasonLinks /></SectionCard><Link to="/competitions/ucl/records" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-green-200 hover:text-pitch-dark"><Trophy size={17} /> All-time records</Link></PageContainer>
}
