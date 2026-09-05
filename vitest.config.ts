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
      // Subir por escalones, nunca bajar. Medido tras integrar auth/KYC:
      // 99.17 statements / 93.70 branches / 96.46 functions / 99.17 lines.
      // La atribución de `functions` de v8 varía entre ejecuciones, así que
      // conserva más holgura que las demás.
      thresholds: {
        statements: 95,
        branches: 88,
        functions: 85,
        lines: 95,
      },
      include: [
        'app/components/**',
        'app/composables/**',
        // Helpers de validación de auth/KYC: tienen tests propios, entran al gate.
        'app/utils/**',
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
