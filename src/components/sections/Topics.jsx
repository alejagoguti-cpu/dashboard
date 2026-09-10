import { topics as demoTopics } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import LiveBadge from './LiveBadge.jsx'
import SectionHeader, { card } from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'

const platformLabels = { instagram: 'Instagram', youtube: 'YouTube', linkedin: 'LinkedIn' }

export default function Topics({ onSchedule }) {
  const { topics: feed, slots, posts } = useDashboard()

  const live = feed.status === 'ready' && feed.posts
  const rows = live ? feed.posts : demoTopics

  /**
   * Cuántas piezas propias tocan cada tema. Sale del estado del panel, no de
   * la API: es lo tuyo, no lo que publica la prensa.
   */
  const mine = (topic) => {
    const needle = topic.name.toLowerCase()
    const texts = [...slots.map((s) => s.title ?? ''), ...posts.map((p) => p.title ?? '')]
    return texts.filter((t) => t.toLowerCase().includes(needle.split(' ')[0])).length
  }

  const columns = [
    {
      key: 'name',
      label: 'Tema',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-900">{row.name}</span>
          {row.sample && (
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {row.sample.source}: {row.sample.title}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'volume',
      label: live ? 'Noticias' : 'Volumen mensual',
      align: 'right',
      render: (row) => (live ? row.volume : row.volume.toLocaleString('es-ES')),
    },
    {
      key: 'trend',
      label: 'Tendencia',
      align: 'right',
      sortValue: (row) => row.trend ?? -Infinity,
      render: (row) =>
        // Sin periodo anterior con el que comparar no hay tendencia que dar.
        row.trend == null ? (
          <span className="text-slate-300" title="Sin periodo anterior con el que comparar">
            —
          </span>
        ) : (
          <span className={row.trend >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
            {row.trend >= 0 ? '+' : ''}
            {row.trend}%
          </span>
        ),
    },
    {
      key: 'platforms',
      label: 'Plataformas',
      sortValue: (row) => (row.platforms ?? []).join(','),
      render: (row) =>
        row.platforms?.length ? (
          <div className="flex items-center gap-1 flex-wrap">
            {row.platforms.map((id) => (
              <span
                key={id}
                className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-1.5 rounded"
              >
                {platformLabels[id] ?? id}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
    {
      key: 'posts',
      label: 'Piezas tuyas',
      align: 'right',
      sortValue: (row) => (live ? mine(row) : row.posts),
      render: (row) => (live ? mine(row) : row.posts),
    },
    {
      key: 'accion',
      label: 'Acción',
      align: 'right',
      sortValue: (row) => row.name,
      render: (row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSchedule({ title: row.sample?.title ?? row.name, platform: 'instagram' })
          }}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap transition"
        >
          Programar →
        </button>
      ),
    },
  ]

  return (
    <>
      <SectionHeader
        title="Temas"
        subtitle={
          live
            ? `De qué habla la prensa en las últimas ${feed.meta?.hours ?? 24} horas`
            : 'Volumen y tendencia de los asuntos que sigues'
        }
      />

      <LiveBadge
        live={feed}
        demoLabel="Datos de ejemplo. Conecta el workflow de temas en n8n para medir tus feeds."
        liveLabel="Medido sobre tus feeds RSS"
      />

      {live && (
        <div className={`${card} p-4`}>
          <p className="text-xs text-slate-600">
            El volumen es <strong className="text-slate-900">cuántas noticias tocan el tema</strong> en
            la ventana, no búsquedas en Google. La tendencia lo compara con la ventana anterior.
          </p>
        </div>
      )}

      <SortableTable
        columns={columns}
        rows={rows}
        initialSort={{ key: 'volume', dir: 'desc' }}
        onRowClick={(row) => onSchedule({ title: row.sample?.title ?? row.name, platform: 'instagram' })}
        empty="Ningún tema apareció en la ventana medida."
      />
    </>
  )
}
