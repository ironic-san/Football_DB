import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchBar } from './SearchBar.jsx'
import { SearchResults } from './SearchResults.jsx'

describe('search UI', () => {
  it('submits the selected category and entered term', () => {
    const submit = vi.fn()
    render(<SearchBar category="players" term="ronaldo" onCategoryChange={vi.fn()} onTermChange={vi.fn()} onSubmit={submit} onClear={vi.fn()} />)
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }).closest('form'))
    expect(submit).toHaveBeenCalledOnce()
  })

  it('shows empty and error states with retry', () => {
    const retry = vi.fn()
    const { rerender } = render(<SearchResults category="clubs" status="success" results={[]} count={0} error="" onRetry={retry} />)
    expect(screen.getByText('No clubs found')).toBeInTheDocument()
    rerender(<SearchResults category="clubs" status="error" results={[]} count={0} error="Backend unavailable" onRetry={retry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Backend unavailable')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('renders real identifiers as navigable links', () => {
    render(<MemoryRouter><SearchResults category="players" status="success" results={[{ playerId: 'P004432', player: 'Cristiano Ronaldo', nationality: 'Portugal' }]} count={1} error="" onRetry={vi.fn()} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /Cristiano Ronaldo/i })).toHaveAttribute('href', '/players/P004432')
    expect(screen.getByText('Portugal')).toBeInTheDocument()
  })
})
