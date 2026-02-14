import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/expense-tracker-2026-ios/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/*.png'],
      manifest: {
        name: 'Celi Expenses',
        short_name: 'Celi',
        description: 'Kakeibo-style expense tracker 2026',
        theme_color: '#ff6b9d',
        background_color: '#fef9f0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/expense-tracker-2026-ios/',
        scope: '/expense-tracker-2026-ios/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
