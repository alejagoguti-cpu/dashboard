import { account } from '../data/dashboard.js'
import { CalendarIcon, ChevronDownIcon, PlusIcon } from './icons.jsx'

export default function Header() {
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
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Últimos 30 días</span>
          <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Programar Publicación</span>
        </button>
      </div>
    </header>
  )
}
