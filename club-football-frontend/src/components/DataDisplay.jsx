import { Link } from 'react-router-dom'

const label = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
const scalar = (value) => value === null || value === undefined || value === '' ? '—' : String(value)
const internalKeys = new Set(['playerId', 'clubId', 'leagueId', 'seasonId', 'leagueSeasonId', 'matchId', 'topScorerId', 'topAssisterId'])
const referenceConfig = {
  player: { id: 'playerId', category: 'players', route: (id) => `/players/${encodeURIComponent(id)}` },
  playerName: { id: 'playerId', category: 'players', route: (id) => `/players/${encodeURIComponent(id)}` },
  topScorer: { id: 'topScorerId', category: 'players', route: (id) => `/players/${encodeURIComponent(id)}` },
  topAssister: { id: 'topAssisterId', category: 'players', route: (id) => `/players/${encodeURIComponent(id)}` },
  club: { id: 'clubId', category: 'clubs', route: (id) => `/clubs/${encodeURIComponent(id)}` },
  clubName: { id: 'clubId', category: 'clubs', route: (id) => `/clubs/${encodeURIComponent(id)}` },
  league: { id: 'leagueId', category: 'leagues', route: (id) => `/leagues/${encodeURIComponent(id)}` },
  leagueName: { id: 'leagueId', category: 'leagues', route: (id) => `/leagues/${encodeURIComponent(id)}` },
}

function Reference({ field, value, id }) {
  const config = referenceConfig[field]
  if (!config || value === null || value === undefined || value === '') return scalar(value)
  if (id) return <Link to={config.route(id)} className="focus-ring rounded text-pitch hover:text-pitch-dark">{scalar(value)}</Link>
  return <Link to={`/resolve/${config.category}?name=${encodeURIComponent(String(value))}`} className="focus-ring rounded text-pitch hover:text-pitch-dark" title={`Find ${value}`}>{scalar(value)}</Link>
}

function CellValue({ value, field }) {
  if (Array.isArray(value)) return <div className="space-y-1">{value.length ? value.map((item, index) => <div key={index}>{typeof item === 'object' && item !== null ? <CellValue value={item} /> : <Reference field={field} value={item} />}</div>) : '—'}</div>
  if (typeof value === 'object' && value !== null) return <dl className="space-y-1">{Object.entries(value).filter(([key, item]) => !internalKeys.has(key) && item !== null && item !== undefined && item !== '').map(([key, item]) => <div key={key} className="grid grid-cols-[minmax(0,auto)_1fr] gap-2"><dt className="font-medium text-slate-500">{label(key)}:</dt><dd><CellValue value={item} field={key} /></dd></div>)}</dl>
  return <Reference field={field} value={value} />
}

export function DetailGrid({ data }) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return <p className="text-sm text-slate-500">No additional details returned.</p>
  const entries = Object.entries(data).filter(([key, value]) => !internalKeys.has(key) && value !== null && value !== undefined && value !== '')
  if (!entries.length) return <p className="text-sm text-slate-500">No additional details returned.</p>
  return <dl className="grid gap-3 sm:grid-cols-2">{entries.map(([key, value]) => <div key={key} className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label(key)}</dt><dd className="mt-2 min-w-0 break-words text-sm leading-6 text-ink"><CellValue value={value} field={key} /></dd></div>)}</dl>
}

export function RecordTable({ rows, title, seasonLinks = false, seasonHref }) {
  if (!Array.isArray(rows) || !rows.length) return <div className="surface p-6 text-sm text-slate-500">No {title ? title.toLowerCase() : 'records'} were returned.</div>
  const columns = [...new Set(rows.flatMap((row) => row && typeof row === 'object' ? Object.keys(row) : []))].filter((column) => !internalKeys.has(column))
  if (!columns.length) return <div className="surface p-6 text-sm text-slate-500">No tabular records were returned.</div>
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft"><table className="min-w-full table-auto text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index}>{columns.map((column) => { const value = row?.[column]; const seasonValue = row?.seasonId; const config = referenceConfig[column]; const entityLink = config && value; const seasonLink = (seasonLinks || seasonHref) && (column === 'season' || column === 'seasonYear') && seasonValue; const destination = seasonHref ? seasonHref(seasonValue) : `/competitions/ucl/seasons/${encodeURIComponent(seasonValue)}`; return <td key={column} className="max-w-sm break-words px-4 py-3 align-top leading-6 text-slate-600">{entityLink ? <Reference field={column} value={value} id={row?.[config.id]} /> : seasonLink ? <Link to={destination} className="focus-ring rounded text-pitch hover:text-pitch-dark">{scalar(value)}</Link> : <CellValue value={value} field={column} />}</td> })}</tr>)}</tbody></table></div>
}

export function SectionCard({ title, children, eyebrow }) {
  return <section className="mt-10"><div className="mb-4">{eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">{eyebrow}</p>}<h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">{title}</h2></div>{children}</section>
}
