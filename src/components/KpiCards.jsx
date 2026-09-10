import { useDashboard } from '../state/DashboardContext.jsx'
import { EyeIcon, HeartIcon, LinkIcon, UserPlusIcon } from './icons.jsx'

const iconsById = {
  eye: EyeIcon,
  heart: HeartIcon,
  userPlus: UserPlusIcon,
  link: LinkIcon,
}

export default function KpiCards() {
  const { kpis, instagram } = useDashboard()
  // Con Instagram conectado hay que poder distinguir un KPI real de uno de ejemplo.
  const showOrigin = instagram.status === 'ready'

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {kpis.map(({ id, label, value, delta, trend, caption, icon, live }) => {
        const Icon = iconsById[icon]

        return (
          <div
            key={id}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                {label}
                {showOrigin && !live && (
                  <span
                    title="La Graph API no devolvió esta métrica; se muestra el dato de ejemplo"
                    className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded normal-case"
                  >
                    demo
                  </span>
                )}
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">{value}</div>
              <span
                className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${
                  delta ? 'text-slate-600' : 'text-slate-500'
                }`}
              >
                {delta && (
                  <span className={trend === 'down' ? 'text-rose-600' : 'text-emerald-600'}>
                    {delta}
                  </span>
                )}
                {caption}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        )
      })}
    </section>
  )
}
