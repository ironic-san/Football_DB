import { Link } from 'react-router-dom'

const statFields = [['appearances', 'Appearances'], ['starts', 'Starts'], ['minutes', 'Minutes'], ['goals', 'Goals'], ['assists', 'Assists'], ['yellowCards', 'Yellow cards'], ['redCards', 'Red cards']]
const value = (item, key) => item?.[key] === null || item?.[key] === undefined ? '—' : item[key]
const seasonLabelFromId = (seasonId) => {
  const match = String(seasonId || '').match(/^((?:19|20)\d{2})$/)
  if (!match) return ''
  const startYear = Number(match[1])
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`
}

export function StatCards({ stats, title }) {
  return <section><h3 className="mb-3 text-lg font-bold text-ink">{title}</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{statFields.map(([key, label]) => <div key={key} className="surface p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-ink">{value(stats, key)}</p></div>)}</div></section>
}

export function CareerHistory({ domesticHistory = [], uclHistory = [], playerId }) {
  const seasonLabels = new Map([...domesticHistory, ...uclHistory].filter((row) => row?.seasonId && (row.seasonLabel || row.season)).map((row) => [String(row.seasonId), row.seasonLabel || row.season]))
  function table(rows, type) {
    if (!rows.length) return <div className="surface p-6 text-sm text-slate-500">No {type} career history was returned.</div>
    return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Season</th><th className="px-4 py-3">Competition</th><th className="px-4 py-3">Apps</th><th className="px-4 py-3">Goals</th><th className="px-4 py-3">Assists</th><th className="px-4 py-3">Minutes</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => { const seasonLabel = row.seasonLabel || row.season || seasonLabels.get(String(row.seasonId)) || seasonLabelFromId(row.seasonId); return <tr key={`${row.seasonId}-${row.leagueId || type}-${index}`}><td className="px-4 py-3 font-medium text-ink">{row.seasonId && seasonLabel ? <Link state={{ seasonLabel }} to={`/players/${encodeURIComponent(playerId)}/seasons/${encodeURIComponent(row.seasonId)}`} className="focus-ring rounded text-pitch hover:text-pitch-dark">{seasonLabel}</Link> : seasonLabel || '—'}</td><td className="px-4 py-3 text-slate-600">{type}</td><td className="px-4 py-3 text-slate-600">{value(row, 'appearances')}</td><td className="px-4 py-3 text-slate-600">{value(row, 'goals')}</td><td className="px-4 py-3 text-slate-600">{value(row, 'assists')}</td><td className="px-4 py-3 text-slate-600">{value(row, 'minutes')}</td></tr>})}</tbody></table></div>
  }
  return <section><h2 className="text-2xl font-bold tracking-tight text-ink">Career statistics</h2><div className="mt-5 space-y-8"><div><h3 className="mb-3 text-lg font-bold text-ink">Domestic history</h3>{table(domesticHistory, 'Domestic')}</div><div><h3 className="mb-3 text-lg font-bold text-ink">UEFA Champions League history</h3>{table(uclHistory, 'UCL')}</div></div><p className="mt-4 text-xs text-slate-400">Select a season row’s player route when season-specific detail is available.</p><Link className="sr-only" to={`/players/${encodeURIComponent(playerId)}`}>Player profile</Link></section>
}
