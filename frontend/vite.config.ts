import { solidStart } from '@solidjs/start/config'
import { nitroV2Plugin as nitro } from '@solidjs/vite-plugin-nitro-2'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solidStart(), tailwindcss(), nitro()],
  resolve: {
    alias: {
      '@Src': '/src',
      '@Components': '/src/components',
      '@Lib': '/src/lib',
      '@Api': '/src/lib/api',
      '@Utils': '/src/lib/utils',
      '@Hooks': '/src/lib/hooks',
    },
  },
  server: {
    port: 3000,
  },
})
