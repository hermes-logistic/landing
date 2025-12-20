<!-- GitHub Copilot / AI Agent instructions for contributors -->

Este repositorio es un sitio de aterrizaje pequeño basado en Nuxt 4 y TypeScript. Este documento recopila prácticas actuales y cambios recientes importantes para que un agente AI o colaborador sea productivo sin pedir aclaraciones.

## Resumen rápido
- **Framework**: Nuxt 4 con TypeScript.
- **Administrador de paquetes**: `bun` (usar para todos los comandos y scripts).
- **Propósito**: Sitio de landing modular con secciones reutilizables.

## Puntos clave y estructura
- `app/`: páginas, componentes y composables.
- `assets/`: CSS y Tailwind (`assets/css/tailwind.css`).
- `locales/`: `en.json`, `es.json` para traducciones.
- `public/`: archivos públicos (robots, sitemap, images).

### Layouts
- Los layouts se encuentran en `app/layouts/` y proporcionan scaffolding por tipo de página.
- Layouts incluidos: `landing.vue`, `auth.vue`, `dashboard.vue`, `kyc.vue`.
- Para usar un layout distinto al por defecto, llama a `definePageMeta({ layout: 'auth' })` en la página.
- `landing.vue` incluye el header, footer y contenedor de secciones; `auth.vue` es minimal para formularios de sign-in/up.

### Componentes
- Componentes top-level en `app/components/` (por ejemplo `AppNavbar.vue`, `AppFooter.vue`, `HeroSection.vue`).
- Secciones compuestas en subcarpetas (p. ej. `Benefits/`, `Contact/`, `Features/`, `Pricing/`, `OurPurpose/`, `WhoWeAre/`).

## Workflows y comandos
- Instalar dependencias: `bun install`.
- Desarrollo: `bun run dev` (dev server por defecto en http://localhost:3000).
- Build: `bun run build`.
- Preview: `bun run preview`.
- Tests (Vitest): `bun run test`.
- Tests en watch: `bun run test:watch`.
- Coverage: `bun run test:coverage`.
- Lint: `bun run lint` / `bun run lint:fix`.

## Testing y stubs (cambios recientes)

- Framework: Vitest con Vue Test Utils y entorno `jsdom`.
- TypeScript config: `tsconfig.test.json` con reglas menos estrictas para archivos de test, referenciado desde `tsconfig.json`.
- Stubs globales: `vitest.setup.ts` declara stubs y helpers globales — importante para montar componentes sin necesidad de todas las dependencias de Nuxt.
  - Stubs comunes incluyen: `useState`, `useRequestHeaders`, `useI18n`, `NuxtLink`, `NuxtImage`, `useHead`, `definePageMeta`.
  - Usa `globalThis` (no `global`) para sobrescribir stubs en tests individuales.
- Uso del composable real en tests: algunos tests reemplazan deliberadamente el stub global por el composable real. Ejemplo: en `tests/pages/landing.i18n.spec.ts` se hace `globalThis.useI18n = realUseI18n` para validar traducciones reales.
- Recomendación: cuando montes componentes en tests, reutiliza los stubs compartidos desde `vitest.setup.ts`. Si necesitas el comportamiento real, reasigna en `globalThis` dentro del test.

## Notes on .well-known and test stubs

- `/.well-known` handling: Some clients (for example Chrome DevTools or browser extensions) may request `/.well-known/appspecific/com.chrome.devtools.json`. Missing that file can produce noisy 404s or router warnings in logs. We include a placeholder at `public/.well-known/appspecific/com.chrome.devtools.json` and a lightweight middleware (`server/middleware/wellknown.ts`) that serves `/.well-known/*` from `public/` to avoid log noise. Ensure this folder is deployed in production or keep the middleware enabled in Nitro.
- Test stubs: `vitest.setup.ts` contains shared stubs for tests (`useState`, `useRequestHeaders`, `useI18n`, `useHead`, `definePageMeta`) so components mount without Nuxt runtime. Tests that require real composables should overwrite the global stub inside the test.

## Cobertura
- Ámbito de cobertura: `app/components/**` (solo componentes top-level) y `app/composables/**`.
- Excluir carpetas de componentes puramente presentacionales (subcarpetas dentro de `app/components`) y archivos estáticos.
- Umbral mínimo: 80% para líneas, ramas, funciones y statements (configurado en `vitest.config.ts`).

## I18n
- Usar el composable `useI18n` en `app/composables/useI18n.ts`.
- Añadir claves en `locales/en.json` y `locales/es.json`.
- Para tests que requieren la selección de idioma por `navigator.language`, puedes simular `global.navigator` en el test.

## Routing y advertencias comunes
- Nuxt usa routing file-based por `app/pages/`.
- Si ves advertencias de Vue Router del tipo "No match found for location with path \"/forgot-password\"", añade una página simple en `app/pages/forgot-password.vue` que haga `router.replace('/signin')` o crea una ruta válida para evitar ruido en dev server.

## Buenas prácticas
- Usa `bun` para todos los comandos relacionados con el proyecto.
- No editar archivos generados en `.nuxt` o `.output`.
- Mantén los tests pequeños y usa stubs compartidos para evitar montar subcomponentes pesados.
- Documenta explícitamente cuando un test sobrescribe un stub global (usa `@ts-expect-error: explanation` si es necesario).

## Ejemplos rápidos
- Añadir página: crear `app/pages/contact.vue` con un template y export default.
- Reemplazar stub en test: importar el composable real, luego `global.useI18n = realUseI18n` (añadir comentario `@ts-expect-error` con explicación).

## Archivos relevantes
- `app/composables/useI18n.ts` — composable i18n.
- `vitest.setup.ts` — stubs y configuraciones globales para tests.
- `vitest.config.ts` — configuración de tests y coverage.
- `tsconfig.json` — configuración principal de TypeScript (referencias a sub-configs).
- `tsconfig.test.json` — configuración específica para tests con reglas menos estrictas.
- `nuxt.config.ts` — configuración de Nuxt y módulos.
- `Dockerfile` — imagen multi-stage con bun.

Si no estás seguro sobre un cambio no trivial, crea un PR pequeño con un repro mínimo y pide revisión de mantenedores.

