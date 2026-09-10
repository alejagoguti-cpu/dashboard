import { useMemo, useState } from 'react'
import { newsItems } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import Modal from '../ui/Modal.jsx'
import SectionHeader, { card, chip, ghostButton } from './SectionHeader.jsx'

/**
 * La relevancia se codifica dos veces a propósito: color para barrer la lista
 * de un vistazo y texto para quien no distinga los colores.
 */
const relevance = {
  alta: { stripe: 'bg-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Alta relevancia' },
  media: { stripe: 'bg-slate-400', dot: 'bg-slate-400', text: 'text-slate-600', label: 'Relevancia media' },
  baja: { stripe: 'bg-slate-200', dot: 'bg-slate-300', text: 'text-slate-500', label: 'Relevancia baja' },
}

const scopes = { co: 'Colombia', intl: 'Internacional' }

/**
 * Identidad visual de cada medio sin usar sus logos: iniciales sobre un color
 * derivado del propio nombre, así que es estable y no hay que mantener nada.
 */
function sourceMark(source) {
  const hue = [...source].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return { initials, background: `oklch(0.92 0.05 ${hue})`, color: `oklch(0.42 0.12 ${hue})` }
}

function SourceMark({ source, size = 'w-7 h-7 text-[10px]' }) {
  const { initials, background, color } = sourceMark(source)
  return (
    <span
      aria-hidden="true"
      style={{ background, color }}
      className={`${size} rounded-md flex items-center justify-center font-bold tracking-tight flex-shrink-0`}
    >
      {initials}
    </span>
  )
}

function ago(minutes) {
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `hace ${hours} h` : `hace ${Math.round(hours / 24)} d`
}

function FilterGroup({ options, value, onChange, counts }) {
  return (
    <div className="flex items-center gap-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
            value === option.id
              ? 'bg-slate-900 text-white border-slate-900'
              : 'text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          {option.label}
          {counts?.[option.id] != null && (
            <span className={value === option.id ? 'ml-1 text-slate-400' : 'ml-1 text-slate-400'}>
              {counts[option.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default function News({ onSchedule }) {
  const { notify } = useDashboard()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('todas')
  const [scope, setScope] = useState('todos')
  const [detail, setDetail] = useState(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return newsItems.filter(
      (item) =>
        (level === 'todas' || item.relevance === level) &&
        (scope === 'todos' || item.scope === scope) &&
        (needle === '' ||
          item.title.toLowerCase().includes(needle) ||
          item.source.toLowerCase().includes(needle) ||
          item.topic.toLowerCase().includes(needle)),
    )
  }, [query, level, scope])

  const counts = useMemo(() => {
    const tally = (key) =>
      newsItems.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] ?? 0) + 1 }), {})
    return { ...tally('relevance'), ...tally('scope') }
  }, [])

  // Las piezas con portada encabezan; el resto va en una lista compacta.
  const featured = visible.filter((item) => item.cover).slice(0, 3)
  const rest = visible.filter((item) => !featured.includes(item))

  const filtering = query || level !== 'todas' || scope !== 'todos'

  return (
    <>
      <SectionHeader
        title="Noticias"
        subtitle={
          filtering
            ? `${visible.length} de ${newsItems.length} titulares`
            : 'Prensa colombiana e internacional, ordenada por recencia'
        }
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título, medio o tema"
          aria-label="Buscar noticias"
          className="px-3 py-1.5 w-full sm:w-56 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
        />
        <FilterGroup
          options={[
            { id: 'todos', label: 'Todo' },
            { id: 'co', label: 'Colombia' },
            { id: 'intl', label: 'Internacional' },
          ]}
          value={scope}
          onChange={setScope}
          counts={counts}
        />
        <FilterGroup
          options={[
            { id: 'todas', label: 'Todas' },
            { id: 'alta', label: 'Alta' },
            { id: 'media', label: 'Media' },
            { id: 'baja', label: 'Baja' },
          ]}
          value={level}
          onChange={setLevel}
          counts={counts}
        />
      </SectionHeader>

      {/* Los titulares son inventados: conviene que nadie los tome por reales. */}
      <p className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Titulares de ejemplo. Conecta tu fuente en n8n para ver noticias reales.
      </p>

      {visible.length === 0 && (
        <div className={`${card} p-10 text-center`}>
          <p className="text-xs text-slate-500">Ninguna noticia coincide con la búsqueda.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setLevel('todas')
              setScope('todos')
            }}
            className="mt-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Quitar los filtros
          </button>
        </div>
      )}

      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {featured.map((item) => {
            const tone = relevance[item.relevance]

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetail(item)}
                className={`${card} group text-left overflow-hidden hover:border-slate-300 transition flex flex-col`}
              >
                <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                  <img
                    src={item.cover}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                    {scopes[item.scope]}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <SourceMark source={item.source} />
                    <span className="text-[11px] font-semibold text-slate-700">{item.source}</span>
                    <span className="text-[11px] text-slate-400">{ago(item.minutes)}</span>
                    <span className={`${chip} ml-auto`}>{item.topic}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3 text-balance">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  )}

                  <span className={`mt-auto pt-1 inline-flex items-center gap-1.5 text-[11px] ${tone.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                    {tone.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className={`${card} divide-y divide-slate-100 overflow-hidden`}>
          {rest.map((item) => {
            const tone = relevance[item.relevance]

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetail(item)}
                className="group relative w-full text-left flex items-center gap-3 px-4 py-3 pl-5 hover:bg-slate-50/70 transition"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${tone.stripe}`} aria-hidden="true" />
                <SourceMark source={item.source} />

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-medium text-slate-900 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">{item.source}</span>
                    <span>·</span>
                    <span>{ago(item.minutes)}</span>
                    <span>·</span>
                    <span>{scopes[item.scope]}</span>
                  </div>
                </div>

                <span className={`${chip} hidden sm:inline-block flex-shrink-0`}>{item.topic}</span>
                <span className={`text-[11px] ${tone.text} flex-shrink-0 hidden lg:inline`}>
                  {tone.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={detail ? `${detail.source} · ${ago(detail.minutes)}` : undefined}
        width="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                notify('Noticia guardada en tus temas', 'success')
                setDetail(null)
              }}
              className={ghostButton}
            >
              Guardar tema
            </button>
            <button
              type="button"
              onClick={() => {
                const title = detail.title
                setDetail(null)
                onSchedule({ title, platform: 'instagram' })
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
            >
              Crear publicación
            </button>
          </>
        }
      >
        {detail && (
          <div className="space-y-3.5">
            {detail.cover && (
              <img
                src={detail.cover}
                alt=""
                className="w-full aspect-[16/9] object-cover rounded-lg bg-slate-900"
              />
            )}

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <SourceMark source={detail.source} size="w-6 h-6 text-[9px]" />
              <span className="font-medium text-slate-700">{detail.source}</span>
              <span className={chip}>{scopes[detail.scope]}</span>
              <span className={chip}>{detail.topic}</span>
              <span className={`inline-flex items-center gap-1.5 ${relevance[detail.relevance].text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${relevance[detail.relevance].dot}`} />
                {relevance[detail.relevance].label}
              </span>
            </div>

            {detail.summary && (
              <p className="text-xs text-slate-600 leading-relaxed">{detail.summary}</p>
            )}

            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2.5 py-2">
              Titular de ejemplo, no una noticia publicada. Con una fuente conectada en n8n
              aparecerán aquí el resumen y el enlace originales.
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}
