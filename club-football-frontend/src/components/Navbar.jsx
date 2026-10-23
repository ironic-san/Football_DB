import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SearchBar } from './SearchBar.jsx'
import { Shield } from 'lucide-react'

const links = [
  { label: 'Players' },
  { label: 'Clubs' },
  { label: 'Leagues' },
  { label: 'UEFA Champions League', to: '/competitions/ucl' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('players')
  const [term, setTerm] = useState('')

  function submitSearch() {
    if (!term.trim()) return
    navigate(`/?search=${encodeURIComponent(term.trim())}&category=${category}`)
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="focus-ring group mr-auto flex items-center gap-3 rounded-lg" aria-label="Club Football Database home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white transition-colors group-hover:bg-pitch">
            <Shield size={21} strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide text-ink">Club Football</span>
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-pitch">Database</span>
          </span>
        </Link>

        <nav className="order-3 flex w-full gap-1 overflow-x-auto pb-0.5 lg:order-2 lg:w-auto" aria-label="Primary navigation">
          {links.map(({ label, to }) => to ? (
            <Link key={label} to={to} className="focus-ring whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-ink">
              {label}
            </Link>
          ) : (
            <span key={label} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600">
              {label}
            </span>
          ))}
        </nav>

        <div className="order-2 w-full lg:order-3 lg:w-auto"><SearchBar compact category={category} term={term} onCategoryChange={setCategory} onTermChange={setTerm} onSubmit={submitSearch} onClear={() => setTerm('')} /></div>
      </div>
    </header>
  )
}
