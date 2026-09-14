import { useMemo, useState } from 'react'
import { dateRanges } from '../../data/dashboard.js'
import { useDashboard } from '../../state/DashboardContext.jsx'
import { ChartIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '../icons.jsx'
import SectionHeader, { card } from './SectionHeader.jsx'

const networks = [
  { id: 'all', label: 'Todas las redes', Icon: ChartIcon, color: '#7c3aed' },
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: '#ec4899' },
  { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon, color: '#ef4444' },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, color: '#0a66c2' },
]
const metrics = {
  all: [['Alcance total','749.2K','+22.4%'],['Interacciones','46.8K','+14.7%'],['Nuevos seguidores','6,630','+18.1%'],['Conversión','12.8%','+2.4%']],
  instagram: [['Alcance','384.2K','+24.6%'],['Interacciones','24.9K','+18.2%'],['Seguidores','3,820','+18.2%'],['Engagement','4.8%','+0.6%']],
  youtube: [['Visualizaciones','218.7K','+16.4%'],['Horas vistas','18.4K','+12.9%'],['Suscriptores','1,940','+9.8%'],['Retención','42.1%','+2.3%']],
  linkedin: [['Impresiones','146.3K','+28.1%'],['Interacciones','8.7K','+21.4%'],['Contactos','870','+14.6%'],['CTR','9.7%','+1.8%']],
}
const series = { all:[28,36,32,47,44,58,51,68,63,78,72,91], instagram:[22,28,25,39,35,51,43,60,56,72,68,84], youtube:[18,24,31,27,42,38,49,53,48,61,59,70], linkedin:[12,18,16,24,29,26,35,31,42,39,48,54] }
const content = [
  { title:'Caso de estudio: de 0 a 50K MRR', network:'instagram', format:'Reel', reach:'112.4K', rate:'8.9%' },
  { title:'El sistema de contenido que reemplaza una agencia', network:'youtube', format:'Vídeo', reach:'48.2K', rate:'7.1%' },
  { title:'Dejamos de medir posts y empezamos a medir decisiones', network:'linkedin', format:'Texto', reach:'38.6K', rate:'7.2%' },
  { title:'Por qué no vender por mensaje directo', network:'instagram', format:'Carrusel', reach:'84.5K', rate:'6.8%' },
]

function TrendChart({ values, color }) {
  const points = values.map((v,i)=>`${(i/(values.length-1))*100},${100-v}`).join(' ')
  return <div className="relative h-64 mt-5"><div className="absolute inset-0 grid grid-rows-4">{[0,1,2,3].map(n=><div key={n} className="border-t border-slate-100" />)}</div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible" aria-label="Evolución del rendimiento"><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#analyticsFill)"/><polyline points={points} fill="none" stroke={color} strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>{values.map((v,i)=><circle key={i} cx={(i/(values.length-1))*100} cy={100-v} r="1.2" fill="white" stroke={color} strokeWidth=".7"/>)}</svg><div className="absolute inset-x-0 -bottom-6 flex justify-between text-[10px] text-slate-400"><span>1 Sep</span><span>8 Sep</span><span>15 Sep</span><span>22 Sep</span><span>30 Sep</span></div></div>
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
    <div className="grid xl:grid-cols-3 gap-5"><section className={`${card} premium-card xl:col-span-2 p-6`}><div className="flex items-start justify-between"><div><h2 className="panel-title">Evolución del rendimiento</h2><p className="panel-subtitle">Alcance e impresiones acumuladas</p></div><span className="live-pill"><i/> En crecimiento</span></div><TrendChart values={series[network]} color={active.color}/></section><section className={`${card} premium-card p-6`}><h2 className="panel-title">Distribución por canal</h2><p className="panel-subtitle">Contribución al alcance total</p><div className="donut"><div><strong>749K</strong><span>total</span></div></div><div className="space-y-3 mt-5">{networks.slice(1).map((item,i)=><div key={item.id} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><i className="w-2 h-2 rounded-full" style={{background:item.color}}/>{item.label}</span><strong>{[51,29,20][i]}%</strong></div>)}</div></section></div>
    <section className={`${card} premium-card overflow-hidden`}><div className="p-5 flex items-center justify-between border-b border-slate-100"><div><h2 className="panel-title">Contenido con mejor rendimiento</h2><p className="panel-subtitle">Ordenado por alcance del periodo</p></div><button className="text-xs font-semibold text-violet-600 hover:text-violet-800">Ver informe completo →</button></div><div className="overflow-x-auto"><table className="premium-table"><thead><tr><th>Contenido</th><th>Red</th><th>Formato</th><th>Alcance</th><th>Engagement</th></tr></thead><tbody>{filtered.map(row=>{const net=networks.find(n=>n.id===row.network);const Icon=net.Icon;return <tr key={row.title}><td className="font-semibold text-slate-800">{row.title}</td><td><span className="network-badge"><Icon className="w-3.5 h-3.5"/>{net.label}</span></td><td>{row.format}</td><td className="font-semibold">{row.reach}</td><td><span className="positive">{row.rate}</span></td></tr>})}</tbody></table></div></section>
  </>
}
