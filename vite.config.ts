import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves from https://<user>.github.io/orbit-calendar/
export default defineConfig({
  base: '/orbit-calendar/',
  plugins: [react(), tailwindcss()],
})
