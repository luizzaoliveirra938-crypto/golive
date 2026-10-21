import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

const isNetlify = process.env.NETLIFY === 'true'

export default defineConfig({
  plugins: isNetlify
    ? [react()]
    : [react(), cloudflare({ viteEnvironment: { name: 'worker' } })],
  ...(isNetlify
    ? {}
    : {
        environments: {
          worker: { build: { sourcemap: true } },
        },
      }),
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '0.0.0.0', port: 5173 },
})
