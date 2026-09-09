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
}

export const kpis = [
  {
    id: 'alcance',
    label: 'Alcance Total',
    value: '384.2K',
    delta: '+24.6%',
    caption: 'vs mes anterior',
    icon: 'eye',
  },
  {
    id: 'engagement',
    label: 'Engagement',
    value: '4.8%',
    delta: '+0.6%',
    caption: 'sobre promedio',
    icon: 'heart',
  },
  {
    id: 'seguidores',
    label: 'Nuevos Seguidores',
    value: '+3,820',
    delta: '+18.2%',
    caption: 'orgánico',
    icon: 'userPlus',
  },
  {
    id: 'clicks',
    label: 'Clicks en Enlace',
    value: '1,840',
    caption: '14.2% conversión',
    icon: 'link',
  },
]

/**
 * Celdas de la cuadrícula 3×3. `schedule.tone` distingue la próxima publicación
 * (verde) del resto de la cola (gris).
 */
export const feedSlots = [
  {
    id: 1,
    image: media.erroresEvitar,
    alt: 'Los 3 errores que debes evitar',
    format: 'reel',
    schedule: { label: 'Mañana 19:00', tone: 'next' },
    title: '3 errores al escalar tu oferta high-ticket',
    stats: ['♥ Pred: 4.5K', '💬 Optimizado'],
  },
  {
    id: 2,
    image: media.embudoDominio,
    alt: 'Embudo de ventas: dominando cada etapa',
    format: 'carousel',
    title: 'Guía embudo de ventas B2B',
    stats: ['♥ 3,840', '💬 412'],
  },
  {
    id: 3,
    image: media.embudoEstrategias,
    alt: 'Embudo de ventas con estrategias digitales',
    format: 'reel',
    schedule: { label: 'Jueves 20:00', tone: 'queued' },
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    note: 'Listo para auto-publicar',
  },
  {
    id: 4,
    image: media.embudoEstrategias,
    alt: 'Framework de contenido B2B',
    title: 'Framework 5 pasos contenido B2B',
    stats: ['♥ 2,910', '💬 280'],
  },
  {
    id: 5,
    image: media.erroresEvitar,
    alt: 'Caso de estudio de crecimiento',
    format: 'reel',
    title: 'Caso de estudio: De 0 a $50K',
    stats: ['▶ 112K', '♥ 8.9K'],
  },
  {
    id: 6,
    image: media.embudoDominio,
    alt: 'Herramientas para agencias',
    format: 'carousel',
    title: '7 Herramientas para Agencias',
    stats: ['♥ 3,120', '💬 319'],
  },
  {
    id: 7,
    image: media.erroresEvitar,
    alt: 'Mentalidad de operador',
    format: 'reel',
    title: 'Mentalidad de Operador vs Fundador',
    stats: ['♥ 4,210', '💬 195'],
  },
  {
    id: 8,
    image: media.avatar,
    alt: 'Reflexión personal',
    title: 'Reflexión: Por qué creé Bitaxus',
    stats: ['♥ 5,140', '💬 524'],
  },
]

export const contentTools = [
  {
    id: 'hooks',
    icon: 'sparkles',
    title: 'Hooks & Copies',
    description: 'Ganchos virales con predicción de retención para Reels en segundos.',
    action: 'Generar ideas',
  },
  {
    id: 'hashtags',
    icon: 'hashtag',
    title: 'Inspector de Hashtags',
    description: 'Clusters de etiquetas con métricas de baja competencia y buen volumen.',
    action: 'Analizar tags',
  },
  {
    id: 'dms',
    icon: 'chat',
    title: 'Automatización DMs',
    description: 'Respuestas y entrega automática de lead magnets a comentarios clave.',
    action: 'Ver flujos',
  },
]

/** `activity` gradúa el punto bajo cada día: cuánta actividad hay programada. */
export const week = [
  { id: 'lun', label: 'LUN', day: 24, activity: 'low' },
  { id: 'mar', label: 'MAR', day: 25, activity: 'today', isToday: true },
  { id: 'mie', label: 'MIÉ', day: 26, activity: 'low' },
  { id: 'jue', label: 'JUE', day: 27, activity: 'high' },
  { id: 'vie', label: 'VIE', day: 28, activity: 'low' },
  { id: 'sab', label: 'SÁB', day: 29, activity: 'none' },
  { id: 'dom', label: 'DOM', day: 30, activity: 'none' },
]

export const upcomingPosts = [
  {
    id: 'manana',
    when: 'Mañana · 19:00',
    format: 'Reel',
    title: '3 errores al escalar tu oferta high-ticket',
    score: '94% óptimo',
  },
  {
    id: 'jueves',
    when: 'Jueves · 20:30',
    format: 'Carrusel',
    title: 'Cómo cerrar ventas por DM sin sonar invasivo',
    score: '88% óptimo',
  },
]

export const freeSlot = {
  when: 'Sábado · 13:00 (Espacio libre)',
  suggestion: 'Sugerido: Story interactiva o encuesta',
}

export const topReels = [
  {
    id: 1,
    rank: 1,
    image: media.erroresEvitar,
    title: 'Caso de estudio: De 0 a $50K MRR',
    views: '112.4K vistas',
    retention: 68,
    likes: '8.9K',
    shares: '894 shares',
  },
  {
    id: 2,
    rank: 2,
    image: media.embudoEstrategias,
    title: 'Por qué no vender por mensaje directo',
    views: '84.5K vistas',
    retention: 54,
    likes: '6.2K',
    shares: '512 shares',
  },
  {
    id: 3,
    rank: 3,
    image: media.embudoDominio,
    title: 'Estructura ganadora para carruseles',
    views: '61.3K vistas',
    retention: 49,
    likes: '4.1K',
    shares: '340 shares',
  },
]

export const channelAverageRetention = 58
