import { useMemo, useState } from 'react'
import { dateRanges } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { ChartIcon, FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '../icons.jsx'
import SectionHeader, { card } from './SectionHeader.jsx'

const networks = [
  { id: 'all', label: 'Todas las redes', Icon: ChartIcon, color: '#7c3aed' },
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon, color: '#1877f2' },
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: '#ec4899' },
  { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon, color: '#ef4444' },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, color: '#0a66c2' },
]
const metrics = {
  all: [['Alcance total','749.2K','+22.4%'],['Interacciones','46.8K','+14.7%'],['Nuevos seguidores','6,630','+18.1%'],['Conversión','12.8%','+2.4%']],
  instagram: [['Alcance','384.2K','+24.6%'],['Interacciones','24.9K','+18.2%'],['Seguidores','3,820','+18.2%'],['Engagement','4.8%','+0.6%']],
  facebook: [['Alcance','196.8K','+19.4%'],['Interacciones','10.6K','+11.2%'],['Seguidores','1,260','+8.2%'],['Engagement','5.4%','+0.8%']],
  youtube: [['Visualizaciones','218.7K','+16.4%'],['Horas vistas','18.4K','+12.9%'],['Suscriptores','1,940','+9.8%'],['Retención','42.1%','+2.3%']],
  linkedin: [['Impresiones','146.3K','+28.1%'],['Interacciones','8.7K','+21.4%'],['Contactos','870','+14.6%'],['CTR','9.7%','+1.8%']],
}
const series = { all:[312,348,331,392,410,438,465,452,508,536,571,612], facebook:[82,91,88,103,109,116,124,121,136,145,153,164], instagram:[168,185,174,211,218,235,252,241,274,286,309,331], youtube:[91,103,99,116,122,130,137,135,151,163,171,184], linkedin:[53,60,58,65,70,73,76,76,83,87,91,97] }
const content = [
  { title:'Cómo convertir una idea en una semana de contenido', network:'facebook', format:'Imagen', reach:'34.8K', rate:'6.1%' },
  { title:'Caso de estudio: de 0 a 50K MRR', network:'instagram', format:'Reel', reach:'112.4K', rate:'8.9%' },
  { title:'El sistema de contenido que reemplaza una agencia', network:'youtube', format:'Vídeo', reach:'48.2K', rate:'7.1%' },
  { title:'Dejamos de medir posts y empezamos a medir decisiones', network:'linkedin', format:'Texto', reach:'38.6K', rate:'7.2%' },
  { title:'Por qué no vender por mensaje directo', network:'instagram', format:'Carrusel', reach:'84.5K', rate:'6.8%' },
]

function TrendChart({ values, color }) {
  const max=Math.ceil(Math.max(...values)/100)*100; const min=0; const y=v=>92-((v-min)/(max-min))*82; const points=values.map((v,i)=>`${8+(i/(values.length-1))*90},${y(v)}`).join(' ')
  return <div className="relative h-72 mt-5"><svg viewBox="0 0 110 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-label={`Evolución desde ${values[0]}K hasta ${values.at(-1)}K`}><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".2"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>{[0,.25,.5,.75,1].map(r=><line key={r} x1="8" x2="108" y1={92-r*82} y2={92-r*82} stroke="#e9edf3" strokeWidth=".35"/>)}<polygon points={`8,92 ${points} 108,92`} fill="url(#analyticsFill)"/><polyline points={points} fill="none" stroke={color} strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>{values.map((v,i)=><circle key={i} cx={8+(i/(values.length-1))*90} cy={y(v)} r="1.1" fill="white" stroke={color} strokeWidth=".7"/>)}</svg><div className="absolute left-0 inset-y-0 flex flex-col justify-between pb-5 text-[9px] text-slate-400"><span>{max}K</span><span>{max*.75}K</span><span>{max*.5}K</span><span>{max*.25}K</span><span>0</span></div><div className="absolute left-10 right-0 -bottom-1 flex justify-between text-[10px] text-slate-400"><span>1 Sep</span><span>8 Sep</span><span>15 Sep</span><span>22 Sep</span><span>30 Sep</span></div><div className="absolute top-1 right-1 text-right"><strong className="text-lg text-slate-900">{values.at(-1)}K</strong><p className="text-[10px] text-slate-400">último periodo</p></div></div>
}

export default function Analytics() {
  const { range, setRange } = useDashboard()
  const [network,setNetwork] = useState('all')
  const active = networks.find(item=>item.id===network)
  const filtered = useMemo(()=>network==='all'?content:content.filter(item=>item.network===network),[network])
  return <>
    <SectionHeader title="Centro de analíticas" subtitle="Toda tu operación de contenido, en una sola vista"><select value={range} onChange={e=>setRange(e.target.value)} aria-label="Rango de fechas" className="premium-select">{dateRanges.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select><button type="button" className="premium-button secondary">↓ Exportar reporte</button></SectionHeader>
    <div className="segmented-control w-fit" aria-label="Filtrar por red social">{networks.map(({id,label,Icon})=><button key={id} type="button" onClick={()=>setNetwork(id)} aria-pressed={network===id} className={network===id?'active':''}><Icon className="w-4 h-4"/>{label}</button>)}</div>
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">{metrics[network].map(([label,value,delta])=><article key={label} className="metric-card group"><div className="flex justify-between"><span className="eyebrow">{label}</span><span className="metric-icon" style={{color:active.color}}><ChartIcon className="w-4 h-4"/></span></div><strong>{value}</strong><div className="flex items-center gap-2"><span className="positive">↗ {delta}</span><span className="text-[11px] text-slate-400">vs periodo anterior</span></div></article>)}</section>
    <div className="grid xl:grid-cols-3 gap-5"><section className={`${card} premium-card xl:col-span-2 p-6`}><div className="flex items-start justify-between"><div><h2 className="panel-title">Evolución semanal</h2><p className="panel-subtitle">Miles de personas alcanzadas · misma escala durante todo el periodo</p></div><span className="live-pill"><i/> +{Math.round((series[network].at(-1)/series[network][0]-1)*100)}%</span></div><TrendChart values={series[network]} color={active.color}/></section></div>
    <section className={`${card} premium-card overflow-hidden`}><div className="p-5 flex items-center justify-between border-b border-slate-100"><div><h2 className="panel-title">Contenido con mejor rendimiento</h2><p className="panel-subtitle">Ordenado por alcance del periodo</p></div><button className="text-xs font-semibold text-violet-600 hover:text-violet-800">Ver informe completo →</button></div><div className="overflow-x-auto"><table className="premium-table"><thead><tr><th>Contenido</th><th>Red</th><th>Formato</th><th>Alcance</th><th>Engagement</th></tr></thead><tbody>{filtered.map(row=>{const net=networks.find(n=>n.id===row.network);const Icon=net.Icon;return <tr key={row.title}><td className="font-semibold text-slate-800">{row.title}</td><td><span className="network-badge"><Icon className="w-3.5 h-3.5"/>{net.label}</span></td><td>{row.format}</td><td className="font-semibold">{row.reach}</td><td><span className="positive">{row.rate}</span></td></tr>})}</tbody></table></div></section>
  </>
}
