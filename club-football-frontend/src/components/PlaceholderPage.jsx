import { ArrowLeft, Construction } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from './PageContainer.jsx'

export function PlaceholderPage({ title, description, paramNames = [] }) {
  const params = useParams()
  return (
    <PageContainer>
      <Link to="/" className="focus-ring mb-10 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark">
        <ArrowLeft size={16} /> Back to home
      </Link>
      <div className="surface max-w-3xl p-7 sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-700"><Construction size={22} /></span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-pitch">Stage 1 foundation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">{description}</p>
        {paramNames.length > 0 && (
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Route context</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {paramNames.map((name) => <div key={name} className="flex justify-between gap-4"><dt className="text-slate-500">{name}</dt><dd className="font-mono font-medium text-ink">{params[name]}</dd></div>)}
            </dl>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
