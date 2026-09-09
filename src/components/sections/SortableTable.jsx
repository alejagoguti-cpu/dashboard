import { useMemo, useState } from 'react'
import { card } from './SectionHeader.jsx'

/**
 * Tabla ordenable. Cada columna declara `key`, `label`, opcionalmente `align`,
 * `render` y `sortValue` (para ordenar por algo distinto de lo que se muestra).
 */
export default function SortableTable({ columns, rows, initialSort, onRowClick, empty }) {
  const [sort, setSort] = useState(initialSort ?? { key: columns[0].key, dir: 'asc' })

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return rows

    const value = (row) => (column.sortValue ? column.sortValue(row) : row[column.key])

    return [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)]
      const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'es')
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort, columns])

  function toggle(key) {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' },
    )
  }

  if (rows.length === 0) {
    return (
      <div className={`${card} p-8 text-center`}>
        <p className="text-xs text-slate-500">{empty ?? 'No hay datos que mostrar.'}</p>
      </div>
    )
  }

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100 bg-slate-50/60">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`font-medium px-4 py-2.5 ${column.align === 'right' ? 'text-right' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(column.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-700 transition"
                  >
                    {column.label}
                    <span className={sort.key === column.key ? 'text-slate-700' : 'text-slate-300'}>
                      {sort.key === column.key && sort.dir === 'asc' ? '↑' : '↓'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-slate-50 last:border-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/70 transition' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-slate-700 ${column.align === 'right' ? 'text-right' : ''}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
