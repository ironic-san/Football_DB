import { LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Loading player data…' }) {
  return <div className="surface flex items-center justify-center gap-3 p-12 text-sm text-slate-600"><LoaderCircle className="animate-spin text-pitch" size={21} />{label}</div>
}
