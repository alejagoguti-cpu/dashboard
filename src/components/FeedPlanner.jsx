import { account, feedSlots } from '../data/dashboard.js'
import { CarouselIcon, PlusIcon, ReelIcon } from './icons.jsx'

const formatIcons = {
  reel: ReelIcon,
  carousel: CarouselIcon,
}

function FeedCell({ slot }) {
  const FormatIcon = slot.format ? formatIcons[slot.format] : null

  return (
    <div className="grid-cell group relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-200 cursor-grab">
      <img
        src={slot.image}
        alt={slot.alt}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />

      {slot.schedule && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[10px] font-medium text-white tracking-wide flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              slot.schedule.tone === 'next' ? 'bg-emerald-400' : 'bg-slate-300'
            }`}
          />
          {slot.schedule.label}
        </div>
      )}

      {FormatIcon && (
        <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-xs rounded text-white">
          <FormatIcon className="w-3 h-3" />
        </div>
      )}

      <div className="grid-overlay opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2 p-3 text-center">
        <span className="text-xs font-medium line-clamp-2 leading-tight">{slot.title}</span>
        {slot.stats && (
          <div className="flex items-center gap-3 text-xs text-slate-300">
            {slot.stats.map((stat) => (
              <span key={stat}>{stat}</span>
            ))}
          </div>
        )}
        {slot.note && <span className="text-[11px] text-slate-300">{slot.note}</span>}
      </div>
    </div>
  )
}

function UploadCell() {
  return (
    <button
      type="button"
      className="group relative aspect-square rounded-lg border border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50 transition flex flex-col items-center justify-center p-3 text-center cursor-pointer"
    >
      <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600">
        <PlusIcon className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium text-slate-700 mt-2">Subir Publicación</span>
      <span className="text-[10px] text-slate-400">o arrastrar archivo</span>
    </button>
  )
}

export default function FeedPlanner() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Feed Planner</h2>
          <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
            3×3 Cuadrícula
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition border border-slate-200"
          >
            Previsualizar
          </button>
          <button
            type="button"
            className="px-2.5 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Guardar Orden
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-medium text-slate-800">{account.handle}</span>
            <span className="text-[11px] text-slate-400 ml-1.5">
              {account.posts} publicaciones · {account.followers} seguidores
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Sincronizado</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-2.5">
          {feedSlots.map((slot) => (
            <FeedCell key={slot.id} slot={slot} />
          ))}
          <UploadCell />
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-slate-500 text-[11px]">
          Mostrando {feedSlots.length} piezas visuales
        </span>
        <button
          type="button"
          className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
        >
          Ver feed en Instagram →
        </button>
      </div>
    </div>
  )
}
