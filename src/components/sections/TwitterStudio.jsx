import { useState } from 'react'
import { platformRecentPosts, platforms } from '../../data/dashboard.js'
import { formatDayLabel, formatTime, REFERENCE_TODAY, toDate } from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { LinkIcon, PlusIcon, UserPlusIcon, CloseIcon } from '../icons.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'
import TwitterFeedPlanner from '../TwitterFeedPlanner.jsx'
import Modal from '../ui/Modal.jsx'

const kindLabel = {
  text: 'Hilo',
  image: 'Imagen',
  video: 'Vídeo',
}

const kindChip = 'text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-1.5 rounded flex-shrink-0'

function LivePill({ live }) {
  if (!live || live.status === 'off') return null

  const label = {
    loading: 'Sincronizando…',
    ready: live.warnings.length > 0 ? 'Datos parciales' : 'Datos en vivo',
    error: 'La API no responde',
  }[live.status]

  const tone = {
    loading: 'bg-slate-100 text-slate-500 border-slate-200',
    ready: live.warnings.length > 0
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
  }[live.status]

  return (
    <button
      type="button"
      onClick={live.reload}
      title={
        live.warnings.length > 0
          ? `${live.warnings.join(' · ')} — pulsa para reintentar`
          : 'Pulsa para volver a sincronizar'
      }
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition hover:opacity-80 ${tone}`}
    >
      {label}
    </button>
  )
}

export default function TwitterStudio({ onSchedule }) {
  const { posts, removePost, twitter, setSection } = useDashboard()
  const [detail, setDetail] = useState(null)
  const platform = platforms.twitter

  const live = twitter ?? null

  const audience = live?.account?.audience ?? platform.audience
  const handle = live?.account?.handle ?? platform.handle
  const title = live?.account?.name
    ? `${live.account.name} · ${platform.label}`
    : `${platform.label} Studio`

  const queue = posts
    .filter((post) => post.platform === 'twitter')
    .sort((a, b) => new Date(a.at) - new Date(b.at))

  const upcoming = queue.filter((post) => toDate(post.at) >= REFERENCE_TODAY)
  const recentPosts = live?.posts?.length ? live.posts : platformRecentPosts.twitter
  const showingDemo = !live?.posts?.length

  return (
    <>
      <SectionHeader
        title={title}
        subtitle={`${handle} · ${audience}`}
      >
        <LivePill live={live} />
        <button type="button" onClick={() => onSchedule({ platform: 'twitter' })} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar Hilo
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <TwitterFeedPlanner onSchedule={onSchedule} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={`${card} p-5 space-y-4`}>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Hilos y publicaciones pendientes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {upcoming.length === 0
              ? 'Nada programado todavía en Twitter'
              : `${upcoming.length} pieza${upcoming.length > 1 ? 's' : ''} por publicar`}
          </p>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500">
              Los hilos que programes para Twitter aparecerán aquí.
            </p>
            <button
              type="button"
              onClick={() => onSchedule({ platform: 'twitter' })}
              className="mt-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Programar el primero →
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
        </div>
      </div>

      {recentPosts?.length > 0 && (
        <div className={`${card} p-5 space-y-4`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Hilos y tweets recientes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Engagement, impresiones y análisis de cada publicación
              </p>
            </div>
            {showingDemo && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                demo
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {recentPosts.map((post) => (
              <button
                type="button"
                key={post.id}
                onClick={() => setDetail(post)}
                className="group rounded-lg border border-slate-200 overflow-hidden hover:border-slate-400 hover:shadow-sm transition flex flex-col bg-white text-left"
              >
                {post.image ? (
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-50 border-b border-slate-100 p-4 flex items-center">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                      {post.excerpt || post.title}
                    </p>
                  </div>
                )}

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">{post.title}</h3>

                  <dl
                    className="grid gap-2 mt-auto pt-2 border-t border-slate-100 text-center"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(post.metrics?.length || 1, 3)}, minmax(0, 1fr))`,
                    }}
                  >
                    {(post.metrics ?? []).map(({ label, value }) => (
                      <div key={label}>
                        <dt className="text-[10px] text-slate-400">{label}</dt>
                        <dd className="text-xs font-semibold text-slate-800 tabular-nums">
                          {value ?? '—'}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle="Análisis del hilo y su rendimiento"
        width="max-w-3xl"
        footer={detail && (
          <>
            {detail.permalink && (
              <a
                href={detail.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Ver en Twitter ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setDetail(null)
                onSchedule({ platform: 'twitter', title: detail.title, content: detail.adaptedScript })
              }}
              className={primaryButton}
            >
              Crear hilo similar
            </button>
          </>
        )}
      >
        {detail && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Contenido completo
              </p>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {detail.transcript || detail.content || detail.excerpt || 'Sin contenido'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Hook', detail.hook],
                ['Estructura', detail.structure],
                ['CTA', detail.cta],
                ['Por qué funciona', detail.why],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{value || 'Pendiente de analizar'}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Estrategia para tu marca</p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{detail.adaptedScript || 'Analiza el hilo para generar una adaptación automática.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
