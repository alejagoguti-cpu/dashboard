import { formatStats } from '../../data/dashboard.js'
import SectionHeader, { card } from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'

export default function Formats() {
  const best = [...formatStats].sort((a, b) => b.engagement - a.engagement)[0]

  const columns = [
    { key: 'name', label: 'Formato' },
    { key: 'posts', label: 'Piezas', align: 'right' },
    { key: 'reach', label: 'Alcance', align: 'right', sortValue: (r) => parseFloat(r.reach) },
    {
      key: 'engagement',
      label: 'Engagement',
      align: 'right',
      render: (row) => `${row.engagement}%`,
    },
    {
      key: 'retention',
      label: 'Retención',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-slate-700 h-full rounded-full" style={{ width: `${row.retention}%` }} />
          </div>
          <span>{row.retention}%</span>
        </div>
      ),
    },
    { key: 'best', label: 'Funciona mejor con' },
  ]

  return (
    <>
      <SectionHeader title="Formatos" subtitle="Qué rinde mejor en tu cuenta, por tipo de pieza" />

      <div className={`${card} p-4`}>
        <p className="text-xs text-slate-600">
          El formato con mayor engagement es <strong className="text-slate-900">{best.name}</strong> (
          {best.engagement}%), y donde mejor funciona es en{' '}
          <span className="text-slate-900">{best.best.toLowerCase()}</span>.
        </p>
      </div>

      <SortableTable columns={columns} rows={formatStats} initialSort={{ key: 'engagement', dir: 'desc' }} />
    </>
  )
}
