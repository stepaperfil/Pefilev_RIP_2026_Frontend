import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        proxyTimeout: 30000,
        configure(proxy) {
          proxy.on('error', (_error, _request, response) => {
            if ('writeHead' in response && !response.headersSent) {
              response.writeHead(502, { 'Content-Type': 'application/json' })
              response.end(JSON.stringify({ error: 'Веб-сервис недоступен' }))
            }
          })
        },
      },
      '/tco-assets/': { target: 'http://127.0.0.1:9000', changeOrigin: true },
    },
  },
})
