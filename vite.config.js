import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'

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
        }),
        Sitemap({
            hostname: 'https://www.balanced-portfolio.com',
            dynamicRoutes: [
                '/app',
                '/about',
                '/faq',
                '/calculators',
                '/calculators/emergency-fund',
                '/calculators/asset-allocation',
                '/calculators/rebalance-frequency',
                '/resources',
                '/resources/portfolio-rebalancing-guide',
                '/resources/tax-efficient-investing',
                '/resources/emergency-fund-guide'
            ]
        })
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
    },
})
