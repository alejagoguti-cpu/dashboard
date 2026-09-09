import { useDashboard } from '../state/DashboardContext.jsx'
import { EyeIcon, HeartIcon, LinkIcon, UserPlusIcon } from './icons.jsx'

const iconsById = {
  eye: EyeIcon,
  heart: HeartIcon,
  userPlus: UserPlusIcon,
  link: LinkIcon,
}

export default function KpiCards() {
  const { kpis } = useDashboard()

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {kpis.map(({ id, label, value, delta, trend, caption, icon }) => {
        const Icon = iconsById[icon]

        return (
          <div
            key={id}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                {label}
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
