/// <reference types='vitest' />
import * as path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite')
  return {
    root: __dirname,
    envDir: path.resolve(__dirname, '../../'),
    cacheDir: '../../node_modules/.vite/apps/marketing',
    server: {
      port: 4202,
      host: 'localhost',
    },
    preview: {
      port: 4202,
      host: 'localhost',
    },
    plugins: [react(), tailwindcss()],
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
    },
    test: {
      name: '@artelonline/marketing',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  }
})
