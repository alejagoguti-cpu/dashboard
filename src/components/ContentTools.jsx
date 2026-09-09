import { contentTools } from '../data/dashboard.js'
import { ChatIcon, HashtagIcon, SparklesIcon } from './icons.jsx'

const iconsById = {
  sparkles: SparklesIcon,
  hashtag: HashtagIcon,
  chat: ChatIcon,
}

export default function ContentTools() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Herramientas de Contenido
        </h3>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          IA Asistida
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {contentTools.map(({ id, icon, title, description, action }) => {
          const Icon = iconsById[icon]

          return (
            <div
              key={id}
              className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-900">{title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{description}</p>
              </div>
              <button
                type="button"
                className="mt-3 text-[11px] font-medium text-slate-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                {action} →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
