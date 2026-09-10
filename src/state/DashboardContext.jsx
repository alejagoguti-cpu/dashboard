import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useInstagramData from '../hooks/useInstagramData.js'
import usePlatformData from '../hooks/usePlatformData.js'
import useLocalStorage from '../hooks/useLocalStorage.js'
import * as n8n from '../lib/n8n.js'
import {
  account as demoAccount,
  initialFeedSlots,
  initialScheduledPosts,
  kpiMeta,
  kpiValues,
  topReels as demoReels,
} from '../data/dashboard.js'

const DashboardContext = createContext(null)

export function useDashboard() {
  const value = useContext(DashboardContext)
  if (!value) throw new Error('useDashboard debe usarse dentro de <DashboardProvider>')
  return value
}

/**
 * Las imágenes subidas en la sesión son object URLs: no sobreviven a una recarga,
 * así que se excluyen de lo que se guarda en localStorage.
 */
function persistableSlots(slots) {
  return slots.filter((slot) => !slot.local)
}

export function DashboardProvider({ children }) {
  const [section, setSection] = useState('instagram')
  const [loggedOut, setLoggedOut] = useState(false)
  const [range, setRange] = useState('30d')
  const [preview, setPreview] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)

  // Datos reales de la cuenta de Instagram, cuando hay workflow que los sirva.
  const instagram = useInstagramData(range)
  const linkedin = usePlatformData({
    overview: n8n.WEBHOOKS.liOverview,
    items: n8n.WEBHOOKS.liPosts,
    range,
  })
  const youtube = usePlatformData({
    overview: n8n.WEBHOOKS.ytOverview,
    items: n8n.WEBHOOKS.ytVideos,
    range,
  })
  const news = usePlatformData({ items: n8n.WEBHOOKS.news, itemsLabel: 'Feeds' })
  const topics = usePlatformData({ items: n8n.WEBHOOKS.topics, itemsLabel: 'Temas' })
  const competitors = usePlatformData({ items: n8n.WEBHOOKS.competitors, itemsLabel: 'Cuentas' })

  const [savedSlots, setSavedSlots] = useLocalStorage('bitaxus.feed-slots', initialFeedSlots)
  const [posts, setPosts] = useLocalStorage('bitaxus.scheduled-posts', initialScheduledPosts)

  // Orden de trabajo del feed: se confirma en localStorage con "Guardar Orden".
  const [slots, setSlots] = useState(savedSlots)
  const [dirty, setDirty] = useState(false)


  // El feed real de Instagram sustituye al de ejemplo en cuanto llega, salvo que
  // haya reordenaciones sin guardar que se perderían.
  const [liveApplied, setLiveApplied] = useState(false)
  useEffect(() => {
    if (!instagram.slots || liveApplied || dirty) return
    setSlots(instagram.slots)
    setLiveApplied(true)
  }, [instagram.slots, liveApplied, dirty])

  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  // Operaciones de n8n en vuelo, para deshabilitar los botones que las disparan.
  const [busy, setBusy] = useState(null)
  const connected = n8n.isConnected()

  const notify = useCallback((message, tone = 'default') => {
    const id = ++toastId.current
    setToasts((current) => [...current, { id, message, tone }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  /**
   * Un KPI real sustituye al de demostración solo si trae valor. Si la Graph API
   * no devolvió esa métrica, se conserva la cifra de ejemplo y se marca como tal
   * en vez de mostrar un hueco o, peor, un número inventado como si fuera real.
   */
  const kpis = useMemo(
    () =>
      kpiMeta.map((meta) => {
        const demo = { ...meta, ...kpiValues[range][meta.id] }
        const live = instagram.kpis?.[meta.id]

        if (!live?.value) return { ...demo, live: false }

        return {
          ...meta,
          value: live.value,
          caption: live.caption ?? demo.caption,
          // La Graph API no da comparativa con el periodo anterior en la misma
          // llamada, así que no se arrastra el delta del dato de ejemplo.
          delta: null,
          live: true,
        }
      }),
    [range, instagram.kpis],
  )

  const account = useMemo(() => {
    const live = instagram.account
    if (!live) return demoAccount

    return {
      ...demoAccount,
      name: live.name ?? demoAccount.name,
      handle: live.handle ?? demoAccount.handle,
      followers: live.followers ?? demoAccount.followers,
      posts: live.posts ?? demoAccount.posts,
      avatar: live.avatar ?? demoAccount.avatar,
    }
  }, [instagram.account])

  const reels = instagram.reels ?? demoReels

  const moveSlot = useCallback((fromId, toId) => {
    if (fromId === toId) return

    setSlots((current) => {
      const from = current.findIndex((slot) => slot.id === fromId)
      const to = current.findIndex((slot) => slot.id === toId)
      if (from === -1 || to === -1) return current

      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setDirty(true)
  }, [])

  const addSlot = useCallback((slot) => {
    setSlots((current) => [...current, slot])
    setDirty(true)
  }, [])

  const removeSlot = useCallback((id) => {
    setSlots((current) => {
      const target = current.find((slot) => slot.id === id)
      if (target?.local) URL.revokeObjectURL(target.image)
      return current.filter((slot) => slot.id !== id)
    })
    setDirty(true)
  }, [])

  const saveOrder = useCallback(async () => {
    const order = persistableSlots(slots)

    if (connected) {
      setBusy('saveOrder')
      try {
        await n8n.callWebhook(n8n.WEBHOOKS.saveFeedOrder, {
          body: { order: order.map(({ id, title, scheduleId }) => ({ id, title, scheduleId })) },
        })
      } catch (error) {
        notify(error.message, 'error')
        return false
      } finally {
        setBusy(null)
      }
    }

    setSavedSlots(order)
    setDirty(false)
    notify(connected ? 'Orden guardado y enviado a n8n' : 'Orden del feed guardado', 'success')
    return true
  }, [slots, setSavedSlots, notify, connected])

  const resetOrder = useCallback(() => {
    setSlots(savedSlots)
    setDirty(false)
    notify('Se restauró el último orden guardado')
  }, [savedSlots, notify])

  const addPost = useCallback(
    async (post) => {
      let scheduled = post

      if (connected) {
        setBusy('addPost')
        try {
          const result = await n8n.callWebhook(n8n.WEBHOOKS.schedulePost, { body: post })
          // El workflow puede devolver su propio identificador de ejecución.
          scheduled = { ...post, executionId: result?.executionId ?? null }
        } catch (error) {
          notify(error.message, 'error')
          return false
        } finally {
          setBusy(null)
        }
      }

      setPosts((current) =>
        [...current, scheduled].sort((a, b) => new Date(a.at) - new Date(b.at)),
      )
      notify(connected ? 'Publicación programada en n8n' : 'Publicación programada', 'success')
      return true
    },
    [setPosts, notify, connected],
  )

  const removePost = useCallback(
    async (id) => {
      if (connected) {
        setBusy(`cancel-${id}`)
        try {
          await n8n.callWebhook(n8n.WEBHOOKS.cancelPost, { body: { id } })
        } catch (error) {
          notify(error.message, 'error')
          return false
        } finally {
          setBusy(null)
        }
      }

      setPosts((current) => current.filter((post) => post.id !== id))
      // La etiqueta de la cuadrícula depende del programado: al cancelar, desaparece.
      setSlots((current) =>
        current.map((slot) => (slot.scheduleId === id ? { ...slot, scheduleId: null } : slot)),
      )
      notify('Publicación cancelada')
      return true
    },
    [setPosts, notify, connected],
  )

  const value = useMemo(
    () => ({
      section,
      setSection,
      loggedOut,
      setLoggedOut,
      range,
      setRange,
      kpis,
      preview,
      setPreview,
      weekOffset,
      setWeekOffset,
      selectedDay,
      setSelectedDay,
      slots,
      moveSlot,
      addSlot,
      removeSlot,
      dirty,
      saveOrder,
      resetOrder,
      posts,
      addPost,
      removePost,
      toasts,
      notify,
      dismissToast,
      connected,
      busy,
      account,
      reels,
      instagram,
      linkedin,
      youtube,
      news,
      topics,
      competitors,
    }),
    [
      section,
      loggedOut,
      range,
      kpis,
      preview,
      weekOffset,
      selectedDay,
      slots,
      moveSlot,
      addSlot,
      removeSlot,
      dirty,
      saveOrder,
      resetOrder,
      posts,
      addPost,
      removePost,
      toasts,
      notify,
      dismissToast,
      connected,
      busy,
      account,
      reels,
      instagram,
      linkedin,
      youtube,
      news,
      topics,
      competitors,
    ],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
