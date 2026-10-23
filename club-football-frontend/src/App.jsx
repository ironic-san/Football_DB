import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { PlayerProfilePage } from './pages/PlayerProfilePage.jsx'
import { PlayerRecordsPage } from './pages/PlayerRecordsPage.jsx'
import { PlayerSeasonPage } from './pages/PlayerSeasonPage.jsx'
import { ClubProfilePage } from './pages/ClubProfilePage.jsx'
import { ClubSeasonPage } from './pages/ClubSeasonPage.jsx'
import { DomesticRecordsPage } from './pages/DomesticRecordsPage.jsx'
import { LeagueProfilePage } from './pages/LeagueProfilePage.jsx'
import { LeagueSeasonPage } from './pages/LeagueSeasonPage.jsx'
import { PlaceholderPage } from './pages/PlaceholderPage.jsx'
import { UclPage } from './pages/UclPage.jsx'
import { UclRecordsPage } from './pages/UclRecordsPage.jsx'
import { UclSeasonPage } from './pages/UclSeasonPage.jsx'
import { EntityResolutionPage } from './pages/EntityResolutionPage.jsx'

function routePage(title, description, paramNames = []) {
  return <PlaceholderPage title={title} description={description} paramNames={paramNames} />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resolve/:entityType" element={<EntityResolutionPage />} />
        <Route path="/players" element={routePage('Players', 'Browse player profiles and career histories when this section is connected to the database.')} />
        <Route path="/players/:playerId" element={<PlayerProfilePage />} />
        <Route path="/players/:playerId/seasons/:seasonId" element={<PlayerSeasonPage />} />
        <Route path="/players/:playerId/records" element={<PlayerRecordsPage />} />
        <Route path="/clubs" element={routePage('Clubs', 'Explore club identities, histories, and related competitions in a later stage.')} />
        <Route path="/clubs/:clubId" element={<ClubProfilePage />} />
        <Route path="/clubs/:clubId/seasons/:seasonId" element={<ClubSeasonPage />} />
        <Route path="/leagues" element={routePage('Leagues', 'Browse domestic leagues and their recorded seasons in a later stage.')} />
        <Route path="/leagues/:leagueId" element={<LeagueProfilePage />} />
        <Route path="/leagues/:leagueId/seasons/:seasonId" element={<LeagueSeasonPage />} />
        <Route path="/leagues/:leagueId/records" element={<DomesticRecordsPage />} />
        <Route path="/competitions/ucl" element={<UclPage />} />
        <Route path="/competitions/ucl/seasons/:seasonId" element={<UclSeasonPage />} />
        <Route path="/competitions/ucl/records" element={<UclRecordsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
