/**
 * Cliente de n8n para el dashboard.
 *
 * El panel habla con n8n **solo a través de webhooks**, nunca con la Public API
 * (`/api/v1`). Hay dos razones, y las dos importan:
 *
 * 1. La clave de la Public API es de instancia: incrustarla en un bundle de Vite
 *    la deja a la vista de cualquiera que abra las herramientas de desarrollo.
 * 2. Aunque se aceptara ese riesgo, no funcionaría desde el navegador: el CORS
 *    de n8n (`packages/cli/src/middlewares/cors.ts`) devuelve un
 *    `Access-Control-Allow-Headers` que no incluye `x-n8n-api-key`, así que el
 *    preflight de la petición falla.
 *
 * Los nodos Webhook, en cambio, declaran `supportsCORS` y traen su propia opción
 * de orígenes permitidos y de autenticación, que es justo lo que necesita un
 * frontend. Lo que el panel necesite leer de n8n se expone desde un workflow con
 * un nodo "Respond to Webhook".
 */

const rawBase = import.meta.env.VITE_N8N_BASE_URL ?? ''
const baseUrl = rawBase.replace(/\/+$/, '')

/** Token opcional; solo tiene sentido si el webhook usa Header Auth. */
const token = import.meta.env.VITE_N8N_WEBHOOK_TOKEN ?? ''

/** Las URLs de test solo responden con el workflow abierto y a la escucha en el editor. */
const segment = import.meta.env.VITE_N8N_TEST_WEBHOOKS === 'true' ? 'webhook-test' : 'webhook'

const TIMEOUT_MS = 10000

export const WEBHOOKS = {
  schedulePost: 'bitaxus/schedule-post',
  cancelPost: 'bitaxus/cancel-post',
  saveFeedOrder: 'bitaxus/feed-order',
  dmFlows: 'bitaxus/dm-flows',
}

export class N8nError extends Error {
  constructor(message, { status = null, cause = null } = {}) {
    super(message)
    this.name = 'N8nError'
    this.status = status
    this.cause = cause
  }
}

/** Sin `VITE_N8N_BASE_URL` el panel funciona en modo local, sin tocar n8n. */
export function isConnected() {
  return baseUrl !== ''
}

export function webhookUrl(path) {
  return `${baseUrl}/${segment}/${path}`
}

export async function callWebhook(path, { method = 'POST', body, query } = {}) {
  if (!isConnected()) {
    throw new N8nError('n8n no está configurado (define VITE_N8N_BASE_URL)')
  }

  const url = new URL(webhookUrl(path), window.location.origin)
  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value))
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })

    if (!response.ok) {
      // 404 en un webhook casi siempre significa workflow inactivo, no ruta inexistente.
      const hint =
        response.status === 404
          ? 'workflow inactivo o ruta incorrecta'
          : await response.text().catch(() => '')

      throw new N8nError(`n8n respondió ${response.status}${hint ? `: ${hint}` : ''}`, {
        status: response.status,
      })
    }

    // Un webhook en modo "Immediately" contesta sin cuerpo JSON.
    const text = await response.text()
    if (!text) return null

    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch (error) {
    if (error instanceof N8nError) throw error
    if (error.name === 'AbortError') {
      throw new N8nError(`n8n no respondió en ${TIMEOUT_MS / 1000}s`, { cause: error })
    }
    // fetch solo da "Failed to fetch" ante red caída, TLS o CORS bloqueado.
    throw new N8nError(`No se pudo contactar con n8n (${error.message})`, { cause: error })
  } finally {
    clearTimeout(timer)
  }
}
