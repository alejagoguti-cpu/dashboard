import { account } from '../data/dashboard.js'
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

const sections = [
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
      { id: 'instagram', label: 'Instagram', Icon: InstagramIcon, active: true },
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

function NavLink({ label, Icon, active }) {
  if (active) {
    return (
      <a
        href="#"
        aria-current="page"
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#281518] text-[#f43f5e] font-semibold border border-[#4a1d24] shadow-xs"
      >
        <Icon className="w-4 h-4 text-[#f43f5e]" />
        <span>{label}</span>
      </a>
    )
  }

  return (
    <a
      href="#"
      className="flex items-center gap-3 px-3 py-2 text-[#94a3b8] hover:text-white rounded-lg transition-colors group"
    >
      <Icon className="w-4 h-4 text-[#64748b] group-hover:text-white" />
      <span>{label}</span>
    </a>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col justify-between border-r border-sidebar-border select-none h-full z-20">
      <div className="flex flex-col flex-1 overflow-y-auto pt-6 px-4">
        <div className="px-3 mb-8">
          <span className="text-white text-base tracking-[0.28em] font-extrabold uppercase">
            B I T A X U S
          </span>
        </div>

        <nav className="space-y-6 text-[13px] font-medium">
          <div>
            <NavLink label="Inicio" Icon={HomeIcon} />
          </div>

          {sections.map((section) => (
            <div key={section.id}>
              <p className="px-3 text-[10px] font-bold tracking-wider text-[#475569] uppercase mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink key={item.id} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <button
          type="button"
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
          <ChevronDownIcon className="w-4 h-4 text-[#64748b] group-hover:text-white transition" />
        </button>
      </div>
    </aside>
  )
}
