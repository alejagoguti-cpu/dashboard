import { useRef, useState } from 'react'
import { account } from '../data/dashboard.js'
import useOutsideClick from '../hooks/useOutsideClick.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import {
  ChartIcon,
  CalendarIcon,
  ChevronDownIcon,
  FormatsIcon,
  HashtagIcon,
  HomeIcon,
  InstagramIcon,
  LinkedInIcon,
  NewsIcon,
  UsersIcon,
  YouTubeIcon,
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
      { id: 'noticias', label: 'Noticias', Icon: NewsIcon },
      { id: 'temas', label: 'Temas', Icon: HashtagIcon },
      { id: 'formatos', label: 'Formatos', Icon: FormatsIcon },
    ],
  },
  {
    id: 'crear',
    title: 'Crear',
    items: [
      { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
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

function NavLink({ id, label, Icon }) {
  const { section, setSection } = useDashboard()
  const active = section === id

  return (
    <button
      type="button"
      onClick={() => setSection(id)}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-[#281518] text-[#f43f5e] font-semibold border border-[#4a1d24] shadow-xs'
          : 'w-full flex items-center gap-3 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-sidebar-hover rounded-lg transition-colors group'
      }
    >
      <Icon className={active ? 'w-4 h-4 text-[#f43f5e]' : 'w-4 h-4 text-[#64748b] group-hover:text-white'} />
      <span>{label}</span>
    </button>
  )
}

function UserMenu({ onAction }) {
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
          <div className="w-8 h-8 rounded-full ring-2 ring-brand-rose/70 overflow-hidden bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
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

export default function Sidebar({ onAccountAction }) {
  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col justify-between border-r border-sidebar-border select-none h-full z-20">
      <div className="flex flex-col flex-1 overflow-y-auto pt-6 px-4">
        <div className="px-3 mb-8">
          <span className="text-white text-base tracking-[0.28em] font-extrabold uppercase">
            B I T A X U S
          </span>
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
                  <NavLink key={item.id} {...item} />
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
  )
}
