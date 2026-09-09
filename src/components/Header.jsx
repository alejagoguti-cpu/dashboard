import { useRef, useState } from 'react'
import { account, dateRanges } from '../data/dashboard.js'
import useOutsideClick from '../hooks/useOutsideClick.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import { CalendarIcon, CheckIcon, ChevronDownIcon, PlusIcon } from './icons.jsx'

function RangePicker() {
  const { range, setRange } = useDashboard()
  const [open, setOpen] = useState(false)
  const container = useRef(null)
  useOutsideClick(container, () => setOpen(false), open)

  const current = dateRanges.find((option) => option.id === range)

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
        <span>{current.label}</span>
        <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-44 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30"
        >
          {dateRanges.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.id === range}
              onClick={() => {
                setRange(option.id)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition"
            >
              {option.label}
              {option.id === range && <CheckIcon className="w-3.5 h-3.5 text-slate-900" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header({ onSchedule }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Instagram Studio &amp; Feed Planner
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {account.handle}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Planificación visual de feed, simulación estética y programación de publicaciones y reels.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <RangePicker />

        <button
          type="button"
          onClick={() => onSchedule()}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Programar Publicación</span>
        </button>
      </div>
    </header>
  )
}
