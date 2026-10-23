import { ArrowLeft, LoaderCircle, SearchX } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageContainer } from '../components/PageContainer.jsx'
import { searchEntities } from '../services/api.js'

const entityConfig = {
  players: { label: 'player', plural: 'players', id: 'playerId', name: 'player', route: (id) => `/players/${encodeURIComponent(id)}` },
  clubs: { label: 'club', plural: 'clubs', id: 'clubId', name: 'club', route: (id) => `/clubs/${encodeURIComponent(id)}` },
  leagues: { label: 'league', plural: 'leagues', id: 'leagueId', name: 'league', route: (id) => `/leagues/${encodeURIComponent(id)}` },
}

export function EntityResolutionPage() {
  const { entityType } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const config = entityConfig[entityType]
  const name = params.get('name')?.trim() || ''
  const [state, setState] = useState({ status: 'loading', results: [], error: '' })

  useEffect(() => {
    let active = true
    if (!config || !name) {
      setState({ status: 'empty', results: [], error: '' })
      return () => { active = false }
    }
    setState({ status: 'loading', results: [], error: '' })
    searchEntities(config.plural, name)
      .then((payload) => {
        if (!active) return
        const results = Array.isArray(payload.results) ? payload.results : []
        if (results.length === 1 && results[0]?.[config.id]) {
          navigate(config.route(results[0][config.id]), { replace: true })
          return
        }
        setState({ status: 'success', results, error: '' })
      })
      .catch((error) => {
        if (active) setState({ status: 'error', results: [], error: error.message || 'Unable to resolve this reference.' })
      })
    return () => { active = false }
  }, [config, name, navigate])

  if (!config) return <PageContainer><p className="surface p-6 text-sm text-slate-600">This reference type is not supported.</p></PageContainer>
  return <PageContainer><button type="button" onClick={() => navigate(-1)} className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back</button><section className="surface p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Find {config.label}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{name || `Unknown ${config.label}`}</h1>{state.status === 'loading' && <div className="mt-8 flex items-center gap-3 text-sm text-slate-600"><LoaderCircle className="animate-spin text-pitch" size={20} /> Resolving this reference…</div>}{state.status === 'error' && <p role="alert" className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{state.error}</p>}{state.status === 'empty' && <p className="mt-8 text-sm text-slate-600">No reference was supplied.</p>}{state.status === 'success' && !state.results.length && <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 p-5 text-sm text-slate-600"><SearchX size={20} className="text-slate-400" /> No matching {config.label} was found.</div>}{state.status === 'success' && state.results.length > 1 && <div className="mt-8"><p className="text-sm text-slate-600">Multiple matches were found. Choose the correct {config.label}:</p><div className="mt-4 grid gap-3">{state.results.map((result, index) => result?.[config.id] ? <Link key={`${result[config.id]}-${index}`} to={config.route(result[config.id])} className="focus-ring rounded-xl border border-slate-200 p-4 hover:border-green-300"><span className="font-semibold text-ink">{result[config.name] || name}</span></Link> : <div key={`missing-${index}`} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">{result?.[config.name] || name} cannot be opened because no identifier was returned.</div>)}</div></div>}{state.status === 'success' && state.results.length === 1 && <p className="mt-8 text-sm text-slate-600">A matching result was returned, but it did not include an identifier for direct navigation.</p>}</section></PageContainer>
}
