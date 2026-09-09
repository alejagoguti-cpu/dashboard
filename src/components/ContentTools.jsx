import { useState } from 'react'
import { contentTools } from '../data/dashboard.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'
import { ChatIcon, HashtagIcon, SparklesIcon } from './icons.jsx'

const iconsById = {
  sparkles: SparklesIcon,
  hashtag: HashtagIcon,
  chat: ChatIcon,
}

export default function ContentTools() {
  const { notify } = useDashboard()
  const [openTool, setOpenTool] = useState(null)
  const [batch, setBatch] = useState(0)

  const tool = contentTools.find((item) => item.id === openTool)
  const results = tool ? tool.batches[batch % tool.batches.length] : []

  function open(id) {
    setOpenTool(id)
    setBatch(0)
  }

  async function copyResults() {
    const text = results.map((item) => item.text).join('\n')

    try {
      await navigator.clipboard.writeText(text)
      notify('Resultados copiados al portapapeles', 'success')
    } catch {
      notify('El navegador bloqueó el acceso al portapapeles')
    }
  }

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
            <button
              key={id}
              type="button"
              onClick={() => open(id)}
              className="text-left bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-900">{title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{description}</p>
              </div>
              <span className="mt-3 text-[11px] font-medium text-slate-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                {action} →
              </span>
            </button>
          )
        })}
      </div>

      <Modal
        open={Boolean(tool)}
        onClose={() => setOpenTool(null)}
        title={tool?.title}
        subtitle={tool?.description}
        footer={
          <>
            <button
              type="button"
              onClick={copyResults}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Copiar resultados
            </button>
            <button
              type="button"
              onClick={() => setBatch((value) => value + 1)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
            >
              Generar otra tanda
            </button>
          </>
        }
      >
        <ul className="space-y-2">
          {results.map((item) => (
            <li
              key={item.text}
              className="flex items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-100 rounded-lg"
            >
              <span className="text-xs text-slate-700">{item.text}</span>
              <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                {item.metric}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-slate-400 mt-3">
          {tool?.resultLabel} · tanda {tool ? (batch % tool.batches.length) + 1 : 0} de{' '}
          {tool?.batches.length}
        </p>
      </Modal>
    </div>
  )
}
