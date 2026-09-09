/** Cabecera común de las secciones que no son el estudio de Instagram. */
export default function SectionHeader({ title, subtitle, children }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2.5 flex-wrap">{children}</div>}
    </header>
  )
}

export const card = 'bg-white rounded-xl border border-slate-200/80 shadow-xs'

export const chip =
  'text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200'

export const primaryButton =
  'flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition'

export const ghostButton =
  'px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition border border-slate-200'
