/**
 * Datos de demostración del panel. Todo el contenido mostrado en la interfaz vive
 * aquí para que sustituirlo por una API real solo implique cambiar este módulo.
 *
 * Las portadas son SVG del propio repositorio (`src/assets`). Antes apuntaban al
 * CDN temporal de Google Stitch, del que salió el diseño, pero esos enlaces
 * caducan y dejaban el feed en blanco.
 */

import avatarAlejandra from '../assets/avatar-alejandra.svg'
import carruseles from '../assets/carruseles.svg'
import casoEstudio from '../assets/caso-estudio.svg'
import embudoB2B from '../assets/embudo-b2b.svg'
import erroresEvitar from '../assets/errores-evitar.svg'
import estrategiasDigitales from '../assets/estrategias-digitales.svg'
import frameworkContenido from '../assets/framework-contenido.svg'
import herramientasAgencias from '../assets/herramientas-agencias.svg'
import noticiaAlgoritmo from '../assets/noticia-algoritmo.svg'
import noticiaColombia from '../assets/noticia-colombia.svg'
import noticiaIa from '../assets/noticia-ia.svg'
import noticiaReels from '../assets/noticia-reels.svg'
import operadorFundador from '../assets/operador-fundador.svg'
import reflexionBitaxus from '../assets/reflexion-bitaxus.svg'

export const media = {
  avatar: avatarAlejandra,
  carruseles,
  casoEstudio,
  embudoB2B,
  erroresEvitar,
  estrategiasDigitales,
  frameworkContenido,
  herramientasAgencias,
  operadorFundador,
  reflexionBitaxus,
  noticiaAlgoritmo,
  noticiaColombia,
  noticiaIa,
  noticiaReels,
}

export const account = {
  name: 'Alejandra',
  handle: '@bitaxus',
  posts: 42,
  followers: '128K',
  avatar: media.avatar,
  profileUrl: 'https://www.instagram.com/bitaxus/',
}

export const dateRanges = [
  { id: '7d', label: 'Últimos 7 días' },
  { id: '30d', label: 'Últimos 30 días' },
  { id: '90d', label: 'Últimos 90 días' },
  { id: '12m', label: 'Últimos 12 meses' },
]

/** Metadatos fijos de cada KPI; los valores dependen del rango seleccionado. */
export const kpiMeta = [
  { id: 'alcance', label: 'Alcance Total', icon: 'eye' },
  { id: 'engagement', label: 'Engagement', icon: 'heart' },
  { id: 'seguidores', label: 'Nuevos Seguidores', icon: 'userPlus' },
  { id: 'clicks', label: 'Clicks en Enlace', icon: 'link' },
]

export const kpiValues = {
  '7d': {
    alcance: { value: '96.4K', delta: '+11.2%', trend: 'up', caption: 'vs semana anterior' },
    engagement: { value: '5.1%', delta: '+0.9%', trend: 'up', caption: 'sobre promedio' },
    seguidores: { value: '+910', delta: '+12.4%', trend: 'up', caption: 'orgánico' },
    clicks: { value: '470', caption: '15.1% conversión' },
  },
  '30d': {
    alcance: { value: '384.2K', delta: '+24.6%', trend: 'up', caption: 'vs mes anterior' },
    engagement: { value: '4.8%', delta: '+0.6%', trend: 'up', caption: 'sobre promedio' },
    seguidores: { value: '+3,820', delta: '+18.2%', trend: 'up', caption: 'orgánico' },
    clicks: { value: '1,840', caption: '14.2% conversión' },
  },
  '90d': {
    alcance: { value: '1.02M', delta: '+31.8%', trend: 'up', caption: 'vs trimestre anterior' },
    engagement: { value: '4.5%', delta: '+0.3%', trend: 'up', caption: 'sobre promedio' },
    seguidores: { value: '+11,240', delta: '+21.6%', trend: 'up', caption: 'orgánico' },
    clicks: { value: '5,320', caption: '13.4% conversión' },
  },
  '12m': {
    alcance: { value: '3.88M', delta: '+48.2%', trend: 'up', caption: 'vs año anterior' },
    engagement: { value: '4.2%', delta: '-0.4%', trend: 'down', caption: 'sobre promedio' },
    seguidores: { value: '+42,610', delta: '+35.9%', trend: 'up', caption: 'orgánico' },
    clicks: { value: '19,470', caption: '12.8% conversión' },
  },
}

