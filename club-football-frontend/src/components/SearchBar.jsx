import { RotateCcw, Search } from 'lucide-react'
import { searchCategories } from '../services/api.js'

export function SearchBar({ category, term, onCategoryChange, onTermChange, onSubmit, onClear, loading = false, compact = false }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${compact ? 'sm:flex-row' : ''}`}>
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-pitch">
        <Search size={19} className="shrink-0 text-slate-400" aria-hidden="true" />
        <label htmlFor={compact ? 'nav-search' : 'home-search'} className="sr-only">Search players, clubs, or leagues</label>
        <input id={compact ? 'nav-search' : 'home-search'} value={term} onChange={(event) => onTermChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400" placeholder="Search players, clubs, or leagues" autoComplete="off" />
      </div>
      <div className="flex gap-2">
        <label htmlFor={compact ? 'nav-category' : 'home-category'} className="sr-only">Search category</label>
        <select id={compact ? 'nav-category' : 'home-category'} value={category} onChange={(event) => onCategoryChange(event.target.value)} className="focus-ring min-w-28 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-ink">
          {searchCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button type="submit" disabled={loading} className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-pitch px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-pitch-dark disabled:cursor-wait disabled:opacity-60">
          {loading ? 'Searching…' : 'Search'}
        </button>
        {!compact && <button type="button" onClick={onClear} className="focus-ring inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-500 hover:bg-slate-50" aria-label="Clear search"><RotateCcw size={17} /></button>}
      </div>
    </form>
  )
}
