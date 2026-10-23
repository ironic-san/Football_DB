import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ErrorState({ message }) {
  return <div role="alert" className="surface flex flex-col items-center p-10 text-center"><AlertCircle className="text-red-600" size={26} /><h1 className="mt-4 text-xl font-bold text-ink">Player data unavailable</h1><p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p><Link to="/" className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg bg-pitch px-4 py-2 text-sm font-semibold text-white hover:bg-pitch-dark"><ArrowLeft size={16} /> Return home</Link></div>
}
