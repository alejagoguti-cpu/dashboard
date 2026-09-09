import { platformKpis, platforms } from '../../data/dashboard.js'
import { formatDayLabel, formatTime, REFERENCE_TODAY, toDate } from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { EyeIcon, HeartIcon, LinkIcon, PlusIcon, UserPlusIcon, CloseIcon } from '../icons.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'

const iconsById = { eye: EyeIcon, heart: HeartIcon, userPlus: UserPlusIcon, link: LinkIcon }

/**
 * Estudio reducido para YouTube y LinkedIn: métricas de la plataforma y su
 * propia cola de publicaciones, tomada del mismo estado que el de Instagram.
 */
export default function PlatformStudio({ id, onSchedule }) {
  const { posts, removePost } = useDashboard()
  const platform = platforms[id]
  const kpis = platformKpis[id]

  const queue = posts
    .filter((post) => post.platform === id)
    .sort((a, b) => new Date(a.at) - new Date(b.at))

  const upcoming = queue.filter((post) => toDate(post.at) >= REFERENCE_TODAY)

  return (
    <>
      <SectionHeader
        title={`${platform.label} Studio`}
        subtitle={`${platform.handle} · ${platform.audience}`}
      >
        <button type="button" onClick={() => onSchedule({ platform: id })} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar Publicación
        </button>
      </SectionHeader>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map(({ id: kpiId, label, value, delta, trend, caption, icon }) => {
          const Icon = iconsById[icon]

          return (
            <div key={kpiId} className={`${card} p-4 flex items-center justify-between`}>
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  {label}
                </span>
                <div className="text-xl font-bold text-slate-900 mt-1">{value}</div>
                <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 mt-0.5">
                  {delta && (
                    <span className={trend === 'down' ? 'text-rose-600' : 'text-emerald-600'}>{delta}</span>
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

      <div className={`${card} p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Cola de publicación</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {upcoming.length === 0
                ? 'Nada programado todavía en esta plataforma'
                : `${upcoming.length} pieza${upcoming.length > 1 ? 's' : ''} por salir`}
            </p>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500">
              Las publicaciones que programes para {platform.label} aparecerán aquí.
            </p>
            <button
              type="button"
              onClick={() => onSchedule({ platform: id })}
              className="mt-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Programar la primera →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((post) => (
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
                  <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
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
          </div>
        )}
      </div>
    </>
  )
}
