import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import {
  initialFeedSlots,
  initialScheduledPosts,
  kpiMeta,
  kpiValues,
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
  const [range, setRange] = useState('30d')
  const [preview, setPreview] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)

  const [savedSlots, setSavedSlots] = useLocalStorage('bitaxus.feed-slots', initialFeedSlots)
  const [posts, setPosts] = useLocalStorage('bitaxus.scheduled-posts', initialScheduledPosts)

  // Orden de trabajo del feed: se confirma en localStorage con "Guardar Orden".
  const [slots, setSlots] = useState(savedSlots)
  const [dirty, setDirty] = useState(false)

  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

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

  const kpis = useMemo(
    () => kpiMeta.map((meta) => ({ ...meta, ...kpiValues[range][meta.id] })),
    [range],
  )

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

  const saveOrder = useCallback(() => {
    setSavedSlots(persistableSlots(slots))
    setDirty(false)
    notify('Orden del feed guardado', 'success')
  }, [slots, setSavedSlots, notify])

  const resetOrder = useCallback(() => {
    setSlots(savedSlots)
    setDirty(false)
    notify('Se restauró el último orden guardado')
  }, [savedSlots, notify])

  const addPost = useCallback(
    (post) => {
      setPosts((current) =>
        [...current, post].sort((a, b) => new Date(a.at) - new Date(b.at)),
      )
      notify('Publicación programada', 'success')
    },
    [setPosts, notify],
  )

  const removePost = useCallback(
    (id) => {
      setPosts((current) => current.filter((post) => post.id !== id))
      // La etiqueta de la cuadrícula depende del programado: al cancelar, desaparece.
      setSlots((current) =>
        current.map((slot) => (slot.scheduleId === id ? { ...slot, scheduleId: null } : slot)),
      )
      notify('Publicación cancelada')
    },
    [setPosts, notify],
  )

  const value = useMemo(
    () => ({
      section,
      setSection,
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
    }),
    [
      section,
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
    ],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
