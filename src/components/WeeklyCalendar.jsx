import { freeSlot, upcomingPosts, week } from '../data/dashboard.js'

const activityDot = {
  today: 'bg-emerald-400',
  high: 'bg-slate-600',
  low: 'bg-slate-300',
  none: 'bg-slate-200',
}

function DayCell({ label, day, activity, isToday }) {
  return (
    <div
      className={`p-2 rounded-lg border flex flex-col items-center ${
        isToday
          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
          : 'bg-slate-50 border-slate-100'
      }`}
    >
      <span className={`text-[10px] font-medium ${isToday ? 'text-slate-300' : 'text-slate-500'}`}>
        {label}
      </span>
      <span className={`text-xs font-semibold mt-0.5 ${isToday ? '' : 'text-slate-800'}`}>
        {day}
      </span>
      <span className={`w-1 h-1 rounded-full mt-1.5 ${activityDot[activity]}`} />
    </div>
  )
}

export default function WeeklyCalendar() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Calendario Semanal</h3>
          <p className="text-xs text-slate-500 mt-0.5">Horarios con mayor respuesta esperada</p>
        </div>
        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Esta semana
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center pt-1">
        {week.map((day) => (
          <DayCell key={day.id} {...day} />
        ))}
      </div>

      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 flex items-center justify-between">
          <span>Próximas publicaciones</span>
          <span className="text-slate-600 font-normal normal-case">Ventana: 19:00 - 21:30</span>
        </div>

        {upcomingPosts.map(({ id, when, format, title, score }) => (
          <div
            key={id}
            className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between gap-3 hover:border-slate-200 transition"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">{when}</span>
                <span className="text-[10px] font-medium bg-slate-200/70 text-slate-700 px-1.5 rounded">
                  {format}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{title}</p>
            </div>
            <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
              {score}
            </span>
          </div>
        ))}

        <div className="p-2.5 border border-dashed border-slate-200 rounded-lg flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium">
              +
            </div>
            <div>
              <span className="text-xs font-medium text-slate-800">{freeSlot.when}</span>
              <p className="text-[10px] text-slate-400">{freeSlot.suggestion}</p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  )
}
