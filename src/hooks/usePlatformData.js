import { useCallback, useEffect, useState } from 'react'
import * as n8n from '../lib/n8n.js'

/**
 * Trae de n8n los datos reales de una plataforma: su cuenta y KPIs por un lado,
 * sus publicaciones por otro.
 *
 * Las dos llamadas van en paralelo y fallan por separado: si las estadísticas
 * se caen, las publicaciones siguen mostrándose. Lo que no llegue se queda en
 * `null` y el estudio usa su dato de ejemplo, señalándolo, en vez de inventar
 * una cifra.
 */
export default function usePlatformData({ overview, items, range }) {
  const connected = n8n.isConnected()
  const [state, setState] = useState({
    status: connected ? 'loading' : 'off',
    account: null,
    kpis: null,
    posts: null,
    warnings: [],
  })

  const load = useCallback(async () => {
    if (!connected) return

    setState((current) => ({ ...current, status: 'loading' }))

    const [a, b] = await Promise.allSettled([
      n8n.callWebhook(overview, { method: 'GET', query: range ? { range } : undefined }),
      n8n.callWebhook(items, { method: 'GET' }),
    ])

    const warnings = []
    const take = (result, label) => {
      if (result.status === 'rejected') {
        warnings.push(`${label}: ${result.reason.message}`)
        return null
      }
      const value = result.value
      if (value?.error) {
        warnings.push(`${label}: ${value.error}`)
        return null
      }
      // El workflow devuelve en `errors` los fallos parciales de la API.
      if (Array.isArray(value?.errors) && value.errors.length > 0) {
        warnings.push(`${label}: ${value.errors.join(' · ')}`)
      }
      return value
    }

    const o = take(a, 'Resumen')
    const p = take(b, 'Publicaciones')
    const list = p?.posts?.length ? p.posts : null

    setState({
      status: o || list ? 'ready' : 'error',
      account: o?.account ?? null,
      kpis: o?.kpis ?? null,
      posts: list,
      warnings,
    })
  }, [connected, overview, items, range])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load, connected }
}
