import { account } from '../data/dashboard.js'
import { useDashboard } from '../state/DashboardContext.jsx'

/** Pantalla tras cerrar sesión. Volver a entrar restaura el estado guardado. */
export default function LoggedOut() {
  const { setLoggedOut } = useDashboard()

  return (
    <div className="h-full flex items-center justify-center bg-sidebar px-6">
      <div className="text-center max-w-sm">
        <span className="text-white text-base tracking-[0.28em] font-extrabold uppercase">
          B I T A X U S
        </span>
        <p className="text-[#94a3b8] text-xs mt-6">
          Sesión cerrada. Tu feed y tus publicaciones programadas siguen guardados en este
          navegador.
        </p>
        <button
          type="button"
          onClick={() => setLoggedOut(false)}
          className="mt-6 px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
        >
          Entrar como {account.name}
        </button>
      </div>
    </div>
  )
}
