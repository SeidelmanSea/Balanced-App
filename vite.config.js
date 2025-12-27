import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon.svg'],
            manifest: {
                name: 'Balanced Portfolio',
                short_name: 'Balanced',
                description: 'Privacy-first portfolio management and rebalancing tool.',
                theme_color: '#10b981',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-icon.svg',
                        sizes: '192x192 512x512',
                        type: 'image/svg+xml'
                    },
                    {
                        src: 'pwa-icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
    },
})
