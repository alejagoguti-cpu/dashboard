import { useEffect, useMemo, useState } from 'react'
import { telegramIdeas as demoIdeas } from '../../data/dashboard.js'
import { formatDayLabel, formatTime } from '../../lib/dates.js'
import * as n8n from '../../lib/n8n.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import LiveBadge from './LiveBadge.jsx'
import { card } from './SectionHeader.jsx'
import {
  CheckIcon, CopyIcon, InstagramIcon, ReelIcon, RefreshIcon, TelegramIcon, TrashIcon, YouTubeIcon,
} from '../icons.jsx'

const FORMATOS = [
  { id: 'instagram', etiqueta: 'Publicación de Instagram', corto: 'Instagram', Icon: InstagramIcon },
  { id: 'youtube', etiqueta: 'Idea de YouTube', corto: 'YouTube', Icon: YouTubeIcon },
  { id: 'guion', etiqueta: 'Ayuda con el guion', corto: 'Guion', Icon: ReelIcon },
]

const porId = (id) => FORMATOS.find((f) => f.id === id) ?? FORMATOS[0]

/**
 * Bandeja de las ideas que llegan por Telegram. El bot recibe el pensamiento
 * suelto y devuelve el texto ya redactado; aquí se decide qué se hace con él.
 */
export default function TelegramInbox({ onSchedule }) {
  const { ideas: feed, notify } = useDashboard()

  const live = feed.status === 'ready' && feed.posts
  const vinculado = feed.meta?.vinculado ?? false
  const bot = feed.meta?.bot ?? null
  const codigo = feed.meta?.codigo ?? null

  const [rows, setRows] = useState(demoIdeas)
  const [ocupada, setOcupada] = useState(null)
  const [copiada, setCopiada] = useState(null)

  useEffect(() => {
    if (live) setRows(feed.posts)
  }, [live, feed.posts])

  // Solo las que ya tienen texto: una recién llegada aún está esperando a que
  // se elija el formato en el chat.
  const listas = useMemo(() => rows.filter((i) => i.texto), [rows])

  async function actuar(idea, accion, formato) {
    if (!live) {
      // Sin workflow no hay a quién pedírselo; la bandeja es de ejemplo.
      if (accion === 'descartar') setRows((c) => c.filter((i) => i.id !== idea.id))
      else notify('Conecta el workflow de Telegram para rehacer la idea')
      return
    }

    setOcupada(idea.id)
    try {
      const res = await n8n.callWebhook(n8n.WEBHOOKS.idea, {
        method: 'POST', body: { id: idea.id, accion, formato },
      })
      if (res?.ok === false) throw new Error(res.error ?? 'n8n no pudo con la acción')

      if (accion === 'descartar') {
        setRows((c) => c.filter((i) => i.id !== idea.id))
        notify('Idea descartada')
      } else if (res?.item) {
        setRows((c) => c.map((i) => (i.id === idea.id ? res.item : i)))
        notify(accion === 'usada' ? 'Marcada como usada' : 'Rehecha como ' + porId(formato).corto, 'success')
      }
    } catch (error) {
      notify(error.message)
    } finally {
      setOcupada(null)
    }
  }

  async function copiar(idea) {
    try {
      await navigator.clipboard.writeText(idea.texto)
      setCopiada(idea.id)
      setTimeout(() => setCopiada(null), 1600)
    } catch {
      notify('El navegador no dejó copiar; selecciona el texto a mano')
    }
  }

  return (
    <div className={`${card} p-5 space-y-4`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2.5">
          <TelegramIcon className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Ideas por Telegram</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escribes el pensamiento al bot y vuelve convertido en publicación
            </p>
          </div>
        </div>
        <LiveBadge
          live={feed}
          demoLabel="Ideas de ejemplo. Conecta el workflow de Telegram en n8n."
          liveLabel={bot ? `Conectado a ${bot}` : 'Conectado al bot'}
        />
      </div>

      {live && !vinculado && (
        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg space-y-3">
          <p className="text-xs text-sky-900 font-medium">
            Falta enlazar tu chat con este panel
          </p>
          <ol className="text-xs text-sky-900/80 space-y-1 list-decimal list-inside">
            <li>Abre {bot ?? 'tu bot'} en Telegram.</li>
            <li>
              Mándale este mensaje:{' '}
              <code className="px-1.5 py-0.5 bg-white border border-sky-200 rounded font-mono text-[11px]">
                /vincular {codigo ?? '······'}
              </code>
            </li>
            <li>Vuelve aquí: las ideas empezarán a aparecer solas.</li>
          </ol>
          <p className="text-[11px] text-sky-900/60">
            El código caduca en cuanto se usa. Mientras nadie lo mande, cualquiera
            que escriba al bot recibe una negativa.
          </p>
        </div>
      )}

      {listas.length === 0 ? (
        <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center">
          <p className="text-xs text-slate-500">
            {live && vinculado
              ? 'Todavía no has mandado ningún pensamiento al bot.'
              : 'Aquí aparecerán las ideas que mandes por Telegram.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {listas.map((idea) => {
            const formato = porId(idea.formato)
            const trabajando = ocupada === idea.id

            return (
              <li
                key={idea.id}
                className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    <formato.Icon className="w-3 h-3 text-slate-500" />
                    {idea.etiqueta ?? formato.etiqueta}
                  </span>
                  {idea.recibido && (
                    <span className="text-[11px] text-slate-400">
                      {formatDayLabel(idea.recibido)} · {formatTime(idea.recibido)}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 italic line-clamp-2">
                  Le escribiste: «{idea.pensamiento}»
                </p>

                <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {idea.texto}
                </p>

                {idea.ia === false && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                    Sin modelo conectado: esto es tu pensamiento ordenado, no un
                    texto redactado.
                  </p>
                )}

                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={trabajando}
                    onClick={() =>
                      onSchedule({ title: idea.titulo ?? idea.pensamiento, platform: idea.plataforma ?? 'instagram' })
                    }
                    className="text-[11px] font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 px-2.5 py-1 rounded transition"
                  >
                    Programar
                  </button>

                  <button
                    type="button"
                    onClick={() => copiar(idea)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-2 py-1 rounded transition"
                  >
                    {copiada === idea.id ? (
                      <CheckIcon className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <CopyIcon className="w-3 h-3" />
                    )}
                    {copiada === idea.id ? 'Copiado' : 'Copiar'}
                  </button>

                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 ml-1">
                    <RefreshIcon className="w-3 h-3" />
                    Rehacer como
                  </span>
                  {FORMATOS.filter((f) => f.id !== idea.formato).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      disabled={trabajando}
                      onClick={() => actuar(idea, 'reformular', f.id)}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white disabled:opacity-40 px-2 py-1 rounded transition"
                    >
                      {f.corto}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={trabajando}
                    onClick={() => actuar(idea, 'descartar')}
                    aria-label={`Descartar la idea «${idea.titulo ?? idea.pensamiento}»`}
                    className="ml-auto p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
