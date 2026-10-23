import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlayerClubs } from './PlayerClubs.jsx'
import { CareerHistory, StatCards } from './PlayerStats.jsx'
import { RecordTable } from './DataDisplay.jsx'

describe('player data presentation', () => {
  it('renders Q15 clubs with navigable identifiers', () => {
    render(<MemoryRouter><PlayerClubs domesticClubs={[{ clubId: 'CLUB_0127', club: 'Example Club', leagues: ['L001'], seasons: ['2011'] }]} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Example Club' })).toHaveAttribute('href', '/clubs/CLUB_0127')
    expect(screen.getByText(/Seasons:.*2011/)).toBeInTheDocument()
  })

  it('keeps Q16 domestic and UCL histories in separate sections', () => {
    render(<MemoryRouter><CareerHistory playerId="P004432" domesticHistory={[{ seasonId: '2011', leagueId: 'L001', appearances: 10, goals: 5, assists: 2, minutes: 900 }]} uclHistory={[{ seasonId: '2011', season: '2011/12', appearances: 6, goals: 3, assists: 1, minutes: 500 }]} /></MemoryRouter>)
    expect(screen.getByText('Domestic history')).toBeInTheDocument()
    expect(screen.getByText('UEFA Champions League history')).toBeInTheDocument()
    expect(screen.getAllByText('2011/12').length).toBe(2)
  })

  it('formats every numeric season identifier as a readable clickable season', () => {
    render(<MemoryRouter><CareerHistory playerId="P004432" domesticHistory={[{ seasonId: '2003', appearances: 29, goals: 4, assists: 4, minutes: 1555 }]} uclHistory={[]} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: '2003/04' })).toHaveAttribute('href', '/players/P004432/seasons/2003')
  })

  it('preserves zero-valued returned statistics', () => {
    render(<StatCards title="Domestic statistics" stats={{ appearances: 0, goals: 0, assists: 0 }} />)
    expect(screen.getAllByText('0').length).toBe(3)
  })

  it('uses search fallback navigation when a record has a name but no identifier', () => {
    render(<MemoryRouter><RecordTable rows={[{ player: 'Unnamed-ID Player' }]} title="goalscorers" /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Unnamed-ID Player' })).toHaveAttribute('href', '/resolve/players?name=Unnamed-ID%20Player')
  })
})