/**
 * Publicaciones programadas. `at` es un ISO local; el calendario y las etiquetas
 * de la cuadrícula derivan de aquí, así que cancelar una publicación también
 * limpia su etiqueta en el feed.
 */
/** Devuelve una fecha local `YYYY-MM-DDTHH:mm` a N días de hoy. */
function inDays(days, time) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}`
}

export const initialScheduledPosts = [
  {
    id: 'post-manana',
    at: inDays(1, '19:00'),
    platform: 'instagram',
    format: 'Reel',
    title: '3 errores al escalar tu oferta high-ticket',
    score: 94,
  },
  {
    id: 'post-jueves',
    at: inDays(2, '20:30'),
    platform: 'instagram',
    format: 'Carrusel',
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    score: 88,
  },
]

export const freeSlot = {
  at: inDays(4, '13:00'),
  suggestion: 'Sugerido: Story interactiva o encuesta',
}

export const postingWindow = '19:00 - 21:30'

/** Formatos disponibles por plataforma en el diálogo de programación. */
export const postFormats = {
  instagram: ['Reel', 'Carrusel', 'Imagen', 'Story'],
  youtube: ['Vídeo largo', 'Short', 'Directo'],
  linkedin: ['Artículo', 'Carrusel', 'Texto', 'Vídeo'],
}

/** Metadatos de cada estudio de creación. */
export const platforms = {
  instagram: { id: 'instagram', label: 'Instagram', handle: '@bitaxus', audience: '128K seguidores' },
  youtube: { id: 'youtube', label: 'YouTube', handle: '@bitaxus', audience: '41.2K suscriptores' },
  linkedin: { id: 'linkedin', label: 'LinkedIn', handle: 'company/bitaxus', audience: '23.8K contactos' },
}

/** KPIs por plataforma para los estudios de YouTube y LinkedIn. */
export const platformKpis = {
  youtube: [
    { id: 'vistas', label: 'Vistas', value: '218.7K', delta: '+16.4%', trend: 'up', caption: 'vs mes anterior', icon: 'eye' },
    { id: 'retencion', label: 'Retención media', value: '42.1%', delta: '+2.3%', trend: 'up', caption: 'sobre promedio', icon: 'heart' },
    { id: 'suscriptores', label: 'Suscriptores', value: '+1,940', delta: '+9.8%', trend: 'up', caption: 'orgánico', icon: 'userPlus' },
    { id: 'clicks', label: 'Clicks en descripción', value: '3,120', caption: '11.4% conversión', icon: 'link' },
  ],
  linkedin: [
    { id: 'impresiones', label: 'Impresiones', value: '146.3K', delta: '+28.1%', trend: 'up', caption: 'vs mes anterior', icon: 'eye' },
    { id: 'interaccion', label: 'Interacción', value: '6.2%', delta: '+1.1%', trend: 'up', caption: 'sobre promedio', icon: 'heart' },
    { id: 'contactos', label: 'Nuevos contactos', value: '+870', delta: '+14.6%', trend: 'up', caption: 'orgánico', icon: 'userPlus' },
    { id: 'clicks', label: 'Clicks en enlace', value: '1,265', caption: '9.7% conversión', icon: 'link' },
  ],
}

/**
 * Noticias del sector, con prensa colombiana e internacional.
 *
 * ⚠ Son titulares de EJEMPLO atribuidos a medios reales, no noticias
 * publicadas. El panel lo advierte mientras no haya una fuente conectada.
 * `scope` separa lo local de lo global y `cover` marca las piezas destacadas.
 */
export const newsItems = [
  { id: 'n1', source: 'El Espectador', scope: 'co', minutes: 38, topic: 'Negocio', relevance: 'alta', platforms: [],
    cover: media.noticiaColombia,
    title: 'El comercio electrónico colombiano crece un 19% y las marcas mueven presupuesto a creadores',
    summary: 'Las compras en línea aceleran por segundo trimestre seguido y la inversión en creadores de contenido se lleva una porción creciente del gasto en publicidad digital.' },

  { id: 'n2', source: 'TechCrunch', scope: 'intl', minutes: 52, topic: 'Plataformas', relevance: 'alta', platforms: ['instagram'],
    cover: media.noticiaReels,
    title: 'Instagram amplía los Reels a 5 minutos para todas las cuentas',
    summary: 'El cambio llega a cuentas de cualquier tamaño y desplaza el formato hacia piezas más largas, con implicaciones directas para la retención media.' },

  { id: 'n3', source: 'Social Media Today', scope: 'intl', minutes: 96, topic: 'Algoritmo', relevance: 'alta', platforms: ['instagram'],
    cover: media.noticiaAlgoritmo,
    title: 'El alcance orgánico de los carruseles cae un 12% tras el último ajuste',
    summary: 'Los datos agregados de varias herramientas de analítica coinciden en una caída sostenida desde el cambio del mes pasado.' },

  { id: 'n4', source: 'La República', scope: 'co', minutes: 145, topic: 'Ventas', relevance: 'alta', platforms: [],
    cover: media.noticiaIa,
    title: 'Seis de cada diez agencias B2B en Colombia ya automatizan su prospección',
    summary: 'La automatización de mensajes directos y correos de primer contacto se generaliza entre agencias medianas del país.' },

  { id: 'n5', source: 'El Tiempo', scope: 'co', minutes: 200, topic: 'Regulación', relevance: 'media', platforms: ['instagram'],
    title: 'La SIC endurece las reglas de publicidad encubierta para creadores' },

  { id: 'n6', source: 'The Verge', scope: 'intl', minutes: 240, topic: 'Plataformas', relevance: 'media', platforms: ['linkedin'],
    title: 'LinkedIn prueba un feed de vídeo vertical al estilo TikTok' },

  { id: 'n7', source: 'Reuters', scope: 'intl', minutes: 320, topic: 'Negocio', relevance: 'media', platforms: [],
    title: 'La inversión publicitaria en vídeo corto superará a la de televisión en 2027' },

  { id: 'n8', source: 'Semana', scope: 'co', minutes: 420, topic: 'Formatos', relevance: 'media', platforms: ['youtube'],
    title: 'Los pódcast en video se consolidan como el formato de mayor crecimiento en Colombia' },

  { id: 'n9', source: 'Search Engine Land', scope: 'intl', minutes: 500, topic: 'Algoritmo', relevance: 'baja', platforms: ['youtube'],
    title: 'YouTube prioriza los Shorts con mayor retención en los primeros tres segundos' },

  { id: 'n10', source: 'Portafolio', scope: 'co', minutes: 610, topic: 'Negocio', relevance: 'baja', platforms: [],
    title: 'Las pymes colombianas destinan el 8% de su presupuesto de marketing a redes' },

  { id: 'n11', source: 'Ad Age', scope: 'intl', minutes: 700, topic: 'Negocio', relevance: 'baja', platforms: [],
    title: 'Los creadores B2B duplican su ticket medio de patrocinio' },

  { id: 'n12', source: 'Blog de YouTube', scope: 'intl', minutes: 130, topic: 'Plataformas', relevance: 'alta',
    platforms: ['youtube'],
    title: 'YouTube Studio estrena informes de retención comparada entre vídeos',
    summary: 'El panel de creadores permite ahora contrastar la curva de retención de varios vídeos a la vez para encontrar el patrón de los que funcionan.' },

  { id: 'n13', source: 'LinkedIn Blog', scope: 'intl', minutes: 275, topic: 'Plataformas', relevance: 'alta',
    platforms: ['linkedin'],
    title: 'LinkedIn abre las analíticas de publicación a las páginas pequeñas',
    summary: 'Las páginas de empresa por debajo de mil seguidores acceden por primera vez al desglose de impresiones y procedencia de la audiencia.' },
]

/** Temas seguidos, con volumen y tendencia (sección Investigación → Temas). */
export const topics = [
  { id: 't1', name: 'Embudos de venta B2B', volume: 12400, trend: 18, posts: 9 },
  { id: 't2', name: 'Ofertas high-ticket', volume: 8600, trend: 27, posts: 6 },
  { id: 't3', name: 'Automatización de DMs', volume: 5300, trend: 44, posts: 4 },
  { id: 't4', name: 'Prospección en frío', volume: 4100, trend: -6, posts: 3 },
  { id: 't5', name: 'Escalado de agencias', volume: 3800, trend: 12, posts: 5 },
  { id: 't6', name: 'Personal branding técnico', volume: 2900, trend: -14, posts: 2 },
]

/** Rendimiento comparado por formato (sección Investigación → Formatos). */
export const formatStats = [
  { id: 'f1', name: 'Reel', posts: 18, reach: '212.4K', engagement: 5.4, retention: 58, best: 'Ganchos de 3 segundos' },
  { id: 'f2', name: 'Carrusel', posts: 12, reach: '96.8K', engagement: 6.1, retention: 71, best: 'Guías paso a paso' },
  { id: 'f3', name: 'Imagen', posts: 8, reach: '41.2K', engagement: 3.2, retention: 45, best: 'Citas y resultados' },
  { id: 'f4', name: 'Story', posts: 34, reach: '33.9K', engagement: 8.7, retention: 62, best: 'Encuestas y preguntas' },
]

/** Cuentas vigiladas (sección Estadísticas → Competidores). */
export const competitors = [
  { id: 'c1', handle: '@growthopsdaily', followers: '204K', growth: 3.1, engagement: 3.8, cadence: '6/semana', focus: 'Operaciones de agencia' },
  { id: 'c2', handle: '@b2bfunnelguy', followers: '156K', growth: 5.4, engagement: 4.9, cadence: '5/semana', focus: 'Embudos y CRO' },
  { id: 'c3', handle: '@salesdmpro', followers: '98K', growth: -1.2, engagement: 2.6, cadence: '3/semana', focus: 'Prospección por DM' },
  { id: 'c4', handle: '@offerarchitect', followers: '87K', growth: 7.8, engagement: 6.3, cadence: '4/semana', focus: 'Diseño de oferta' },
]

/** Celdas de la cuadrícula 3×3. `scheduleId` enlaza con una publicación programada. */
export const initialFeedSlots = [
  {
    id: 'slot-1',
    image: media.erroresEvitar,
    alt: 'Los 3 errores más caros',
    format: 'reel',
    scheduleId: 'post-manana',
    title: '3 errores al escalar tu oferta high-ticket',
    stats: ['♥ Pred: 4.5K', '💬 Optimizado'],
  },
  {
    id: 'slot-2',
    image: media.embudoB2B,
    alt: 'Guía del embudo de ventas B2B',
    format: 'carousel',
    title: 'Guía embudo de ventas B2B',
    stats: ['♥ 3,840', '💬 412'],
  },
  {
    id: 'slot-3',
    image: media.estrategiasDigitales,
    alt: 'Estrategias digitales por etapa',
    format: 'reel',
    scheduleId: 'post-jueves',
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    note: 'Listo para auto-publicar',
  },
  {
    id: 'slot-4',
    image: media.frameworkContenido,
    alt: 'Framework de 5 pasos para contenido B2B',
    title: 'Framework 5 pasos contenido B2B',
    stats: ['♥ 2,910', '💬 280'],
  },
  {
    id: 'slot-5',
    image: media.casoEstudio,
    alt: 'Caso de estudio: de 0 a 50K MRR',
    format: 'reel',
    title: 'Caso de estudio: De 0 a $50K',
    stats: ['▶ 112K', '♥ 8.9K'],
  },
  {
    id: 'slot-6',
    image: media.herramientasAgencias,
    alt: '7 herramientas para agencias',
    format: 'carousel',
    title: '7 Herramientas para Agencias',
    stats: ['♥ 3,120', '💬 319'],
  },
  {
    id: 'slot-7',
    image: media.operadorFundador,
    alt: 'Mentalidad de operador vs fundador',
    format: 'reel',
    title: 'Mentalidad de Operador vs Fundador',
    stats: ['♥ 4,210', '💬 195'],
  },
  {
    id: 'slot-8',
    image: media.reflexionBitaxus,
    alt: 'Por qué creé Bitaxus',
    title: 'Reflexión: Por qué creé Bitaxus',
    stats: ['♥ 5,140', '💬 524'],
  },
]

/** Cada herramienta trae varias tandas de resultados para el botón "Generar otra tanda". */
export const contentTools = [
  {
    id: 'hooks',
    webhook: 'generateHooks',
    method: 'POST',
    icon: 'sparkles',
    title: 'Hooks & Copies',
    description: 'Ganchos virales con predicción de retención para Reels en segundos.',
    action: 'Generar ideas',
    resultLabel: 'Retención estimada',
    batches: [
      [
        { text: 'Cobré $50K sin una sola llamada de ventas. Así lo hice:', metric: '78%' },
        { text: 'Tu oferta no es cara. Tu oferta no se entiende.', metric: '71%' },
        { text: 'Dejé de publicar todos los días y crecí el triple.', metric: '69%' },
        { text: 'El error de los $10K que casi cierra mi agencia.', metric: '64%' },
      ],
      [
        { text: '3 frases que suben tu ticket un 40% en la misma llamada.', metric: '74%' },
        { text: 'Si tu DM empieza así, ya perdiste la venta.', metric: '70%' },
        { text: 'Nadie compra tu servicio. Compran no tener el problema.', metric: '67%' },
        { text: 'Lo que un cliente de $30K me dijo al rechazarme.', metric: '62%' },
      ],
    ],
  },
  {
    id: 'hashtags',
    webhook: 'inspectHashtags',
    method: 'POST',
    icon: 'hashtag',
    title: 'Inspector de Hashtags',
    description: 'Clusters de etiquetas con métricas de baja competencia y buen volumen.',
    action: 'Analizar tags',
    resultLabel: 'Competencia',
    batches: [
      [
        { text: '#ventasb2b · 84K publicaciones', metric: 'Baja' },
        { text: '#agenciademarketing · 212K publicaciones', metric: 'Media' },
        { text: '#ofertairresistible · 31K publicaciones', metric: 'Baja' },
        { text: '#highticketsales · 156K publicaciones', metric: 'Media' },
      ],
      [
        { text: '#embudodeventas · 97K publicaciones', metric: 'Baja' },
        { text: '#negociosdigitales · 480K publicaciones', metric: 'Alta' },
        { text: '#prospeccionb2b · 22K publicaciones', metric: 'Baja' },
        { text: '#consultoriadeventas · 64K publicaciones', metric: 'Baja' },
      ],
    ],
  },
  {
    id: 'dms',
    webhook: 'dmFlows',
    method: 'GET',
    icon: 'chat',
    title: 'Automatización DMs',
    description: 'Respuestas y entrega automática de lead magnets a comentarios clave.',
    action: 'Ver flujos',
    resultLabel: 'Estado',
    batches: [
      [
        { text: 'Comentario "GUIA" → envía PDF Embudo B2B', metric: 'Activo' },
        { text: 'Comentario "AUDIT" → agenda diagnóstico', metric: 'Activo' },
        { text: 'Nuevo seguidor → mensaje de bienvenida', metric: 'Pausado' },
        { text: 'Historia respondida → secuencia de 3 mensajes', metric: 'Borrador' },
      ],
      [
        { text: 'Comentario "PLANTILLA" → envía Notion de guiones', metric: 'Activo' },
        { text: 'Mención en story → agradecimiento + oferta', metric: 'Activo' },
        { text: 'Palabra "precio" en DM → deriva a llamada', metric: 'Pausado' },
        { text: 'Sin respuesta en 48h → recordatorio único', metric: 'Borrador' },
      ],
    ],
  },
]

export const topReels = [
  {
    id: 'reel-1',
    image: media.casoEstudio,
    title: 'Caso de estudio: De 0 a $50K MRR',
    views: '112.4K',
    retention: 68,
    likes: '8.9K',
    shares: '894',
    comments: '412',
    saves: '2,180',
    duration: '58s',
  },
  {
    id: 'reel-2',
    image: media.estrategiasDigitales,
    title: 'Por qué no vender por mensaje directo',
    views: '84.5K',
    retention: 54,
    likes: '6.2K',
    shares: '512',
    comments: '298',
    saves: '1,470',
    duration: '43s',
  },
  {
    id: 'reel-3',
    image: media.carruseles,
    title: 'Estructura ganadora para carruseles',
    views: '61.3K',
    retention: 49,
    likes: '4.1K',
    shares: '340',
    comments: '187',
    saves: '1,020',
    duration: '37s',
  },
  {
    id: 'reel-4',
    image: media.operadorFundador,
    title: 'Mentalidad de Operador vs Fundador',
    views: '48.7K',
    retention: 45,
    likes: '3.4K',
    shares: '221',
    comments: '154',
    saves: '860',
    duration: '51s',
  },
  {
    id: 'reel-5',
    image: media.herramientasAgencias,
    title: '7 Herramientas para Agencias',
    views: '39.2K',
    retention: 41,
    likes: '2.8K',
    shares: '176',
    comments: '119',
    saves: '640',
    duration: '64s',
  },
]

export const channelAverageRetention = 58
