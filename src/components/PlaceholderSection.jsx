import { useDashboard } from '../state/DashboardContext.jsx'
import { sections } from './Sidebar.jsx'

const allItems = sections.flatMap((group) => group.items)

/**
 * El diseño solo define la pantalla de Instagram; el resto de secciones de la
 * navegación existen y son accesibles, pero aún no tienen contenido.
 */
export default function PlaceholderSection({ id }) {
  const { setSection } = useDashboard()
  const item = allItems.find((entry) => entry.id === id)
  const Icon = item?.Icon

  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 mb-4">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h2 className="text-base font-semibold text-slate-900">{item?.label}</h2>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
        Esta sección todavía no tiene pantalla diseñada. El módulo de Instagram es el que está
        implementado.
      </p>
      <button
        type="button"
        onClick={() => setSection('instagram')}
        className="mt-5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition"
      >
        Ir a Instagram Studio
      </button>
    </div>
  )
}
