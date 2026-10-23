import { CircleHelp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer.jsx'

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="surface max-w-2xl p-8 text-center sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500"><CircleHelp size={26} /></span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-pitch">404 · Page not found</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">That page is not in the archive.</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">The address may be incorrect, or this section may not have been added yet.</p>
        <Link to="/" className="focus-ring mt-7 inline-flex rounded-lg bg-pitch px-5 py-3 text-sm font-semibold text-white hover:bg-pitch-dark">Return to home</Link>
      </div>
    </PageContainer>
  )
}
