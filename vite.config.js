import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.N8N_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // En desarrollo, apuntar VITE_N8N_BASE_URL a /n8n evita el CORS por completo:
      // las llamadas salen del mismo origen y Vite las reenvía a la instancia.
      proxy: target
        ? {
            '/n8n': {
              target,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/n8n/, ''),
            },
          }
        : undefined,
    },
  }
})
