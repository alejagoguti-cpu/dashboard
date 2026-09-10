import { channelAverageRetention, dateRanges } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import KpiCards from '../KpiCards.jsx'
import SectionHeader, { card } from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'

export default function Analytics() {
  const { range, setRange, reels: topReels } = useDashboard()

  // Con datos reales de Instagram no hay retención: la Graph API no la expone.
  // La columna pasa a ser el visionado medio, que es lo que sí devuelve.
  const live = topReels.some((reel) => reel.source === 'instagram')

  const columns = [
    { key: 'title', label: 'Reel' },
    { key: 'views', label: 'Vistas', align: 'right', sortValue: (r) => parseFloat(r.views) },
    live
      ? {
          key: 'avgWatchSeconds',
          label: 'Visionado medio',
          align: 'right',
          sortValue: (r) => r.avgWatchSeconds ?? 0,
          render: (r) => (r.avgWatchSeconds != null ? `${r.avgWatchSeconds}s` : '—'),
        }
      : { key: 'retention', label: 'Retención', align: 'right', render: (r) => `${r.retention}%` },
    { key: 'likes', label: 'Me gusta', align: 'right' },
    { key: 'comments', label: 'Comentarios', align: 'right' },
    { key: 'saves', label: 'Guardados', align: 'right' },
    live
      ? {
          key: 'reachPct',
          label: 'Alcance / vistas',
          align: 'right',
          sortValue: (r) => r.reachPct ?? 0,
          render: (r) => (r.reachPct != null ? `${r.reachPct}%` : '—'),
        }
      : {
          key: 'diff',
          label: 'vs media',
          align: 'right',
          sortValue: (r) => r.retention - channelAverageRetention,
          render: (row) => {
            const diff = row.retention - channelAverageRetention
            return (
              <span className={diff >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                {diff >= 0 ? '+' : ''}
                {diff} pts
              </span>
            )
          },
        },
  ]

  return (
    <>
      <SectionHeader title="Analíticas" subtitle="Métricas de la cuenta en el rango seleccionado">
        <div className="flex items-center gap-1">
          {dateRanges.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRange(option.id)}
              aria-pressed={range === option.id}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                range === option.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {option.label.replace('Últimos ', '')}
            </button>
          ))}
        </div>
      </SectionHeader>

      <KpiCards />

      <div className={`${card} p-4`}>
        <p className="text-xs text-slate-600">
          {live ? (
            <>
              Datos en vivo de Instagram. La Graph API no expone retención, así que se muestra el
              visionado medio y el alcance sobre reproducciones.
            </>
          ) : (
            <>
              Retención media del canal:{' '}
              <strong className="text-slate-900">{channelAverageRetention}%</strong>. El rango
              seleccionado afecta a las cuatro métricas superiores; la tabla recoge los reels del mes.
            </>
          )}
        </p>
      </div>

      <SortableTable columns={columns} rows={topReels} initialSort={{ key: 'views', dir: 'desc' }} />
    </>
  )
}
