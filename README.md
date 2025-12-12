# Nuxt Minimal Starter (Hermes Landing)

This repository is a small Nuxt 4 landing site scaffold used for demos and local development.

Refer to the Nuxt docs for deep dives: https://nuxt.com/docs/getting-started/introduction

## Quickstart (bun)

This project uses `bun` as the package manager and task runner. Use the commands below for typical workflows.

Install dependencies:

```bash
bun install
```

Start dev server (http://localhost:3000):

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Preview production build locally:

```bash
bun run preview
```

## Testing

Run unit tests (Vitest):

```bash
bun run test
```

Run tests in watch mode:

```bash
bun run test:watch
```

Run tests with coverage (minimum 80% threshold):

```bash
bun run test:coverage
```

Notes:
- Tests use global stubs from `vitest.setup.ts`. If a test needs the real `useI18n` composable, it explicitly replaces the global stub (see `tests/pages/landing.i18n.spec.ts`).

Additional Notes:
- `/.well-known` handling: Some clients (for example Chrome DevTools or browser extensions) request `/.well-known/appspecific/com.chrome.devtools.json`. Missing that file can produce 404s or router warnings in logs. We provide a minimal placeholder in `public/.well-known/appspecific/com.chrome.devtools.json` and a lightweight middleware (`server/middleware/wellknown.ts`) that serves `/.well-known/*` from `public/` to avoid noisy logs. Keep this in mind when deploying to production: ensure the `public/.well-known` folder is included in your artifact or keep the middleware enabled.
- Test stubs: `vitest.setup.ts` contains global stubs used across tests (`useState`, `useRequestHeaders`, `useI18n`, `definePageMeta`, and `useHead`). These stubs keep component mounts lightweight; tests that require the real composable should reassign the global stub within the test.

## Layouts

This project uses Nuxt file-based layouts under `app/layouts/` to provide different page scaffolds (for example `landing.vue`, `auth.vue`, `dashboard.vue`, `kyc.vue`).

- `app/layouts/landing.vue`: layout used by the public landing pages. Includes header/footer and section container.
- `app/layouts/auth.vue`: used by authentication pages such as `signin` and `signup`.
- `app/layouts/dashboard.vue` and `app/layouts/kyc.vue`: used for authenticated parts of the app.

When adding pages, choose the appropriate layout by placing the page under `app/pages/` and specifying `definePageMeta({ layout: 'auth' })` if you need a non-default layout.

## Configuration and tips

- Nuxt configuration is in `nuxt.config.ts`.
- Tailwind CSS lives in `assets/css/tailwind.css`.
- Keep presentational subcomponents in nested folders; coverage only includes top-level section components and composables.

If you need a runtime secret or deployment key, ask a maintainer — do not invent secrets.
