/// <reference types='vitest' />
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite')
  return {
    root: __dirname,
    envDir: path.resolve(__dirname, '../../'),
    cacheDir: '../../node_modules/.vite/apps/platform',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4200,
      host: 'localhost',
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@artelonline/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@artelonline/shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@artelonline/config': path.resolve(__dirname, '../../packages/config/src'),
        '@artelonline/routing': path.resolve(__dirname, '../../packages/routing/src'),
      },
    },
    ssr: {
      noExternal: ['@tailwindcss/vite'],
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['@tanstack/react-router'],
            query: ['@tanstack/react-query'],
            ui: ['@artelonline/ui'],
            utils: ['date-fns', 'clsx', 'tailwind-merge'],
          },
        },
      },
    },
    test: {
      name: '@artelonline/platform',
      watch: false,
      globals: true,
      environment: 'jsdom',
      setupFiles: ['../../packages/config/src/lib/test-setup.ts'],
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  }
})
