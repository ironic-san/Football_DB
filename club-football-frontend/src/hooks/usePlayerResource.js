import { useEffect, useState } from 'react'

export function usePlayerResource(loader, values) {
  const [state, setState] = useState({ status: 'loading', data: null, error: '' })
  const key = values.join('|')

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setState({ status: 'loading', data: null, error: '' })

    if (values.some((value) => !value || !String(value).trim())) {
      setState({ status: 'error', data: null, error: 'This route is missing a valid player or season identifier.' })
      return () => controller.abort()
    }

    loader(...values, controller.signal)
      .then((data) => { if (active) setState({ status: 'success', data, error: '' }) })
      .catch((error) => { if (active && error.name !== 'AbortError') setState({ status: 'error', data: null, error: error.message || 'The player data could not be loaded.' }) })

    return () => { active = false; controller.abort() }
  }, [loader, key])

  return state
}
