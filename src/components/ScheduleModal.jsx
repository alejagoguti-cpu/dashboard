import { useEffect, useState } from 'react'
import { platforms, postFormats } from '../data/dashboard.js'
import { REFERENCE_TODAY, addDays, fromDateTimeInput, formatTime, toDate, toDateInput } from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'

const field =
  'w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition'

/**
 * `draft` es el prefill con el que se abrió el diálogo: puede traer título
 * (desde una pieza del feed), fecha (desde el calendario) y formato.
 */
export default function ScheduleModal({ draft, onClose }) {
  const { addPost, busy } = useDashboard()
  const open = Boolean(draft)
  const sending = busy === 'addPost'

  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [format, setFormat] = useState(postFormats.instagram[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [error, setError] = useState('')

  // Cada apertura reinicia el formulario con los valores del prefill.
  useEffect(() => {
    if (!draft) return

    const initial = draft.date ? toDate(draft.date) : addDays(REFERENCE_TODAY, 1)
    const target = draft.platform ?? 'instagram'

    setTitle(draft.title ?? '')
    setPlatform(target)
    setFormat(draft.format ?? postFormats[target][0])
    setDate(toDateInput(initial))
    setTime(draft.date ? formatTime(initial) : '19:00')
    setError('')
  }, [draft])

  async function submit(event) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Escribe un título para la publicación.')
      return
    }

    const at = fromDateTimeInput(date, time)

    if (Number.isNaN(at.getTime())) {
      setError('Revisa la fecha y la hora.')
      return
    }

    const ok = await addPost({
      id: `post-${Date.now()}`,
      at: `${date}T${time}`,
      platform,
      format,
      title: title.trim(),
      // Las franjas de 19:00 a 21:30 rinden mejor según los datos del panel.
      score: at.getHours() >= 19 && at.getHours() <= 21 ? 92 : 74,
    })

    // Si n8n rechaza la petición el diálogo sigue abierto con los datos escritos.
    if (ok) onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Programar publicación"
      subtitle="La franja de 19:00 a 21:30 concentra la mayor respuesta"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="schedule-form"
            disabled={sending}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition disabled:opacity-60"
          >
            {sending ? 'Programando…' : 'Programar'}
          </button>
        </>
      }
    >
      <form id="schedule-form" onSubmit={submit} className="space-y-3.5">
        <div>
          <label htmlFor="schedule-title" className="block text-[11px] font-medium text-slate-500 mb-1.5">
            Título
          </label>
          <input
            id="schedule-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. 3 errores al escalar tu oferta"
            className={field}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="schedule-platform" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Plataforma
            </label>
            <select
              id="schedule-platform"
              value={platform}
              onChange={(event) => {
                const next = event.target.value
                setPlatform(next)
                // Cada plataforma tiene sus formatos: el elegido puede no existir allí.
                setFormat(postFormats[next][0])
              }}
              className={field}
            >
              {Object.values(platforms).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="schedule-format" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Formato
            </label>
            <select
              id="schedule-format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className={field}
            >
              {postFormats[platform].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="schedule-date" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Fecha
            </label>
            <input
              id="schedule-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="schedule-time" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Hora
            </label>
            <input
              id="schedule-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={field}
            />
          </div>
        </div>

        {error && <p className="text-[11px] text-rose-600">{error}</p>}
      </form>
    </Modal>
  )
}
