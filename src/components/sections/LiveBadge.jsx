/**
 * Indica de dónde salen los datos de una sección y permite resincronizar.
 * Sin fuente conectada avisa de que lo que se ve son datos de ejemplo, para
 * que nadie los confunda con cifras reales.
 */
export default function LiveBadge({ live, demoLabel, liveLabel }) {
  if (!live || live.status === 'off') {
    return (
      <p className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {demoLabel}
      </p>
    )
  }

  if (live.status === 'loading') {
    return (
      <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Consultando…
      </p>
    )
  }

  const parcial = live.warnings.length > 0
  const roto = live.status === 'error'

  return (
    <button
      type="button"
      onClick={live.reload}
      title={parcial ? `${live.warnings.join(' · ')} — pulsa para reintentar` : 'Pulsa para volver a consultar'}
      className={`inline-flex items-center gap-1.5 text-[11px] rounded px-2 py-1 border transition hover:opacity-80 ${
        roto || parcial
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${roto || parcial ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      {roto ? demoLabel : parcial ? `${liveLabel} · ${live.warnings.join(' · ')}` : liveLabel}
    </button>
  )
}
