import { platforms } from '../../data/dashboard.js'
import { REFERENCE_TODAY, formatDayLabel, formatTime, toDate } from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import KpiCards from '../KpiCards.jsx'
import { InstagramIcon, LinkedInIcon, PlusIcon, YouTubeIcon } from '../icons.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'
import TelegramInbox from './TelegramInbox.jsx'

const platformIcons = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
}

export default function Home({ onSchedule }) {
  const { posts, setSection, slots, reels: topReels } = useDashboard()

  const upcoming = posts
    .filter((post) => toDate(post.at) >= REFERENCE_TODAY)
    .sort((a, b) => new Date(a.at) - new Date(b.at))
    .slice(0, 4)

  // Con datos reales no hay retención; se ordena por reproducciones.
  const score = (reel) => reel.retention ?? parseFloat(reel.views) ?? 0
  const bestReel = [...topReels].sort((a, b) => score(b) - score(a))[0]

  return (
    <>
      <SectionHeader title="Inicio" subtitle="Resumen de tu actividad y accesos a los estudios">
        <button type="button" onClick={() => onSchedule({})} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar Publicación
        </button>
      </SectionHeader>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <TelegramInbox onSchedule={onSchedule} />

          <div className={`${card} p-5 space-y-4`}>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Próximas publicaciones</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {upcoming.length === 0 ? 'No hay nada en cola' : 'En todas las plataformas'}
              </p>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center">
                <button
                  type="button"
                  onClick={() => onSchedule({})}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Programar la primera →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcoming.map((post) => {
                  const Icon = platformIcons[post.platform] ?? InstagramIcon

                  return (
                    <div
                      key={post.id}
                      className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-900">
                            {formatDayLabel(post.at)} · {formatTime(post.at)}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{post.title}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                        {post.format}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={`${card} p-5 space-y-3`}>
            <h2 className="text-sm font-semibold text-slate-900">Estudios</h2>
            {Object.values(platforms).map((platform) => {
              const Icon = platformIcons[platform.id]
              const queued = posts.filter((p) => p.platform === platform.id).length

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSection(platform.id)}
                  className="w-full p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between gap-3 hover:border-slate-300 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900">{platform.label}</span>
                      <p className="text-[11px] text-slate-500">{platform.audience}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {queued} en cola
                  </span>
                </button>
              )
            })}
          </div>

          <div className={`${card} p-5 space-y-3`}>
            <h2 className="text-sm font-semibold text-slate-900">Mejor pieza del mes</h2>
            <div className="flex items-center gap-3">
              <img
                src={bestReel.image}
                alt={bestReel.title}
                className="w-12 h-14 rounded object-cover bg-slate-900 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-900 line-clamp-2">{bestReel.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {bestReel.views} vistas
                  {bestReel.retention != null && ` · ${bestReel.retention}% retención`}
                  {bestReel.avgWatchSeconds != null && ` · ${bestReel.avgWatchSeconds}s de media`}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              {slots.length} piezas en el feed de Instagram
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
