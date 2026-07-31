import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base path para GitHub Pages: el sitio se sirve desde
// https://JCBarboG.github.io/SCARE/, no desde la raíz del dominio.
// Si en el futuro usas un dominio propio, cambia esto a '/'.
const BASE_PATH = process.env.VITE_BASE_PATH || '/SCARE/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: false, // usamos public/manifest.json propio
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
