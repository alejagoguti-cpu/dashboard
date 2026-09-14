import { useMemo, useState } from 'react'
import { formatStats, postFormats } from '../../data/dashboard.js'
import useLocalStorage from '../../hooks/useLocalStorage.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import Modal from '../ui/Modal.jsx'
import SectionHeader, { card, ghostButton, primaryButton } from './SectionHeader.jsx'

const TYPES = {
  trafico: { label: 'Tráfico', tone: 'bg-blue-50 text-blue-700 border-blue-200', objective: 'Llevar a una oferta o recurso' },
  conexion: { label: 'Conexión', tone: 'bg-amber-50 text-amber-700 border-amber-200', objective: 'Crear conversación y cercanía' },
  posicionamiento: { label: 'Posicionamiento', tone: 'bg-violet-50 text-violet-700 border-violet-200', objective: 'Demostrar criterio y autoridad' },
}

const TOPICS = [
  ['Tu oferta no se entiende', 'Explica el coste de seguir igual', 'Responde “OFERTA” y te envío la guía'],
  ['Publicas sin una intención', 'Enseña el trabajo de cada tipo de contenido', 'Mira el recurso completo en el enlace'],
  ['Tus DMs no abren conversaciones', 'Cuenta el error que cometías y el cambio', '¿Te pasa también? Respóndeme aquí'],
  ['Creas todo desde cero', 'Muestra cómo reutilizas una idea probada', 'Guarda esta secuencia para tu próxima semana'],
  ['Mides alcance, no decisiones', 'Compara una métrica vanidosa con una señal real', 'Escríbeme “MÉTRICAS” y lo revisamos'],
  ['Tu calendario depende de inspiración', 'Enseña tu sistema semanal en tres pasos', 'Pulsa el enlace y copia la plantilla'],
]

const FORMAT_PURPOSE = {
  Reel: 'Alcance y descubrimiento', Carrusel: 'Educación y guardados', Imagen: 'Mensaje rápido', Story: 'Conversación diaria',
  'Vídeo largo': 'Profundidad y autoridad', Short: 'Descubrimiento rápido', Directo: 'Confianza en tiempo real',
  Artículo: 'Pensamiento experto', Texto: 'Conversación profesional', Vídeo: 'Autoridad personal',
}

function dayAt(index) {
  const date = new Date()
  date.setDate(date.getDate() + index)
  return date.toISOString().slice(0, 10)
}

function buildPlan() {
  const types = Object.keys(TYPES)
  return Array.from({ length: 30 }, (_, index) => {
    const [problem, development, cta] = TOPICS[index % TOPICS.length]
    const type = types[index % types.length]
    return {
      id: `story-${Date.now()}-${index}`,
      date: dayAt(index), type, problem, status: 'borrador',
      frames: [
        `Historia 1 · Gancho: ${problem}`,
        `Historia 2 · Desarrollo: ${development}. CTA: ${type === 'conexion' ? 'Abre conversación con una pregunta' : cta}`,
      ],
    }
  })
}

