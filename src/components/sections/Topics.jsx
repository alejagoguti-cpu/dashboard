import { useMemo, useState } from 'react'
import { topics as demoTopics } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { InstagramIcon, LinkedInIcon, PlusIcon, YouTubeIcon } from '../icons.jsx'
import LiveBadge from './LiveBadge.jsx'
import SectionHeader, { card, primaryButton } from './SectionHeader.jsx'

const icons={instagram:InstagramIcon,youtube:YouTubeIcon,linkedin:LinkedInIcon}
const labels={instagram:'Instagram',youtube:'YouTube',linkedin:'LinkedIn'}

export default function Topics({onSchedule}){
 const {topics:feed,slots,posts}=useDashboard(); const [query,setQuery]=useState(''); const [sort,setSort]=useState('opportunity')
 const live=feed.status==='ready'&&feed.posts; const source=live?feed.posts:demoTopics
 const mine=t=>[...slots,...posts].filter(p=>(p.title||'').toLowerCase().includes(t.name.toLowerCase().split(' ')[0])).length
 const rows=useMemo(()=>source.filter(t=>t.name.toLowerCase().includes(query.toLowerCase())).map(t=>({...t,mine:live?mine(t):t.posts||0,score:Math.max(18,Math.min(98,55+(t.trend||0)-(live?mine(t):t.posts||0)*3))})).sort((a,b)=>sort==='volume'?b.volume-a.volume:sort==='trend'?(b.trend||0)-(a.trend||0):b.score-a.score),[source,query,sort,live,slots,posts])
 return <>
  <SectionHeader title="Radar de temas" subtitle="Detecta oportunidades y conviértelas en contenido antes que los demás"><button onClick={()=>onSchedule({platform:'instagram'})} className={primaryButton}><PlusIcon className="w-4 h-4"/> Crear desde cero</button></SectionHeader>
  <LiveBadge live={feed} demoLabel="Datos de ejemplo · conecta tus feeds para detectar tendencias en vivo." liveLabel="Radar actualizado desde tus feeds RSS"/>
  <div className={`${card} p-4 flex flex-wrap gap-3 items-center justify-between`}><div className="relative flex-1 min-w-52"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar tema, industria o palabra clave…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:border-violet-400 focus:bg-white"/></div><select value={sort} onChange={e=>setSort(e.target.value)} className="premium-select"><option value="opportunity">Mayor oportunidad</option><option value="trend">Mayor crecimiento</option><option value="volume">Mayor volumen</option></select></div>
  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{rows.map((row,index)=><article key={row.name} className={`${card} premium-card p-5 group`}><div className="flex items-start justify-between"><div className="flex items-center gap-2"><span className="topic-rank">{String(index+1).padStart(2,'0')}</span><span className={row.trend>=0?'trend-up':'trend-down'}>{row.trend>=0?'↗':'↘'} {Math.abs(row.trend||0)}%</span></div><span className="opportunity-score">{row.score}% oportunidad</span></div><h2 className="text-sm font-extrabold text-slate-900 mt-4">{row.name}</h2><p className="text-[11px] text-slate-500 mt-1 line-clamp-2 min-h-8">{row.sample?`${row.sample.source}: ${row.sample.title}`:'Tema con crecimiento sostenido dentro de tu audiencia.'}</p><div className="grid grid-cols-2 gap-3 my-4"><div className="mini-stat"><span>{live?'Noticias':'Volumen'}</span><strong>{Number(row.volume).toLocaleString('es-ES')}</strong></div><div className="mini-stat"><span>Contenido tuyo</span><strong>{row.mine} piezas</strong></div></div><div className="flex items-center justify-between pt-3 border-t border-slate-100"><div className="flex gap-1">{(row.platforms?.length?row.platforms:['instagram']).map(id=>{const Icon=icons[id]||InstagramIcon;return <span title={labels[id]} key={id} className="social-dot"><Icon className="w-3.5 h-3.5"/></span>})}</div><button onClick={()=>onSchedule({title:row.sample?.title||row.name,platform:row.platforms?.[0]||'instagram'})} className="text-[11px] font-bold text-violet-600 hover:text-violet-800">Crear contenido →</button></div></article>)}</div>
 </>
}
