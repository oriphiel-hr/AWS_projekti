// uslugar/frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Automatski JSX runtime – ne treba "import React from 'react'" po fajlovima
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic'
  }
})
