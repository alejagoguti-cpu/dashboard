import { useCallback, useEffect, useState } from 'react'
import * as n8n from '../lib/n8n.js'

/**
 * Trae del workflow de LinkedIn la página, sus KPIs y las publicaciones
 * recientes con métricas.
 *
 * A diferencia de Instagram, LinkedIn no expone analíticas de perfiles
 * personales: solo de páginas de empresa, y a través de la Community Management
 * API, sujeta a aprobación en su Partner Program. Sin esos permisos las
 * llamadas fallan y el estudio se queda con los datos de ejemplo, señalados.
 */
export default function useLinkedInData(range) {
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

    const [overview, posts] = await Promise.allSettled([
      n8n.callWebhook(n8n.WEBHOOKS.liOverview, { method: 'GET', query: { range } }),
      n8n.callWebhook(n8n.WEBHOOKS.liPosts, { method: 'GET' }),
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
      if (Array.isArray(value?.errors) && value.errors.length > 0) {
        warnings.push(`${label}: ${value.errors.join(' · ')}`)
      }
      return value
    }

    const o = take(overview, 'Resumen')
    const p = take(posts, 'Publicaciones')
    const list = p?.posts?.length ? p.posts : null

    setState({
      status: o || list ? 'ready' : 'error',
      account: o?.account ?? null,
      kpis: o?.kpis ?? null,
      posts: list,
      warnings,
    })
  }, [connected, range])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load, connected }
}
