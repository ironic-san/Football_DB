import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ClubSeasonHistory } from './ClubSeasonHistory.jsx'

describe('club season history', () => {
  it('renders unique season labels without performance details', () => {
    render(<MemoryRouter><ClubSeasonHistory clubId="CLUB_0128" domestic={[{ season: '2000/01', position: 1, points: 80 }, { season: '2001/02', position: 3, points: 77 }]} ucl={[{ season: '2000/01', stages: ['Group Stage'] }]} /></MemoryRouter>)
    expect(screen.getByText('2000/01')).toBeInTheDocument()
    expect(screen.getByText('2001/02')).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()
    expect(screen.queryByText('Group Stage')).not.toBeInTheDocument()
  })

  it('links a season to Q7 using the existing season-key convention', () => {
    render(<MemoryRouter><ClubSeasonHistory clubId="CLUB_0128" domestic={[{ season: '2011/12' }]} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: '2011/12' })).toHaveAttribute('href', '/clubs/CLUB_0128/seasons/2011')
  })
})
