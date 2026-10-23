import { Award, Database, Flag, Shield, Trophy } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryCard } from '../components/CategoryCard.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { SearchBar } from '../components/SearchBar.jsx'
import { SearchResults } from '../components/SearchResults.jsx'
import { useSearch } from '../hooks/useSearch.js'

const categories = [
  { title: 'Players', description: 'Career paths, appearances, and individual records.', icon: Award, to: '/players' },
  { title: 'Clubs', description: 'Club identities, domestic histories, and seasons.', icon: Shield, to: '/clubs' },
  { title: 'Leagues', description: 'Competition histories, standings, and records.', icon: Flag, to: '/leagues' },
  { title: 'UEFA Champions League', description: 'European participation and competition history.', icon: Trophy, to: '/competitions/ucl', clickable: true },
]

export function HomePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialCategory = ['players', 'clubs', 'leagues'].includes(searchParams.get('category')) ? searchParams.get('category') : 'players'
  const initialTerm = searchParams.get('search') || ''
  const search = useSearch(initialCategory, initialTerm)
  useEffect(() => {
    search.setCategory(initialCategory)
    search.setTerm(initialTerm)
    if (initialTerm) {
      search.execute(initialTerm, initialCategory)
    }
  }, [initialTerm, initialCategory])

  function submitSearch() {
    const normalizedTerm = search.term.trim()
    if (!normalizedTerm) {
      search.execute()
      return
    }
    navigate(`/?search=${encodeURIComponent(normalizedTerm)}&category=${search.category}`)
  }

  function clearSearch() {
    search.clear()
    navigate('/')
  }

  return (
    <PageContainer>
      <section className="grid items-end gap-10 border-b border-slate-200 pb-12 lg:grid-cols-[1fr_0.8fr] lg:pb-16">
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-pitch"><Database size={15} /> Football reference archive</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">The history of club football, connected.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Explore the people, clubs, leagues, seasons, and competitions that shape the modern game. A structured home for football history and statistics.</p>
        </div>
        <div className="surface p-5 sm:p-6">
          <p className="mb-3 text-sm font-semibold text-ink">Search the archive</p>
          <SearchBar category={search.category} term={search.term} onCategoryChange={search.setCategory} onTermChange={search.setTerm} onSubmit={submitSearch} onClear={clearSearch} loading={search.status === 'loading'} />
          <p className="mt-3 text-xs text-slate-400">Search players, clubs, and leagues from the connected database.</p>
        </div>
      </section>

      <SearchResults category={search.category} status={search.status} results={search.results} count={search.count} error={search.error} onRetry={() => search.execute(search.term, search.category, { force: true })} />

      <section className="pt-12" aria-labelledby="explore-heading">
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Explore the archive</p><h2 id="explore-heading" className="mt-2 text-2xl font-bold tracking-tight text-ink">Start with a subject</h2></div></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <CategoryCard key={category.title} {...category} />)}</div>
      </section>

      <section className="mt-12 grid gap-6 rounded-2xl bg-ink p-7 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">Built for context</p><h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">More than a stat line.</h2></div>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">The database is designed to make connections visible: a player’s career across clubs, a club’s seasons across competitions, and the records that link them together. Those detailed views will arrive incrementally.</p>
      </section>
    </PageContainer>
  )
}
