import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      all: true,
      // Gate de cobertura por trinquete: fijado al suelo real medido, no al objetivo.
      // Objetivo 80/80/80/80 — subir por escalones a medida que entren tests, nunca bajar.
      thresholds: {
        statements: 90,
        branches: 57,
        functions: 23,
        lines: 90,
      },
      include: [
        'app/components/**',
        'app/composables/**',
      ],
      exclude: [
        // Exclude nested section subfolders to avoid counting purely presentational files
        'app/components/Benefits/**',
        'app/components/Contact/**',
        'app/components/Features/**',
        'app/components/Navbar/**',
        'app/components/OurPurpose/**',
        'app/components/Pricing/**',
        'app/components/WhoWeAre/**',
        'nuxt.config.ts',
        'eslint.config.mjs',
        'tsconfig.json',
        'Dockerfile',
        'docker-compose.yaml',
        'README.md',
        'scripts/**',
        'public/**',
        'assets/**',
        'locales/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
      '@': path.resolve(__dirname, 'app'),
    },
  },
})