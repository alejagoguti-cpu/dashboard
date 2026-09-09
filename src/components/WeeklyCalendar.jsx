import { useMemo } from 'react'
import { freeSlot, postingWindow } from '../data/dashboard.js'
import {
  REFERENCE_TODAY,
  WEEKDAY_LABELS,
  addDays,
  formatDayLabel,
  formatTime,
  isSameDay,
  startOfWeek,
  toDate,
} from '../lib/dates.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons.jsx'

function weekTitle(offset) {
  if (offset === 0) return 'Esta semana'
  if (offset === 1) return 'Próxima semana'
  if (offset === -1) return 'Semana anterior'
  return offset > 0 ? `En ${offset} semanas` : `Hace ${Math.abs(offset)} semanas`
}

export default function WeeklyCalendar({ onSchedule }) {
  const { posts, removePost, weekOffset, setWeekOffset, selectedDay, setSelectedDay } =
    useDashboard()

  const days = useMemo(() => {
    const monday = addDays(startOfWeek(REFERENCE_TODAY), weekOffset * 7)

    return WEEKDAY_LABELS.map((label, index) => {
      const date = addDays(monday, index)
      const dayPosts = posts.filter((post) => isSameDay(toDate(post.at), date))

      return {
        label,
        date,
        key: date.toISOString(),
        count: dayPosts.length,
        isToday: isSameDay(date, REFERENCE_TODAY),
        isPast: date < REFERENCE_TODAY && !isSameDay(date, REFERENCE_TODAY),
      }
    })
  }, [posts, weekOffset])

  const selected = selectedDay ? toDate(selectedDay) : null

  // Sin día seleccionado se muestra toda la cola futura; con día, solo el suyo.
  const visiblePosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(a.at) - new Date(b.at))
    if (!selected) return sorted.filter((post) => toDate(post.at) >= REFERENCE_TODAY)
    return sorted.filter((post) => isSameDay(toDate(post.at), selected))
  }, [posts, selected])

  function toggleDay(date) {
    setSelectedDay((current) =>
      current && isSameDay(toDate(current), date) ? null : date.toISOString(),
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Calendario Semanal</h3>
          <p className="text-xs text-slate-500 mt-0.5">Horarios con mayor respuesta esperada</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset(weekOffset - 1)}
            aria-label="Semana anterior"
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 hover:border-slate-300 transition whitespace-nowrap"
          >
            {weekTitle(weekOffset)}
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(weekOffset + 1)}
            aria-label="Semana siguiente"
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center pt-1">
        {days.map(({ key, label, date, count, isToday, isPast }) => {
          const isSelected = selected && isSameDay(date, selected)

          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(date)}
              aria-pressed={Boolean(isSelected)}
              className={`p-2 rounded-lg border flex flex-col items-center transition ${
                isToday
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : isSelected
                    ? 'bg-white border-slate-400'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300'
              }`}
            >
              <span
                className={`text-[10px] font-medium ${isToday ? 'text-slate-300' : 'text-slate-500'}`}
              >
                {label}
              </span>
              <span
                className={`text-xs font-semibold mt-0.5 ${
                  isToday ? '' : isPast ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                {date.getDate()}
              </span>
              <span
                className={`w-1 h-1 rounded-full mt-1.5 ${
                  isToday ? 'bg-emerald-400' : count > 0 ? 'bg-slate-600' : 'bg-slate-200'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 flex items-center justify-between gap-2">
          <span>{selected ? `Publicaciones · ${formatDayLabel(selected)}` : 'Próximas publicaciones'}</span>
          {selected ? (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-slate-600 font-normal normal-case hover:text-slate-900 transition"
            >
              Ver todas
            </button>
          ) : (
            <span className="text-slate-600 font-normal normal-case">Ventana: {postingWindow}</span>
          )}
        </div>

        {visiblePosts.length === 0 && (
          <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500">No hay publicaciones programadas.</p>
            <button
              type="button"
              onClick={() => onSchedule(selected ? { date: selected } : {})}
              className="mt-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Programar una →
            </button>
          </div>
        )}

        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className="group p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between gap-3 hover:border-slate-200 transition"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">
                  {formatDayLabel(post.at)} · {formatTime(post.at)}
                </span>
                <span className="text-[10px] font-medium bg-slate-200/70 text-slate-700 px-1.5 rounded">
                  {post.format}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{post.title}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                {post.score}% óptimo
              </span>
              <button
                type="button"
                onClick={() => removePost(post.id)}
                aria-label={`Cancelar ${post.title}`}
                className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        <div className="p-2.5 border border-dashed border-slate-200 rounded-lg flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium">
              +
            </div>
            <div>
              <span className="text-xs font-medium text-slate-800">
                {formatDayLabel(freeSlot.at)} · {formatTime(freeSlot.at)} (Espacio libre)
              </span>
              <p className="text-[10px] text-slate-400">{freeSlot.suggestion}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSchedule({ date: freeSlot.at, format: 'Story' })}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  )
}
