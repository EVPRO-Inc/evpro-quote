import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path defaults to root (dev, Vercel). The GitHub Pages build sets
// BASE_PATH=/evpro-quote/ because Pages serves from a repo subpath.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