function StoryCard({ sequence, onOpen, onToggle }) {
  const meta = TYPES[sequence.type]
  const date = new Date(`${sequence.date}T12:00:00`).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
  return (
    <article className={`${card} p-4 flex flex-col gap-3 hover:border-slate-300 transition`}>
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{date}</p><h3 className="text-xs font-semibold text-slate-900 mt-1 line-clamp-2">{sequence.problem}</h3></div>
        <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${meta.tone}`}>{meta.label}</span>
      </div>
      <div className="space-y-1.5">
        {sequence.frames.map((frame, index) => <div key={`${sequence.id}-${index}`} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"><p className="text-[11px] text-slate-600 line-clamp-2">{frame}</p></div>)}
      </div>
      <div className="mt-auto pt-1 flex items-center justify-between gap-2">
        <button type="button" onClick={() => onToggle(sequence.id)} className={`text-[10px] font-medium ${sequence.status === 'lista' ? 'text-emerald-600' : 'text-slate-400'}`}>{sequence.status === 'lista' ? '● Lista para publicar' : '○ Marcar como lista'}</button>
        <button type="button" onClick={() => onOpen(sequence)} className="text-[11px] font-semibold text-slate-700 hover:text-slate-950">Editar y programar →</button>
      </div>
    </article>
  )
}

export default function Formats({ onSchedule }) {
  const { notify } = useDashboard()
  const [plan, setPlan] = useLocalStorage('bitaxus.story-plan', [])
  const [masters, setMasters] = useLocalStorage('bitaxus.master-texts', [])
  const [masterText, setMasterText] = useState('')
  const [masterTitle, setMasterTitle] = useState('')
  const [filter, setFilter] = useState('todos')
  const [platformFilter, setPlatformFilter] = useState('todos')
  const [editing, setEditing] = useState(null)
  const best = [...formatStats].sort((a, b) => b.engagement - a.engagement)[0]
  const visible = useMemo(() => plan.filter((item) => filter === 'todos' || item.type === filter), [plan, filter])
  const ready = plan.filter((item) => item.status === 'lista').length
  const storyCount = plan.reduce((total, item) => total + item.frames.length, 0)

  function generate() {
    setPlan(buildPlan())
    notify('Plan creado: 60 historias para los próximos 30 días', 'success')
  }
  function update(id, patch) {
    setPlan((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }
  function saveMaster(event) {
    event.preventDefault()
    if (!masterText.trim()) return notify('Pega un texto maestro para continuar')
    const title = masterTitle.trim() || masterText.trim().split(/\n|\.|\?|!/)[0].slice(0, 70)
    setMasters((current) => [{ id: `master-${Date.now()}`, title, content: masterText.trim() }, ...current])
    setMasterTitle(''); setMasterText(''); notify('Texto maestro guardado', 'success')
  }

  return (
    <>
      <SectionHeader title="Biblioteca de formatos" subtitle="Guarda textos maestros y conviértelos en publicaciones para cada red">
        <button type="button" onClick={generate} className={primaryButton}>{plan.length ? 'Regenerar plan' : 'Crear 60 historias'}</button>
      </SectionHeader>

      <section className={`${card} master-workspace`}><form onSubmit={saveMaster} className="master-editor"><div><p className="eyebrow">01 · Texto maestro</p><h2 className="text-base font-extrabold text-slate-900 mt-1">Pega una pieza que represente tu voz</h2><p className="text-[11px] text-slate-500 mt-1">La usarás como base para crear versiones similares, no copias idénticas.</p></div><input value={masterTitle} onChange={e=>setMasterTitle(e.target.value)} placeholder="Nombre interno del texto" className="premium-input w-full"/><textarea value={masterText} onChange={e=>setMasterText(e.target.value)} rows="7" placeholder="Pega aquí tu post, guion, transcripción o copy maestro…" className="premium-input w-full resize-y leading-relaxed"/><button className={`${primaryButton} w-fit`}>Guardar texto maestro</button></form><div className="master-library"><div className="flex items-center justify-between"><div><p className="eyebrow">Biblioteca</p><h3 className="text-sm font-bold mt-1">{masters.length} textos guardados</h3></div></div>{masters.length===0?<div className="empty-master">Tus textos maestros aparecerán aquí.</div>:<div className="space-y-2">{masters.slice(0,4).map(item=><article key={item.id} className="master-item"><div><b>{item.title}</b><p>{item.content}</p></div><button onClick={()=>onSchedule({title:item.title,content:item.content,platform:'instagram'})}>Crear versión →</button></article>)}</div>}</div></section>

      <div className="format-steps"><div className="active"><span>1</span><p><b>Elige la red</b><small>Filtra lo que necesitas</small></p></div><i/><div><span>2</span><p><b>Elige el formato</b><small>Según tu objetivo</small></p></div><i/><div><span>3</span><p><b>Programa</b><small>En un solo clic</small></p></div></div>

      <section className={`${card} p-6 space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-sm font-semibold text-slate-900">Todos los formatos</h2><p className="text-[11px] text-slate-500 mt-0.5">Elige uno y programa en un solo paso.</p></div>
          <div className="segmented-control">
            {['todos', ...Object.keys(postFormats)].map((platform) => <button key={platform} type="button" onClick={() => setPlatformFilter(platform)} className={platformFilter === platform ? 'active' : ''}>{platform === 'todos' ? 'Todos' : platform[0].toUpperCase() + platform.slice(1)}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(postFormats).flatMap(([platform, formats]) => formats.map((format) => ({ platform, format }))).filter((item) => platformFilter === 'todos' || item.platform === platformFilter).map(({ platform, format }) => (
            <button key={`${platform}-${format}`} type="button" onClick={() => { const master=masters[0]; onSchedule({ platform, format, title:master?.title||'', content:master?.content||'' }) }} className={`format-card ${platform}`}>
              <div className="format-icon">{format==='Reel'||format==='Short'||format==='Vídeo'||format==='Vídeo largo'?'▶':format==='Story'?'◉':format==='Carrusel'?'▦':format==='Directo'?'●':'✦'}</div><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-slate-900">{format}</span><span className="text-[9px] uppercase tracking-wide text-slate-400">{platform}</span></div>
              <p className="text-[11px] text-slate-500 mt-1">{FORMAT_PURPOSE[format] ?? 'Contenido para tu audiencia'}</p>
              <span className="block text-[10px] font-bold text-violet-600 mt-3">Usar formato →</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Historias', storyCount, '2 por día'], ['Secuencias', plan.length, 'un problema cada una'],
          ['Listas', ready, `${Math.round((ready / Math.max(plan.length, 1)) * 100)}% completado`],
          ['Mejor formato', best.name, `${best.engagement}% engagement`],
        ].map(([label, value, caption]) => <div key={label} className={`${card} p-4`}><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="text-xl font-bold text-slate-900 mt-1">{value}</p><p className="text-[11px] text-slate-500 mt-0.5">{caption}</p></div>)}
      </div>

      <div className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div><p className="text-xs font-semibold text-slate-900">Estructura del mes</p><p className="text-[11px] text-slate-500 mt-0.5">Alterna tráfico, conexión y posicionamiento; cada secuencia resuelve un solo problema.</p></div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['todos', ...Object.keys(TYPES)].map((type) => <button key={type} type="button" onClick={() => setFilter(type)} className={`${ghostButton} ${filter === type ? 'bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-slate-900' : ''}`}>{type === 'todos' ? 'Todas' : TYPES[type].label}</button>)}
        </div>
      </div>

      {plan.length === 0 ? (
        <div className={`${card} border-dashed p-10 text-center`}><p className="text-sm font-semibold text-slate-900">Tu calendario de historias está vacío</p><p className="text-xs text-slate-500 mt-1">Genera 30 secuencias editables —60 historias— repartidas durante todo el mes.</p><button type="button" onClick={generate} className={`${primaryButton} mx-auto mt-4`}>Crear el calendario</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{visible.map((sequence) => <StoryCard key={sequence.id} sequence={sequence} onOpen={(item) => setEditing({ ...item, frames: [...item.frames] })} onToggle={(id) => { const item = plan.find((row) => row.id === id); update(id, { status: item.status === 'lista' ? 'borrador' : 'lista' }) }} />)}</div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar secuencia" subtitle={editing ? `${TYPES[editing.type].label} · ${TYPES[editing.type].objective}` : ''} width="max-w-2xl" footer={editing && <><button type="button" onClick={() => { update(editing.id, editing); setEditing(null); notify('Secuencia guardada', 'success') }} className={ghostButton}>Guardar borrador</button><button type="button" onClick={() => { update(editing.id, { ...editing, status: 'lista' }); setEditing(null); onSchedule({ platform: 'instagram', format: 'Story', title: editing.problem, content: editing.frames.join('\n\n'), date: `${editing.date}T19:00` }) }} className={primaryButton}>Enviar al calendario</button></>}>
        {editing && <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3"><label className="text-[11px] text-slate-500">Fecha<input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" /></label><label className="text-[11px] text-slate-500">Objetivo<select value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value })} className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">{Object.entries(TYPES).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select></label></div>
          <label className="block text-[11px] text-slate-500">Único problema de la secuencia<input value={editing.problem} onChange={(event) => setEditing({ ...editing, problem: event.target.value })} className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" /></label>
          {editing.frames.map((frame, index) => <label key={index} className="block text-[11px] text-slate-500">Historia {index + 1}<textarea value={frame} onChange={(event) => { const frames = [...editing.frames]; frames[index] = event.target.value; setEditing({ ...editing, frames }) }} rows="3" className="mt-1 w-full px-3 py-2 text-xs leading-relaxed border border-slate-200 rounded-lg resize-y" /></label>)}
          <button type="button" onClick={() => setEditing({ ...editing, frames: [...editing.frames, 'Nueva historia · Escribe aquí el mensaje y la acción.'] })} className="text-xs font-medium text-slate-600 hover:text-slate-900">+ Añadir historia a la secuencia</button>
        </div>}
      </Modal>
    </>
  )
}
