import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path is driven by .env so that moving between a project page
// (manik1848.github.io/Github-Portfolio) and a user page
// (manik1848.github.io) is a one-line change. See README.
const dir = fileURLToPath(new URL('.', import.meta.url))
const page = (p: string) => resolve(dir, p)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE || '/',
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        // Multi-page build: each case study is a real page with its own
        // <title> and Open Graph tags, not a client-side route.
        input: {
          main: page('index.html'),
          tenantIsolation: page('case/tenant-isolation/index.html'),
          videoPipeline: page('case/video-pipeline/index.html'),
          dispatchEngine: page('case/dispatch-engine/index.html'),
        },
      },
    },
  }
})
