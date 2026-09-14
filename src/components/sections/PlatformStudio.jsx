import { useState } from 'react'
import { platformKpis, platformRecentPosts, platforms } from '../../data/dashboard.js'
import { formatDayLabel, formatTime, REFERENCE_TODAY, toDate } from '../../lib/dates.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { EyeIcon, HeartIcon, LinkIcon, PlusIcon, UserPlusIcon, CloseIcon } from '../icons.jsx'
import PlatformNews from './PlatformNews.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'
import Modal from '../ui/Modal.jsx'

const iconsById = { eye: EyeIcon, heart: HeartIcon, userPlus: UserPlusIcon, link: LinkIcon }

const kindLabel = {
  image: 'Imagen',
  carousel: 'Carrusel',
  video: 'Vídeo',
  article: 'Artículo',
  text: 'Texto',
  short: 'Short',
}

const kindChip =
  'text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-1.5 rounded flex-shrink-0'

/**
 * Estudio reducido para YouTube y LinkedIn: métricas de la plataforma y su
 * propia cola de publicaciones, tomada del mismo estado que el de Instagram.
 */
/** Estado de sincronización de la plataforma, si tiene fuente en vivo. */
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

export default function PlatformStudio({ id, onSchedule }) {
  const { posts, removePost, linkedin, youtube, setSection } = useDashboard()
  const [detail, setDetail] = useState(null)
  const platform = platforms[id]

  const live = { linkedin, youtube }[id] ?? null

  /**
   * Un KPI real sustituye al de ejemplo solo si trae valor; si la API no lo
   * devolvió, se conserva la cifra de demostración y se marca como tal.
   */
  const kpis = platformKpis[id].map((kpi) => {
    const value = live?.kpis?.[kpi.id]
    if (!value?.value) return { ...kpi, live: false }
    return {
      ...kpi,
      // La API puede medir algo distinto de lo que suponía el dato de ejemplo,
      // así que también puede renombrar el KPI.
      label: value.label ?? kpi.label,
      value: value.value,
      caption: value.caption ?? kpi.caption,
      delta: null,
      live: true,
    }
  })

  const showOrigin = live?.status === 'ready'
  const audience = live?.account?.audience ?? platform.audience
  const handle = live?.account?.handle ?? platform.handle
  // Con datos en vivo el título lleva el nombre real de la página.
  const title = live?.account?.name
    ? `${live.account.name} · ${platform.label}`
    : `${platform.label} Studio`

  const queue = posts
    .filter((post) => post.platform === id)
    .sort((a, b) => new Date(a.at) - new Date(b.at))

  const upcoming = queue.filter((post) => toDate(post.at) >= REFERENCE_TODAY)
  const recentPosts = live?.posts?.length ? live.posts : platformRecentPosts[id]
  const showingDemo = !live?.posts?.length

  return (
    <>
      <SectionHeader
        title={title}
        subtitle={`${handle} · ${audience}`}
      >
        <LivePill live={live} />
        <button type="button" onClick={() => onSchedule({ platform: id })} className={primaryButton}>
          <PlusIcon className="w-3.5 h-3.5" />
          Programar Publicación
        </button>
      </SectionHeader>

      {id === 'youtube' && (
        <PlatformNews platform={id} label={platform.label} onOpenAll={() => setSection('noticias')} />
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map(({ id: kpiId, label, value, delta, trend, caption, icon, live: isLive }) => {
          const Icon = iconsById[icon]

          return (
            <div key={kpiId} className={`${card} p-4 flex items-center justify-between`}>
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  {label}
                  {showOrigin && !isLive && (
                    <span
                      title="La API no devolvió esta métrica; se muestra el dato de ejemplo"
                      className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded normal-case"
                    >
                      demo
                    </span>
                  )}
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

      {id !== 'youtube' && (
        <PlatformNews platform={id} label={platform.label} onOpenAll={() => setSection('noticias')} />
      )}

      {recentPosts?.length > 0 && (
        <div className={`${card} p-5 space-y-4`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Publicaciones recientes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {id === 'youtube'
                  ? 'Miniaturas, métricas y análisis de cada video'
                  : 'Contenido, formato y rendimiento de cada publicación'}
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
                    {post.duration && (
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium tabular-nums">
                        {post.duration}
                      </span>
                    )}
                  </div>
                ) : (
                  // Muchas publicaciones de LinkedIn son solo texto: en vez de un
                  // hueco roto, la propia entradilla hace de portada.
                  <div className="aspect-video bg-slate-50 border-b border-slate-100 p-4 flex items-center">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                      {post.excerpt || post.title}
                    </p>
                  </div>
                )}

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">{post.title}</h3>
                    <span className={kindChip}>{kindLabel[post.kind] ?? 'Publicación'}</span>
                  </div>

                  {id === 'linkedin' && (
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {post.excerpt || post.content || post.title}
                    </p>
                  )}

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
        subtitle={id === 'youtube' ? 'Análisis del video y su transcripción' : 'Contenido y análisis de la publicación'}
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
                Ver original ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setDetail(null)
                onSchedule({ platform: id, title: detail.title, content: detail.adaptedScript })
              }}
              className={primaryButton}
            >
              Adaptar y programar
            </button>
          </>
        )}
      >
        {detail && (
          <div className="space-y-4">
            <div className={`grid gap-4 ${detail.image ? 'sm:grid-cols-[180px_1fr]' : ''}`}>
              {detail.image && (
                <img src={detail.image} alt={detail.title} className="w-full aspect-video sm:aspect-[4/3] object-cover rounded-lg bg-slate-900" />
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  {id === 'youtube' ? 'Transcripción' : 'Publicación completa'}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {detail.transcript || detail.content || detail.excerpt || 'La fuente todavía no entregó el texto de esta pieza.'}
                </p>
              </div>
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

            <div className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">Guion adaptado para tu marca</p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{detail.adaptedScript || 'Conecta el workflow de análisis para generar una adaptación automática.'}</p>
            </div>
          </div>
        )}
      </Modal>

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
