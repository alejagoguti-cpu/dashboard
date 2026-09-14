/** Cabecera común de las secciones que no son el estudio de Instagram. */
export default function SectionHeader({ title, subtitle, children }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-6">
      <div>
        <p className="text-[10px] uppercase tracking-[.18em] text-violet-500 font-bold mb-1.5">Bitaxus workspace</p>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-[-.025em]">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2.5 flex-wrap">{children}</div>}
    </header>
  )
}

export const card = 'bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,.03),0_8px_24px_rgba(15,23,42,.035)]'

export const chip =
  'text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200'

export const primaryButton =
  'premium-button flex items-center gap-2 bg-slate-950 hover:bg-violet-700 text-white'

export const ghostButton =
  'px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition border border-slate-200'
