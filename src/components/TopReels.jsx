import { useState } from 'react'
import { channelAverageRetention } from '../data/dashboard.js'
import { useDashboard } from '../state/DashboardContext.jsx'
import Modal from './ui/Modal.jsx'

/**
 * La Graph API no da "retención". Para los reels reales se muestra el tiempo
 * medio de visionado, que sí es una señal de retención, y si falta se cae al
 * porcentaje de alcance sobre reproducciones, nombrado como lo que es.
 */
function secondaryMetric(reel) {
  if (reel.source !== 'instagram') {
    return { label: `${reel.retention}% retención`, bar: reel.retention }
  }
  if (reel.avgWatchSeconds != null) {
    return { label: `${reel.avgWatchSeconds}s de media`, bar: null }
  }
  if (reel.reachPct != null) {
    return { label: `${reel.reachPct}% alcance/vistas`, bar: reel.reachPct }
  }
  return { label: 'sin datos de retención', bar: null }
}

function ReelRow({ reel, rank, onOpen }) {
  const secondary = secondaryMetric(reel)

  return (
    <button
      type="button"
      onClick={() => onOpen(reel)}
      className="w-full text-left p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-3 transition"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-12 rounded overflow-hidden flex-shrink-0 bg-slate-900">
          <img src={reel.image} alt={reel.title} className="w-full h-full object-cover" />
          <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded bg-black/60 text-white text-[8px] font-semibold flex items-center justify-center">
            {rank}
          </span>
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-medium text-slate-900 line-clamp-1">{reel.title}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span>{reel.views} vistas</span>
            <span>·</span>
            <span>{secondary.label}</span>
          </div>
          {secondary.bar != null && (
            <div className="w-24 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-slate-700 h-full rounded-full"
                style={{ width: `${secondary.bar}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-xs font-semibold text-slate-800">{reel.likes}</span>
        <p className="text-[10px] text-slate-400">{reel.shares} shares</p>
      </div>
    </button>
  )
}

export default function TopReels() {
  const { reels: topReels } = useDashboard()
  const [limit, setLimit] = useState(3)
  const [detail, setDetail] = useState(null)
  const [analysis, setAnalysis] = useState(false)

  const visible = topReels.slice(0, limit)

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Reels Destacados</h3>
          <p className="text-xs text-slate-500 mt-0.5">Mayor reproducción y retención del mes</p>
        </div>
        <button
          type="button"
          onClick={() => setLimit(limit === 3 ? topReels.length : 3)}
          className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 hover:border-slate-300 hover:text-slate-700 transition whitespace-nowrap"
        >
          Top {limit === 3 ? 3 : topReels.length}
        </button>
      </div>

      <div className="space-y-2.5 pt-1">
        {visible.map((reel, index) => (
          <ReelRow key={reel.id} reel={reel} rank={index + 1} onOpen={setDetail} />
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-slate-500 text-[11px]">
          Promedio del canal: {channelAverageRetention}%
        </span>
        <button
          type="button"
          onClick={() => setAnalysis(true)}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 transition"
        >
          Ver análisis detallado →
        </button>
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={detail?.duration ? `Reel de ${detail.duration}` : 'Métricas del reel'}
      >
        {detail && (
          <div className="flex gap-4">
            <img
              src={detail.image}
              alt={detail.title}
              className="w-24 h-32 rounded-lg object-cover bg-slate-900 flex-shrink-0"
            />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs flex-1">
              {[
                ['Vistas', detail.views],
                detail.source === 'instagram'
                  ? ['Visionado medio', detail.avgWatchSeconds != null ? `${detail.avgWatchSeconds}s` : '—']
                  : ['Retención', `${detail.retention}%`],
                ['Me gusta', detail.likes],
                ['Comentarios', detail.comments],
                ['Compartidos', detail.shares],
                ['Guardados', detail.saves],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>

      <Modal
        open={analysis}
        onClose={() => setAnalysis(false)}
        title="Análisis de reels"
        subtitle={`Retención media del canal: ${channelAverageRetention}%`}
        width="max-w-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="font-medium pb-2 pr-3">Reel</th>
                <th className="font-medium pb-2 px-3 text-right">Vistas</th>
                <th className="font-medium pb-2 px-3 text-right">Retención</th>
                <th className="font-medium pb-2 px-3 text-right">Guardados</th>
                <th className="font-medium pb-2 pl-3 text-right">vs media</th>
              </tr>
            </thead>
            <tbody>
              {topReels.map((reel) => {
                const diff = reel.retention - channelAverageRetention

                return (
                  <tr key={reel.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3 text-slate-800 font-medium">{reel.title}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{reel.views}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{reel.retention}%</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{reel.saves}</td>
                    <td
                      className={`py-2.5 pl-3 text-right font-medium ${
                        diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {diff >= 0 ? '+' : ''}
                      {diff} pts
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}
