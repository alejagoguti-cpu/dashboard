import { useMemo, useState } from 'react'
import { newsItems } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import Modal from '../ui/Modal.jsx'
import SectionHeader, { card, chip, ghostButton } from './SectionHeader.jsx'

const relevanceStyles = {
  alta: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  media: 'bg-slate-100 text-slate-600 border-slate-200',
  baja: 'bg-slate-50 text-slate-400 border-slate-200',
}

const filters = ['todas', 'alta', 'media', 'baja']

function ago(minutes) {
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `hace ${hours} h` : `hace ${Math.round(hours / 24)} d`
}

export default function News({ onSchedule }) {
  const { notify } = useDashboard()
  const [query, setQuery] = useState('')
  const [relevance, setRelevance] = useState('todas')
  const [detail, setDetail] = useState(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return newsItems.filter(
      (item) =>
        (relevance === 'todas' || item.relevance === relevance) &&
        (needle === '' ||
          item.title.toLowerCase().includes(needle) ||
          item.source.toLowerCase().includes(needle) ||
          item.topic.toLowerCase().includes(needle)),
    )
  }, [query, relevance])

  return (
    <>
      <SectionHeader title="Noticias" subtitle="Lo que se mueve en tu sector, ordenado por recencia">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título, fuente o tema"
          aria-label="Buscar noticias"
          className="px-3 py-1.5 w-64 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
        />
        <div className="flex items-center gap-1">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRelevance(option)}
              aria-pressed={relevance === option}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition capitalize ${
                relevance === option
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </SectionHeader>

      <p className="text-[11px] text-slate-400">
        {visible.length} de {newsItems.length} noticias
      </p>

      <div className="space-y-2.5">
        {visible.length === 0 && (
          <div className={`${card} p-8 text-center`}>
            <p className="text-xs text-slate-500">Ninguna noticia coincide con la búsqueda.</p>
          </div>
        )}

        {visible.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setDetail(item)}
            className={`${card} w-full text-left p-4 hover:border-slate-300 transition flex items-start justify-between gap-4`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-700">{item.source}</span>
                <span className="text-[11px] text-slate-400">{ago(item.minutes)}</span>
                <span className={chip}>{item.topic}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-900 mt-1.5">{item.title}</h3>
            </div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded border capitalize flex-shrink-0 ${
                relevanceStyles[item.relevance]
              }`}
            >
              {item.relevance}
            </span>
          </button>
        ))}
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={detail ? `${detail.source} · ${ago(detail.minutes)}` : undefined}
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
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              <span className="text-slate-400">Tema: </span>
              {detail.topic}
            </p>
            <p>
              <span className="text-slate-400">Relevancia para tu cuenta: </span>
              <span className="capitalize">{detail.relevance}</span>
            </p>
            <p className="text-slate-500 leading-relaxed">
              Este panel muestra el titular y su clasificación. Conecta tu fuente de noticias en
              n8n para traer también el resumen y el enlace original.
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}
