import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSearch } from './useSearch.js'

describe('useSearch', () => {
  it('does not let an older response overwrite the newest search', async () => {
    const pending = []
    global.fetch = vi.fn(() => new Promise((resolve) => pending.push(resolve)))
    const { result } = renderHook(() => useSearch())
    let first
    let second

    await act(async () => {
      first = result.current.execute('ronaldo', 'players')
      second = result.current.execute('man', 'clubs')
      pending[1]({ ok: true, json: async () => ({ count: 1, results: [{ clubId: 'CLUB_1', club: 'Manchester United' }] }) })
      await second
      pending[0]({ ok: true, json: async () => ({ count: 1, results: [{ playerId: 'P004432', player: 'Cristiano Ronaldo' }] }) })
      await first
    })

    expect(result.current.results).toEqual([{ clubId: 'CLUB_1', club: 'Manchester United' }])
  })
})
