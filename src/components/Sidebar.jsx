import { useRef, useState } from 'react'
import useOutsideClick from '../hooks/useOutsideClick.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import {
  ChartIcon,
  CalendarIcon,
  ChevronDownIcon,
  HashtagIcon,
  HomeIcon,
  InstagramIcon,
  LinkedInIcon,
  UsersIcon,
  TwitterIcon,
  FacebookIcon,
} from './icons.jsx'

export const sections = [
  {
    id: 'general',
    title: null,
    items: [{ id: 'inicio', label: 'Inicio', Icon: HomeIcon }],
  },
  {
    id: 'investigacion',
    title: 'Investigación',
    items: [
      { id: 'temas', label: 'Temas', Icon: HashtagIcon },
    ],
  },
  {
    id: 'crear',
    title: 'Crear',
    items: [
      { id: 'facebook', label: 'Facebook', Icon: FacebookIcon },
      { id: 'twitter', label: 'Twitter', Icon: TwitterIcon },
      { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
      { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
    ],
  },
  {
    id: 'estadisticas',
    title: 'Estadísticas',
    items: [
      { id: 'analiticas', label: 'Analíticas', Icon: ChartIcon },
      { id: 'calendario', label: 'Calendario', Icon: CalendarIcon },
      { id: 'competidores', label: 'Competidores', Icon: UsersIcon },
    ],
  },
]

const userMenu = [
  { id: 'perfil', label: 'Ver perfil' },
  { id: 'ajustes', label: 'Configuración' },
  { id: 'salir', label: 'Cerrar sesión', danger: true },
]

function NavLink({ id, label, Icon, onNavigate }) {
  const { section, setSection } = useDashboard()
  const active = section === id

  return (
    <button
      type="button"
      onClick={() => {
        setSection(id)
        onNavigate?.()
      }}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-700/20 to-red-600/10 text-white font-semibold border border-red-600/20 shadow-[inset_3px_0_0_#b91c1c]'
          : 'w-full flex items-center gap-3 px-3 py-2.5 text-[#94a3b8] hover:text-white hover:bg-white/[.055] rounded-xl transition-all group'
      }
    >
      <span className={active ? 'w-7 h-7 rounded-lg grid place-items-center bg-red-700 text-white shadow-lg shadow-red-950/30' : 'w-7 h-7 rounded-lg grid place-items-center bg-white/[.035] text-[#64748b] group-hover:text-white'}><Icon className="w-3.5 h-3.5" /></span>
      <span>{label}</span>
    </button>
  )
}

function UserMenu({ onAction }) {
  const { account } = useDashboard()
  const [open, setOpen] = useState(false)
  const container = useRef(null)
  useOutsideClick(container, () => setOpen(false), open)

  return (
    <div ref={container} className="relative">
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 py-1 rounded-xl bg-[#16191f] border border-sidebar-border shadow-lg">
          {userMenu.map(({ id, label, danger }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setOpen(false)
                onAction(id)
              }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                danger
                  ? 'text-[#f43f5e] hover:bg-[#281518]'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1d212a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#161920] transition text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full ring-2 ring-red-700/70 overflow-hidden bg-gradient-to-tr from-amber-500 via-rose-500 to-red-700 p-[1.5px]">
            <img
              src={account.avatar}
              alt={`Avatar de ${account.name}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-white text-xs font-semibold tracking-tight">{account.name}</span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-[#64748b] group-hover:text-white transition ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default function Sidebar({ onAccountAction, open, onClose }) {
  return (
    <>
      {/* En pantallas estrechas la barra se superpone; el fondo la cierra. */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/50"
        />
      )}

      <aside
        className={`w-64 bg-[#0b0d14] flex-shrink-0 flex flex-col justify-between border-r border-white/[.06] select-none h-full
          fixed inset-y-0 left-0 z-40 transition-transform lg:fixed lg:translate-x-0 lg:z-20
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
      <div className="flex flex-col flex-1 overflow-y-auto pt-6 px-4">
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2.5"><span className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-700 to-red-600 text-white grid place-items-center font-black shadow-lg shadow-red-950">B</span><div><span className="block text-white text-sm tracking-[0.18em] font-extrabold uppercase">BITAXUS</span><span className="block text-[9px] text-slate-500 tracking-widest mt-0.5">CONTENT OS</span></div></div>
        </div>

        <nav className="space-y-6 text-[13px] font-medium">
          {sections.map((group) => (
            <div key={group.id}>
              {group.title && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-[#475569] uppercase mb-2">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={item.id} {...item} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

        <div className="p-3 border-t border-sidebar-border">
          <UserMenu onAction={onAccountAction} />
        </div>
      </aside>
    </>
  )
}
