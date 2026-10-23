import { Link } from 'react-router-dom'

function seasonSortValue(season) {
  const match = String(season || '').match(/(\d{4})/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function seasonIdForEntry(row) {
  if (row?.seasonId) return String(row.seasonId)
  const match = String(row?.seasonLabel || row?.season || '').match(/^((?:19|20)\d{2})\/\d{2}$/)
  return match ? match[1] : ''
}

function seasonEntries(domestic, ucl) {
  const entries = new Map()
  for (const row of [...(Array.isArray(domestic) ? domestic : []), ...(Array.isArray(ucl) ? ucl : [])]) {
    const label = row?.seasonLabel || row?.season
    if (!label) continue
    const key = String(label)
    const existing = entries.get(key)
    const seasonId = seasonIdForEntry(row)
    if (!existing || (!existing.seasonId && seasonId)) entries.set(key, { label: key, seasonId })
  }
  return [...entries.values()].sort((left, right) => seasonSortValue(left.label) - seasonSortValue(right.label) || left.label.localeCompare(right.label))
}

export function ClubSeasonHistory({ domestic = [], ucl = [], clubId }) {
  const seasons = seasonEntries(domestic, ucl)
  if (!seasons.length) return <div className="surface p-6 text-sm text-slate-500">No season history was returned for this club.</div>
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{seasons.map(({ label, seasonId }) => seasonId ? <Link key={label} state={{ seasonLabel: label }} to={`/clubs/${encodeURIComponent(clubId)}/seasons/${encodeURIComponent(seasonId)}`} className="focus-ring surface group rounded-2xl p-5 text-lg font-bold text-ink transition-colors hover:border-green-300 hover:text-pitch-dark">{label}</Link> : <div key={label} className="surface rounded-2xl p-5 text-lg font-bold text-ink">{label}</div>)}</div>
}
