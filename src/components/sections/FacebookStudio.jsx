import { formatDayLabel, formatTime, REFERENCE_TODAY, toDate } from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { PlusIcon, CloseIcon } from '../icons.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'
import FacebookFeedPlanner from '../FacebookFeedPlanner.jsx'

const stageLabels = {
  ideas: 'Ideas',
  production: 'En producción',
  review: 'En revisión',
  scheduled: 'Programado',
}

export default function FacebookStudio({ onSchedule }) {
  const { posts, removePost, updatePostStage } = useDashboard()

  const queue = posts
    .filter((post) => post.platform === 'facebook')
    .sort((a, b) => new Date(a.at) - new Date(b.at))

  const upcoming = queue.filter((post) => toDate(post.at) >= REFERENCE_TODAY)

  return (
    <>
      <SectionHeader
        title="Facebook Studio"
        subtitle="facebook/bitaxus · 12.5K seguidores"
      >
        <button type="button" onClick={() => onSchedule({ platform: 'facebook' })} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar Publicación
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <FacebookFeedPlanner onSchedule={onSchedule} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={`${card} p-5 space-y-4`}>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Cola de publicaciones</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {upcoming.length === 0
                  ? 'Nada programado todavía en Facebook'
                  : `${upcoming.length} pieza${upcoming.length > 1 ? 's' : ''} por publicar`}
              </p>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center">
                <p className="text-xs text-slate-500">
                  Las publicaciones que programes para Facebook aparecerán aquí.
                </p>
                <button
                  type="button"
                  onClick={() => onSchedule({ platform: 'facebook' })}
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
                      <select
                        value={post.stage || 'scheduled'}
                        onChange={(e) => updatePostStage(post.id, e.target.value)}
                        className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded hover:border-slate-300 transition cursor-pointer"
                      >
                        {Object.entries(stageLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
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
        </div>
      </div>
    </>
  )
}
