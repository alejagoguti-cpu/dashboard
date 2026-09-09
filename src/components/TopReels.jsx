import { channelAverageRetention, topReels } from '../data/dashboard.js'

export default function TopReels() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Reels Destacados</h3>
          <p className="text-xs text-slate-500 mt-0.5">Mayor reproducción y retención del mes</p>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Top {topReels.length}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {topReels.map(({ id, rank, image, title, views, retention, likes, shares }) => (
          <div
            key={id}
            className="p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 transition"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-12 rounded overflow-hidden flex-shrink-0 bg-slate-900">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded bg-black/60 text-white text-[8px] font-semibold flex items-center justify-center">
                  {rank}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-900 line-clamp-1">{title}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span>{views}</span>
                  <span>·</span>
                  <span>{retention}% retención</span>
                </div>
                <div className="w-24 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-slate-700 h-full rounded-full"
                    style={{ width: `${retention}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-semibold text-slate-800">{likes}</span>
              <p className="text-[10px] text-slate-400">{shares}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-slate-500 text-[11px]">
          Promedio del canal: {channelAverageRetention}%
        </span>
        <a href="#" className="text-xs font-medium text-slate-700 hover:text-slate-900 transition">
          Ver análisis detallado →
        </a>
      </div>
    </div>
  )
}
