import { topics } from '../../data/dashboard.js'
import SectionHeader from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'

export default function Topics({ onSchedule }) {
  const columns = [
    { key: 'name', label: 'Tema' },
    {
      key: 'volume',
      label: 'Volumen mensual',
      align: 'right',
      render: (row) => row.volume.toLocaleString('es-ES'),
    },
    {
      key: 'trend',
      label: 'Tendencia',
      align: 'right',
      render: (row) => (
        <span className={row.trend >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
          {row.trend >= 0 ? '+' : ''}
          {row.trend}%
        </span>
      ),
    },
    { key: 'posts', label: 'Piezas publicadas', align: 'right' },
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
            onSchedule({ title: row.name, platform: 'instagram' })
          }}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
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
        subtitle="Volumen y tendencia de los asuntos que sigues. Pulsa una fila para programar contenido."
      />
      <SortableTable
        columns={columns}
        rows={topics}
        initialSort={{ key: 'volume', dir: 'desc' }}
        onRowClick={(row) => onSchedule({ title: row.name, platform: 'instagram' })}
      />
    </>
  )
}
