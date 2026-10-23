import { Link } from 'react-router-dom'

function clubKey(club) { return club.clubId || `${club.club || 'club'}-${(club.seasons || club.uclSeasons || []).join('-')}` }

export function PlayerClubs({ domesticClubs = [], uclClubs = [] }) {
  const clubs = [...domesticClubs.map((club) => ({ ...club, source: 'Domestic' })), ...uclClubs.map((club) => ({ ...club, source: 'UEFA Champions League' }))]
  if (!clubs.length) return <div className="surface p-6 text-sm text-slate-500">No club history was returned for this player.</div>
  return <div className="grid gap-3 sm:grid-cols-2">{clubs.map((club, index) => <div key={`${clubKey(club)}-${index}`} className="surface min-w-0 p-5"><div className="flex items-start justify-between gap-3"><div>{club.clubId ? <Link to={`/clubs/${encodeURIComponent(club.clubId)}`} className="focus-ring rounded font-semibold text-ink hover:text-pitch-dark">{club.club || 'Unnamed club'}</Link> : <span className="font-semibold text-ink">{club.club || 'Unnamed club'}</span>}<p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{club.source}</p></div></div>{club.seasons?.length > 0 && <p className="mt-4 text-sm text-slate-500">Seasons: {club.seasons.join(', ')}</p>}{club.uclSeasons?.length > 0 && <p className="mt-4 text-sm text-slate-500">UCL seasons: {club.uclSeasons.join(', ')}</p>}</div>)}</div>
}
