import { useMemo, useState } from 'react'
import { platforms } from '../../data/dashboard.js'
import {
  REFERENCE_TODAY,
  WEEKDAY_LABELS,
  addDays,
  formatTime,
  isSameDay,
  startOfWeek,
  toDate,
} from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PlusIcon } from '../icons.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'

const platformDot = {
  instagram: 'bg-rose-500',
  youtube: 'bg-red-600',
  linkedin: 'bg-sky-600',
}

export default function CalendarMonth({ onSchedule }) {
  const { posts, removePost } = useDashboard()
  const [offset, setOffset] = useState(0)

  const month = new Date(REFERENCE_TODAY.getFullYear(), REFERENCE_TODAY.getMonth() + offset, 1)

  // La rejilla empieza el lunes de la semana del día 1 y cubre siempre 6 semanas.
  const days = useMemo(() => {
    const first = startOfWeek(month)

    return Array.from({ length: 42 }, (_, index) => {
      const date = addDays(first, index)
      return {
        date,
        key: date.toISOString(),
        inMonth: date.getMonth() === month.getMonth(),
        isToday: isSameDay(date, REFERENCE_TODAY),
        posts: posts
          .filter((post) => isSameDay(toDate(post.at), date))
          .sort((a, b) => new Date(a.at) - new Date(b.at)),
      }
    })
  }, [month, posts])

  const monthLabel = month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const total = days.filter((d) => d.inMonth).reduce((sum, d) => sum + d.posts.length, 0)

  return (
    <>
      <SectionHeader
        title="Calendario"
        subtitle={
          total === 1
            ? `1 publicación programada en ${monthLabel}`
            : `${total} publicaciones programadas en ${monthLabel}`
        }
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset(offset - 1)}
            aria-label="Mes anterior"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setOffset(0)}
            aria-label="Volver al mes actual"
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition first-letter:uppercase min-w-40"
          >
            {monthLabel}
          </button>
          <button
            type="button"
            onClick={() => setOffset(offset + 1)}
            aria-label="Mes siguiente"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <button type="button" onClick={() => onSchedule({})} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar
        </button>
      </SectionHeader>

      <div className={`${card} p-4`}>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-[10px] font-medium text-slate-400 text-center py-1">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(({ key, date, inMonth, isToday, posts: dayPosts }) => (
            <div
              key={key}
              className={`min-h-24 p-1.5 rounded-lg border transition ${
                isToday
                  ? 'border-slate-900 bg-white'
                  : inMonth
                    ? 'border-slate-100 bg-white hover:border-slate-300'
                    : 'border-transparent bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    isToday ? 'text-slate-900' : inMonth ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {date.getDate()}
                </span>
                <button
                  type="button"
                  onClick={() => onSchedule({ date: date.toISOString() })}
                  aria-label={`Programar el ${date.getDate()}`}
                  className="text-slate-300 hover:text-slate-700 transition text-xs leading-none"
                >
                  +
                </button>
              </div>

              <div className="mt-1 space-y-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group/post px-1.5 py-1 rounded bg-slate-100 hover:bg-slate-200/70 transition"
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          platformDot[post.platform] ?? 'bg-slate-400'
                        }`}
                      />
                      <span className="text-[10px] font-medium text-slate-700">
                        {formatTime(post.at)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePost(post.id)}
                        aria-label={`Cancelar ${post.title}`}
                        className="ml-auto text-slate-400 hover:text-rose-600 opacity-0 group-hover/post:opacity-100 transition"
                      >
                        <CloseIcon className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                      {post.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
          {Object.values(platforms).map((platform) => (
            <span key={platform.id} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full ${platformDot[platform.id]}`} />
              {platform.label}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
