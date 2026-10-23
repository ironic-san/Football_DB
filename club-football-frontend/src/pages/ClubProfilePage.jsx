import { ArrowLeft, Globe2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DetailGrid, RecordTable, SectionCard } from '../components/DataDisplay.jsx'
import { ErrorState } from '../components/ErrorState.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageContainer } from '../components/PageContainer.jsx'
import { ClubSeasonHistory } from '../components/ClubSeasonHistory.jsx'
import { useResource } from '../hooks/useResource.js'
import { getClubDomesticHistory, getClubOverview, getClubUclHistory } from '../services/api.js'

export function ClubProfilePage() {
  const { clubId } = useParams()
  const overview = useResource(getClubOverview, [clubId])
  const domestic = useResource(getClubDomesticHistory, [clubId])
  const ucl = useResource(getClubUclHistory, [clubId])
  if ([overview, domestic, ucl].some((item) => item.status === 'loading')) return <PageContainer><LoadingState label="Loading club profile…" /></PageContainer>
  if (overview.status === 'error') return <PageContainer><ErrorState message={overview.error} /></PageContainer>
  if (domestic.status === 'error') return <PageContainer><ErrorState message={domestic.error} /></PageContainer>
  if (ucl.status === 'error') return <PageContainer><ErrorState message={ucl.error} /></PageContainer>
  const club = overview.data
  return <PageContainer><Link to="/" className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-pitch hover:text-pitch-dark"><ArrowLeft size={16} /> Back to home</Link><section className="surface p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white"><Globe2 size={26} /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-pitch">Club profile</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{club.clubName || 'Unnamed club'}</h1></div></div><div className="mt-8"><DetailGrid data={{ leagues: club.leagues, latestLeagueStanding: club.latestLeagueStanding, latestTrophy: club.latestTrophy, latestUCLParticipation: club.latestUCLParticipation }} /></div></section><SectionCard title="Season history"><ClubSeasonHistory domestic={domestic.data} ucl={ucl.data} clubId={clubId} /></SectionCard><SectionCard title="Domestic history"><RecordTable rows={domestic.data} title="domestic history" /></SectionCard><SectionCard title="UEFA Champions League history"><RecordTable rows={ucl.data} title="UCL history" /></SectionCard></PageContainer>
}
