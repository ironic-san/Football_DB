import { useCallback, useEffect, useRef, useState } from 'react'
import { searchEntities } from '../services/api.js'

export function useSearch(initialCategory = 'players', initialTerm = '') {
  const [category, setCategory] = useState(initialCategory)
  const [term, setTerm] = useState(initialTerm)
  const [state, setState] = useState({ status: 'idle', results: [], count: 0, error: '' })
  const requestId = useRef(0)
  const controller = useRef(null)
  const lastRequest = useRef('')

  const execute = useCallback(async (nextTerm = term, nextCategory = category, options = {}) => {
    const normalizedTerm = nextTerm.trim()
    if (!normalizedTerm) {
      setState({ status: 'idle', results: [], count: 0, error: 'Enter a name to search.' })
      return false
    }
    const key = `${nextCategory}:${normalizedTerm.toLowerCase()}`
    if (!options.force && key === lastRequest.current && state.status === 'success') return true

    controller.current?.abort()
    const id = ++requestId.current
    controller.current = new AbortController()
    lastRequest.current = key
    setState((current) => ({ ...current, status: 'loading', error: '' }))

    try {
      const payload = await searchEntities(nextCategory, normalizedTerm, controller.current.signal)
      if (id !== requestId.current) return false
      setState({ status: 'success', results: payload.results, count: payload.count ?? payload.results.length, error: '' })
      return true
    } catch (error) {
      if (error.name === 'AbortError' || id !== requestId.current) return false
      setState({ status: 'error', results: [], count: 0, error: error.message || 'Search failed. Please try again.' })
      return false
    }
  }, [category, state.status, term])

  const clear = useCallback(() => {
    controller.current?.abort()
    requestId.current += 1
    lastRequest.current = ''
    setState({ status: 'idle', results: [], count: 0, error: '' })
  }, [])

  useEffect(() => () => controller.current?.abort(), [])

  return { category, setCategory, term, setTerm, ...state, execute, clear }
}
