import { useState } from 'react'
import { competitors as seed } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import SectionHeader, { primaryButton } from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'
import { PlusIcon, TrashIcon } from '../icons.jsx'

export default function Competitors() {
  const { notify } = useDashboard()
  const [rows, setRows] = useState(seed)
  const [handle, setHandle] = useState('')

  function add(event) {
    event.preventDefault()
    const clean = handle.trim().replace(/^@?/, '@')

    if (clean.length < 2) return notify('Escribe un usuario válido')
    if (rows.some((row) => row.handle.toLowerCase() === clean.toLowerCase())) {
      return notify('Esa cuenta ya está en seguimiento')
    }

    setRows((current) => [
      ...current,
      // Una cuenta recién añadida aún no tiene métricas hasta el primer rastreo.
      { id: `c-${Date.now()}`, handle: clean, followers: '—', growth: 0, engagement: 0, cadence: '—', focus: 'Pendiente de análisis' },
    ])
    setHandle('')
    notify(`${clean} añadida al seguimiento`, 'success')
  }

  function remove(row) {
    setRows((current) => current.filter((item) => item.id !== row.id))
    notify(`${row.handle} eliminada del seguimiento`)
  }

  const columns = [
    { key: 'handle', label: 'Cuenta' },
    { key: 'followers', label: 'Seguidores', align: 'right', sortValue: (r) => parseFloat(r.followers) || 0 },
    {
      key: 'growth',
      label: 'Crecimiento',
      align: 'right',
      render: (row) =>
        row.followers === '—' ? (
          <span className="text-slate-300">—</span>
        ) : (
          <span className={row.growth >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
            {row.growth >= 0 ? '+' : ''}
            {row.growth}%
          </span>
        ),
    },
    {
      key: 'engagement',
      label: 'Engagement',
      align: 'right',
      render: (row) => (row.engagement ? `${row.engagement}%` : <span className="text-slate-300">—</span>),
    },
    { key: 'cadence', label: 'Cadencia', align: 'right' },
    { key: 'focus', label: 'Enfoque' },
    {
      key: 'accion',
      label: '',
      align: 'right',
      sortValue: (r) => r.handle,
      render: (row) => (
        <button
          type="button"
          onClick={() => remove(row)}
          aria-label={`Dejar de seguir ${row.handle}`}
          className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ]

  return (
    <>
      <SectionHeader title="Competidores" subtitle={`${rows.length} cuentas en seguimiento`}>
        <form onSubmit={add} className="flex items-center gap-2">
          <input
            type="text"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@cuenta"
            aria-label="Cuenta a seguir"
            className="px-3 py-1.5 w-40 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
          />
          <button type="submit" className={primaryButton}>
            <PlusIcon className="w-3.5 h-3.5" />
            Seguir
          </button>
        </form>
      </SectionHeader>

      <SortableTable
        columns={columns}
        rows={rows}
        initialSort={{ key: 'followers', dir: 'desc' }}
        empty="No sigues ninguna cuenta todavía."
      />
    </>
  )
}
