import { useDashboard } from '../../state/DashboardContext.jsx'
import { CloseIcon } from '../icons.jsx'

export default function Toasts() {
  const { toasts, dismissToast } = useDashboard()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-72 pointer-events-none"
    >
      {toasts.map(({ id, message, tone }) => (
        <div
          key={id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900 text-white shadow-lg"
        >
          <span className="flex items-center gap-2 text-xs font-medium">
            {tone === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            {message}
          </span>
          <button
            type="button"
            onClick={() => dismissToast(id)}
            aria-label="Cerrar aviso"
            className="text-slate-400 hover:text-white transition"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
