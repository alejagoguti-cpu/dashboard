import { useState } from 'react'
import { account, dateRanges, platforms } from '../data/dashboard.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'

const field =
  'w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition'

/** Diálogos que abre el menú de la cuenta: perfil, configuración y salida. */
export default function AccountModals({ open, onClose }) {
  const { range, setRange, posts, slots, notify, setLoggedOut } = useDashboard()
  const [defaultRange, setDefaultRange] = useState(range)
  const [defaultPlatform, setDefaultPlatform] = useState('instagram')

  return (
    <>
      <Modal
        open={open === 'perfil'}
        onClose={onClose}
        title={account.name}
        subtitle={`${account.handle} · ${account.followers} seguidores`}
      >
        <div className="flex gap-4">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-200"
          />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs flex-1">
            {[
              ['Publicaciones', account.posts],
              ['Piezas en el feed', slots.length],
              ['En cola', posts.length],
              ['Plataformas', Object.keys(platforms).length],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-slate-400">{label}</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <a
          href={account.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-xs font-medium text-slate-700 hover:text-slate-900 transition"
        >
          Abrir perfil en Instagram →
        </a>
      </Modal>

      <Modal
        open={open === 'ajustes'}
        onClose={onClose}
        title="Configuración"
        subtitle="Preferencias de este espacio de trabajo"
        footer={
          <button
            type="button"
            onClick={() => {
              // El rango por defecto se aplica de inmediato a los KPIs.
              setRange(defaultRange)
              notify('Preferencias guardadas', 'success')
              onClose()
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Guardar preferencias
          </button>
        }
      >
        <div className="space-y-3.5">
          <div>
            <label htmlFor="pref-range" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Rango de métricas por defecto
            </label>
            <select
              id="pref-range"
              value={defaultRange}
              onChange={(event) => setDefaultRange(event.target.value)}
              className={field}
            >
              {dateRanges.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pref-platform" className="block text-[11px] font-medium text-slate-500 mb-1.5">
              Plataforma preseleccionada al programar
            </label>
            <select
              id="pref-platform"
              value={defaultPlatform}
              onChange={(event) => setDefaultPlatform(event.target.value)}
              className={field}
            >
              {Object.values(platforms).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={open === 'salir'}
        onClose={onClose}
        title="Cerrar sesión"
        subtitle="Se cerrará la sesión en este navegador"
        footer={
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose()
                setLoggedOut(true)
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          El orden del feed y las publicaciones programadas seguirán guardados en este navegador
          cuando vuelvas a entrar.
        </p>
      </Modal>
    </>
  )
}
