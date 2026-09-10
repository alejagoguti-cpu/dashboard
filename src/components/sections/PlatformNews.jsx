import { newsItems } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { card, chip } from './SectionHeader.jsx'

const relevanceDot = { alta: 'bg-emerald-500', media: 'bg-slate-400', baja: 'bg-slate-300' }

function ago(minutes) {
  if (minutes == null) return null
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `hace ${hours} h` : `hace ${Math.round(hours / 24)} d`
}

/**
 * Las noticias que hablan de esta plataforma, dentro de su propio estudio: un
 * cambio de algoritmo se lee mejor al lado de las métricas que acaba moviendo.
 */
export default function PlatformNews({ platform, label, onOpenAll }) {
  const { news } = useDashboard()

  const live = news.status === 'ready' && news.posts
  const source = live ? news.posts : newsItems
  const items = source.filter((item) => item.platforms?.includes(platform)).slice(0, 4)

  if (items.length === 0) return null

  return (
    <div className={`${card} p-5 space-y-4`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Novedades de {label}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {live ? 'De tus feeds RSS' : 'Titulares de ejemplo'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAll}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 transition whitespace-nowrap"
        >
          Ver todas las noticias →
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const Wrapper = item.link ? 'a' : 'div'
          const props = item.link
            ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
            : {}

          return (
            <li key={item.id}>
              <Wrapper
                {...props}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 ${
                  item.link ? 'hover:border-slate-300 transition' : ''
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${relevanceDot[item.relevance]}`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">{item.source}</span>
                    {ago(item.minutes) && (
                      <>
                        <span>·</span>
                        <span>{ago(item.minutes)}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`${chip} hidden sm:inline-block flex-shrink-0`}>{item.topic}</span>
              </Wrapper>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
