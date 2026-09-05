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
      // Gate de cobertura por trinquete: suelo medido menos holgura, no el objetivo.
      // La atribución de `functions` de v8 varía entre ejecuciones (~66-70% observado),
      // así que se fija por debajo a propósito. Subir por escalones, nunca bajar.
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 60,
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
      // Nuxt's virtual module has no implementation outside Nuxt; the stub
      // records useHead/useSeoMeta payloads so the SEO head can be asserted.
      '#imports': path.resolve(__dirname, 'tests/stubs/nuxt-imports.ts'),
    },
  },
})