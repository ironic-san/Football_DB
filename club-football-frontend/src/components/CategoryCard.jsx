import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export function CategoryCard({ icon: Icon, title, description, to, clickable = false }) {
  const content = <><div className="flex items-start justify-between gap-4"><span className={`grid h-11 w-11 place-items-center rounded-xl bg-green-50 text-pitch ${clickable ? 'transition-colors group-hover:bg-pitch group-hover:text-white' : ''}`}><Icon size={21} /></span>{clickable && <ArrowUpRight size={19} className="text-slate-300 transition-colors group-hover:text-pitch" aria-hidden="true" />}</div><div className="mt-7"><h3 className="font-semibold text-ink">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div></>
  return (
    clickable ? <Link to={to} className="focus-ring surface group flex min-h-44 flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg">{content}</Link> : <div className="surface group flex min-h-44 flex-col justify-between p-5">{content}</div>
  )
}
