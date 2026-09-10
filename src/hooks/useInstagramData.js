import { useCallback, useEffect, useState } from 'react'
import * as n8n from '../lib/n8n.js'

/**
 * Trae del workflow de Instagram el perfil, los KPIs, el feed y los reels
 * reales de la cuenta.
 *
 * Las tres llamadas van en paralelo y cada una falla por su cuenta: si los
 * insights se caen (una métrica retirada, un permiso ausente) el feed sigue
 * mostrándose. Lo que no llegue se queda en `null` y el panel usa su dato de
 * demostración, señalándolo, en vez de inventar una cifra.
 */
export default function useInstagramData(range) {
  const connected = n8n.isConnected()
  const [state, setState] = useState({
    status: connected ? 'loading' : 'off',
    account: null,
    kpis: null,
    slots: null,
    reels: null,
    warnings: [],
  })

  const load = useCallback(async () => {
    if (!connected) return

    setState((current) => ({ ...current, status: 'loading' }))

    const [overview, media, reels] = await Promise.allSettled([
      n8n.callWebhook(n8n.WEBHOOKS.igOverview, { method: 'GET', query: { range } }),
      n8n.callWebhook(n8n.WEBHOOKS.igMedia, { method: 'GET' }),
      n8n.callWebhook(n8n.WEBHOOKS.igReels, { method: 'GET' }),
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
      // El workflow de resumen devuelve los errores parciales de la Graph API.
      if (Array.isArray(value?.errors) && value.errors.length > 0) {
        warnings.push(`${label}: ${value.errors.join(' · ')}`)
      }
      return value
    }

    const o = take(overview, 'Resumen')
    const m = take(media, 'Feed')
    const r = take(reels, 'Reels')

    const slots = m?.slots?.length ? m.slots : null
    const list = r?.reels?.length ? r.reels : null

    setState({
      status: o || slots || list ? 'ready' : 'error',
      account: o?.account ?? null,
      kpis: o?.kpis ?? null,
      slots,
      reels: list,
      warnings,
    })
  }, [connected, range])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load, connected }
}
