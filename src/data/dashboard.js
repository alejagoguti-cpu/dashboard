/**
 * Datos de demostración del panel de Instagram. Todo el contenido mostrado en la
 * interfaz vive aquí para que sustituirlo por una API real solo implique cambiar
 * este módulo.
 */

const CDN = 'https://lh3.googleusercontent.com/aida-public'

export const media = {
  avatar: `${CDN}/AB6AXuBf7zMQkf5DWSmifUcbAUDkTdF74VgsqX_pdmhFAyGFdFW1glgAR-LdUWsHEXZNo1txRXDYg3BT3DuXEEzJsjgy_GMuX_qZpA22Jrgzq7cENxsoxU3dVjBbzvTCX5WAMDcnHuqT-CVCXGFhuHQDxdo07v8-CDnENnDTq3XC6bd2io0h2KfqeZ12zejDFzGDbK3Dp2bEcYwvXjgrQOJ7EA_acKI0ily0FkINRHkFzGmWwsyAA-jMZQbj`,
  erroresEvitar: `${CDN}/AB6AXuBtvK1BU9SvDcab2LDbTeadTFQEG7z9iEXgeOo-n_E8MQLxI7Ynaonxk2XWC9RGk2ZJbiuFmom2cEZwSxrE2mkBIvB5Kw9hToNVLYumN5g55mMedB0GC4bwjKlH27l4ZJpAykk66_3XStD8YRgQaiQBp1pRgqVkKfH7QXaMMFrFssPQurUj-rJ0kMxWMpc_r52epvkJFW8OeH4DyHN9qT24Varfy_2ok2QJixkBBpnBkXRm87a-dont`,
  embudoDominio: `${CDN}/AB6AXuBDTy1crc_OJlnz0hYAlJQ3diel17K5e7YTvpV75fIf6z81hz61kAcAx_I_dEcaUR3pwSjjSWTJmZtPTxIzAjHTATzlVXI20-hM8Mw0xvE7dKyKz1dzDt_G50JqrUZawtPzcLy0WNGECseRxwO8ylMGKUG1PWtkLaa_f5WzbwBNMUMZ4KFo_6WEEuGGHihQbQYNJt-KJb6zIm526oNwetOdFKICyBJ9p_JEz5_fAW4KAn2QJs_-YCo4`,
  embudoEstrategias: `${CDN}/AB6AXuDtn-OvYDlh_PPMmcDnzNHTtCsyFdzjoKcT2aos3ISn_YxEUUZ8xyvlCgFa_mnN8WDGvX4944UZNbESiCZ-Q5L01KbKK1nkDFopJnPXGj9MhV16Saby6WLavVvBZLpGc7EkdIZu2jZJH9YesxdEZgqlzxHVwyswoSnOV7u-8VYTxT0rpy1gkTg8hsbdSUnlR4LCHvoung9Q0BYawsY7KeBowPcwMasved2menYw6x6JUGXsKG0fWyx5`,
}

export const account = {
  name: 'Marcos Razzetti',
  handle: '@marcosrazzetti',
  posts: 42,
  followers: '128K',
  avatar: media.avatar,
  profileUrl: 'https://www.instagram.com/marcosrazzetti/',
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
export const initialScheduledPosts = [
  {
    id: 'post-manana',
    at: '2026-08-26T19:00',
    format: 'Reel',
    title: '3 errores al escalar tu oferta high-ticket',
    score: 94,
  },
  {
    id: 'post-jueves',
    at: '2026-08-27T20:30',
    format: 'Carrusel',
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    score: 88,
  },
]

export const freeSlot = {
  at: '2026-08-29T13:00',
  suggestion: 'Sugerido: Story interactiva o encuesta',
}

export const postingWindow = '19:00 - 21:30'

export const postFormats = ['Reel', 'Carrusel', 'Imagen', 'Story']

/** Celdas de la cuadrícula 3×3. `scheduleId` enlaza con una publicación programada. */
export const initialFeedSlots = [
  {
    id: 'slot-1',
    image: media.erroresEvitar,
    alt: 'Los 3 errores que debes evitar',
    format: 'reel',
    scheduleId: 'post-manana',
    title: '3 errores al escalar tu oferta high-ticket',
    stats: ['♥ Pred: 4.5K', '💬 Optimizado'],
  },
  {
    id: 'slot-2',
    image: media.embudoDominio,
    alt: 'Embudo de ventas: dominando cada etapa',
    format: 'carousel',
    title: 'Guía embudo de ventas B2B',
    stats: ['♥ 3,840', '💬 412'],
  },
  {
    id: 'slot-3',
    image: media.embudoEstrategias,
    alt: 'Embudo de ventas con estrategias digitales',
    format: 'reel',
    scheduleId: 'post-jueves',
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    note: 'Listo para auto-publicar',
  },
  {
    id: 'slot-4',
    image: media.embudoEstrategias,
    alt: 'Framework de contenido B2B',
    title: 'Framework 5 pasos contenido B2B',
    stats: ['♥ 2,910', '💬 280'],
  },
  {
    id: 'slot-5',
    image: media.erroresEvitar,
    alt: 'Caso de estudio de crecimiento',
    format: 'reel',
    title: 'Caso de estudio: De 0 a $50K',
    stats: ['▶ 112K', '♥ 8.9K'],
  },
  {
    id: 'slot-6',
    image: media.embudoDominio,
    alt: 'Herramientas para agencias',
    format: 'carousel',
    title: '7 Herramientas para Agencias',
    stats: ['♥ 3,120', '💬 319'],
  },
  {
    id: 'slot-7',
    image: media.erroresEvitar,
    alt: 'Mentalidad de operador',
    format: 'reel',
    title: 'Mentalidad de Operador vs Fundador',
    stats: ['♥ 4,210', '💬 195'],
  },
  {
    id: 'slot-8',
    image: media.avatar,
    alt: 'Reflexión personal',
    title: 'Reflexión: Por qué creé Bitaxus',
    stats: ['♥ 5,140', '💬 524'],
  },
]

/** Cada herramienta trae varias tandas de resultados para el botón "Generar otra tanda". */
export const contentTools = [
  {
    id: 'hooks',
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
    image: media.erroresEvitar,
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
    image: media.embudoEstrategias,
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
    image: media.embudoDominio,
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
    image: media.erroresEvitar,
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
    image: media.embudoDominio,
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
