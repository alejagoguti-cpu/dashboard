/** Utilidades de fecha del panel. */

/**
 * Hoy. El diseño original fijaba la semana del 24 al 30 de agosto de 2026, pero
 * con un calendario mensual navegable y publicaciones programables esa fecha
 * congelada dejaba la cola siempre en el pasado. Las publicaciones de
 * demostración se sitúan en relación con este valor.
 */
export const REFERENCE_TODAY = new Date()

export const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

export const WEEKDAY_NAMES = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

/** Lunes de la semana a la que pertenece `date`. */
export function startOfWeek(date) {
  const monday = new Date(date)
  monday.setHours(0, 0, 0, 0)
  const weekday = (monday.getDay() + 6) % 7
  return addDays(monday, -weekday)
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Diferencia en días naturales entre dos fechas (b - a). */
export function daysBetween(a, b) {
  const left = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const right = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((right - left) / 86400000)
}

export function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

export function formatTime(value) {
  const date = toDate(value)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** "Hoy", "Mañana", "Jueves" o "12 sep" según la distancia con la referencia. */
export function formatDayLabel(value, today = REFERENCE_TODAY) {
  const date = toDate(value)
  const diff = daysBetween(today, date)

  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  if (diff === -1) return 'Ayer'
  if (diff > 1 && diff < 7) return WEEKDAY_NAMES[(date.getDay() + 6) % 7]

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/** Valor para un `<input type="date">`. */
export function toDateInput(value) {
  const date = toDate(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

/** Combina los valores de un `<input type="date">` y un `<input type="time">`. */
export function fromDateTimeInput(dateValue, timeValue) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hours, minutes] = timeValue.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes)
}
