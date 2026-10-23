import { UserRound } from 'lucide-react'

function optional(value) { return value === null || value === undefined || value === '' ? null : value }

export function PlayerHeader({ player }) {
  const details = [optional(player.nationality), optional(player.position)].filter(Boolean)
  return <section className="surface flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-ink text-white"><UserRound size={34} strokeWidth={1.6} /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Player profile</p><h1 className="mt-2 truncate text-3xl font-bold tracking-tight text-ink sm:text-4xl">{player.playerName || 'Unnamed player'}</h1>{details.length > 0 && <p className="mt-2 text-base text-slate-600">{details.join(' · ')}</p>}{optional(player.dateOfBirth) && <p className="mt-1 text-sm text-slate-500">Born {player.dateOfBirth}</p>}</div></section>
}
