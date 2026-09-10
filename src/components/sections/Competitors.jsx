import { useEffect, useState } from 'react'
import { competitors as seed } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import LiveBadge from './LiveBadge.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'
import SortableTable from './SortableTable.jsx'
import { InstagramIcon, LinkedInIcon, PlusIcon, TrashIcon, YouTubeIcon } from '../icons.jsx'

const platformIcon = { instagram: InstagramIcon, youtube: YouTubeIcon, linkedin: LinkedInIcon }

export default function Competitors() {
  const { notify, competitors: feed } = useDashboard()
  const live = feed.status === 'ready' && feed.posts

  const [rows, setRows] = useState(seed)
  const [handle, setHandle] = useState('')

  // Las cuentas reales mandan en cuanto llegan; las de ejemplo son el respaldo.
  useEffect(() => {
    if (live) setRows(feed.posts)
  }, [live, feed.posts])

  function add(event) {
    event.preventDefault()
    const clean = handle.trim().replace(/^@?/, '@')

    if (clean.length < 2) return notify('Escribe un usuario válido')
    if (rows.some((row) => row.handle.toLowerCase() === clean.toLowerCase())) {
      return notify('Esa cuenta ya está en seguimiento')
    }

    setRows((current) => [
      ...current,
      { id: `c-${Date.now()}`, handle: clean, platform: 'instagram', followers: null,
        engagement: null, cadence: null, focus: 'Pendiente de análisis', local: true },
    ])
    setHandle('')
    notify(
      live
        ? `${clean} añadida. Añádela también a CUENTAS en el workflow para que se consulte.`
        : `${clean} añadida al seguimiento`,
      'success',
    )
  }

  function remove(row) {
    setRows((current) => current.filter((item) => item.id !== row.id))
    notify(`${row.handle} eliminada del seguimiento`)
  }

  const dash = <span className="text-slate-300">—</span>

  const columns = [
    {
      key: 'handle',
      label: 'Cuenta',
      render: (row) => {
        const Icon = platformIcon[row.platform] ?? InstagramIcon
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div>
              <span className="font-medium text-slate-900">{row.handle}</span>
              {row.name && <p className="text-[11px] text-slate-400">{row.name}</p>}
            </div>
          </div>
        )
      },
    },
    {
      key: 'followers',
      label: 'Audiencia',
      align: 'right',
      sortValue: (row) => row.followersRaw ?? parseFloat(row.followers) ?? 0,
      render: (row) => row.followers ?? dash,
    },
    {
      key: 'posts',
      label: 'Publicaciones',
      align: 'right',
      sortValue: (row) => parseFloat(String(row.posts).replace(/\./g, '')) || 0,
      render: (row) => row.posts ?? dash,
    },
    ...(live
      ? [
          {
            key: 'engagement',
            // Con datos reales no hay alcance ajeno: el ratio va sobre seguidores.
            label: 'Interacción / seguidor',
            align: 'right',
            sortValue: (row) => row.engagement ?? -1,
            render: (row) => (row.engagement != null ? `${row.engagement}%` : dash),
          },
          {
            key: 'viewsPerVideo',
            label: 'Vistas por vídeo',
            align: 'right',
            sortValue: (row) => parseFloat(row.viewsPerVideo) || 0,
            render: (row) => row.viewsPerVideo ?? dash,
          },
        ]
      : [
          {
            key: 'growth',
            label: 'Crecimiento',
            align: 'right',
            render: (row) =>
              row.followers === '—' ? dash : (
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
            render: (row) => (row.engagement ? `${row.engagement}%` : dash),
          },
        ]),
    { key: 'cadence', label: 'Cadencia', align: 'right', render: (row) => row.cadence ?? dash },
    { key: 'focus', label: 'Enfoque' },
    {
      key: 'accion',
      label: '',
      align: 'right',
      sortable: false,
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

      <LiveBadge
        live={feed}
        demoLabel="Datos de ejemplo. Conecta el workflow de competidores en n8n para consultar cuentas reales."
        liveLabel="Datos públicos de Instagram y YouTube"
      />

      {live && (
        <div className={`${card} p-4`}>
          <p className="text-xs text-slate-600">
            Solo se ve lo público. Instagram lo sirve por <em>Business Discovery</em>, que exige que
            la otra cuenta sea Business o Creator, y sin alcance ajeno la interacción se calcula{' '}
            <strong className="text-slate-900">sobre seguidores</strong>, no sobre impresiones: no
            coincidirá con la cifra de su propio panel.
          </p>
        </div>
      )}

      <SortableTable
        columns={columns}
        rows={rows}
        initialSort={{ key: 'followers', dir: 'desc' }}
        empty="No sigues ninguna cuenta todavía."
      />
    </>
  )
}
