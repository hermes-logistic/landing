# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt 4 site for Hermes Logistics: a public marketing landing plus the first
screens of the web app (authentication and a KYC wizard). TypeScript, Tailwind
CSS, and `bun` as the package manager.

Two products share one Nuxt app, and the split matters:

- **The landing** (`/` and `/es`) is public, indexable, and performance-budgeted.
- **The web app** (`/signin`, `/signup`, `/confirm-email`, `/forgot-password`,
  `/kyc/**`) is behind the funnel: interactive screens, not content.

Most rules below differ between the two. When in doubt, ask which side you are on.

## Development Commands

```bash
# Package management (always use bun, NOT npm/yarn/pnpm — the repo has bun.lock)
bun install

# Development server (http://localhost:3000)
bun run dev

# Build for production
bun run build
bun run preview  # Preview production build

# Testing (Vitest + jsdom)
bun run test                                   # Run all tests
bun run test tests/components/HeroSection.spec.ts   # A single file
bun run test -t "validation"                   # Tests matching a name
bun run test:watch                             # Watch mode
bun run test:coverage                          # With coverage (thresholds must pass)

# Linting
bun run lint
bun run lint:fix
```

## Architecture

### Routing and layouts

`app/app.vue` is the shell: `<NuxtRouteAnnouncer>`, `<NuxtLayout><NuxtPage/></NuxtLayout>`,
the locale-independent head (font preloads, hero preload, viewport), and the
locale policy (see I18n below).

There is deliberately **no `layouts/default.vue`**. A page either names its
layout with `definePageMeta({ layout: 'auth' })` or opts out with
`definePageMeta({ layout: false })`.

| Layout | Used by |
|---|---|
| `app/layouts/auth.vue` | `/signin`, `/signup`, `/confirm-email`, `/forgot-password` |
| `app/layouts/kyc.vue` | `/kyc/**` |
| `app/layouts/dashboard.vue` | Nothing yet — an empty shell reserved for the authenticated app |

The landing pages (`app/pages/index.vue`, `app/pages/es.vue`) use
`layout: false`: both render `app/components/LandingPage.vue`, which owns the
whole page shell (navbar, sections, footer, contact modal). There used to be a
`layouts/landing.vue` holding that markup with an empty `pages/index.vue`; the
page shell is a component now, because two locale routes render it.

### Component Organization

```
app/components/
  ├── AppNavbar.vue, AppFooter.vue         # Top-level layout components
  ├── HeroSection.vue, StatsSection.vue…   # Top-level section components
  ├── LandingPage.vue                      # The whole landing, shared by /  and /es
  ├── Navbar/                              # Nested presentational components
  │   ├── links.ts                         #   single source of the nav links
  │   ├── NavLinks.vue, NavLangSwitch.vue, NavMobileMenu.vue
  ├── Benefits/, Contact/, Features/, OurPurpose/, Pricing/, WhoWeAre/
  ├── Signin/, Signup/, ConfirmEmail/      # Auth component groups
  └── Kyc/                                 # KYC wizard components
```

Two layers, and the boundary is a real rule:

1. **Top-level section components** — own the state and the listeners, and are
   the units covered by tests.
2. **Nested presentational subcomponents** in a folder named after their section
   — props-in / events-out, no state of their own.

**Coverage scope**: the landing's nested section folders (`Benefits/`,
`Contact/`, `Features/`, `Navbar/`, `OurPurpose/`, `Pricing/`, `WhoWeAre/`) are
excluded in `vitest.config.ts` so purely decorative files do not pad the number.
The auth and KYC folders are **not** excluded — they hold real logic and have
real tests. **If you add a new presentational section folder, add it to that
exclude list yourself; it is not inherited.**

The navbar has its own document: `docs/navbar.md` (five responsive variants, the
drawer contract, and the adjudication of pen values that must not be copied).

### I18n Implementation

Custom composable — **not** `@nuxtjs/i18n`. `app/composables/useI18n.ts` wraps
`i18n-js` with `locales/en.json` and `locales/es.json`. Only `en` and `es`.
Usage: `const { t, locale, setLocale } = useI18n()`.

**The URL owns the locale.** `/` is English, `/es` is Spanish, and each page pins
it during setup through `useLocalePage(locale)`. `Accept-Language` negotiation
was removed on purpose: serving two languages from one URL is what made the
Spanish content unreachable for crawlers, and it makes SSR output
non-deterministic per URL.

- `app/composables/useLocaleRoutes.ts` — pure, Nuxt-free, unit-tested: the
  supported locales, the path for each, hreflang/Open Graph tags, the full
  alternate cluster, and `isLocalePinnedPath()` / `preferredLocale()`.
- `app/composables/useLocalePage.ts` — pins the locale and emits the per-locale
  SEO head (title, description, canonical, hreflang cluster, OG).

**Web app routes carry no locale in the URL.** They render in the default locale
on the server; `app/app.vue` adopts the visitor's `navigator.language` once,
after hydration, and only when they deep-linked straight into one of those
routes. Entering through the landing carries the locale the visitor was reading.
If the web app ever needs its own indexable locales, that is a routing decision —
do not solve it by reintroducing header negotiation.

Every visible string lives in **both** locale files; nothing hardcoded in a
`.vue`. `tests/translations.spec.ts` enforces exact key parity, matching types,
equal array lengths, non-empty values, and that no Spanish string is still
identical to its English source (with an explicit `IDENTICAL_BY_DESIGN`
allowlist that is itself checked for staleness).

### KYC wizard

A multi-step flow under `app/pages/kyc/`:

- `/kyc` redirects to the first step
- `/kyc/profile` — Step 1: personal information
- `/kyc/subscription` — Step 2: plan selection
- `/kyc/drivers` — Step 3: driver management

`app/components/Kyc/KycWizard.vue` is the presentational step indicator: it takes
`currentStep`, `completedSteps`, `isCompleted` as props and emits `navigate`. It
holds no state.

**State is persisted in `localStorage` under a per-page key, and the
`loadKycState`/`saveKycState` pair is duplicated in each step page.** There is no
shared wizard composable. This is known debt: the moment a fourth step or the
dashboard lands, hoist it into `app/composables/useKycWizard.ts` behind
`useState` so the flow survives a route change without a round trip through
storage.

### Validation Utilities

Shared validation in `app/utils/` (in the coverage gate, 100% covered):

- **`validation.ts`** — `isValidEmail()`, `isValidPassword()`, `isValidOAuthProvider()`
- **`kyc-validation.ts`** — KYC profile step
- **`kyc-drivers-validation.ts`** — driver information

**Security pattern**: always validate OAuth providers with
`isValidOAuthProvider()` against the `VALID_OAUTH_PROVIDERS` allowlist before
redirecting, to prevent open redirects.

## Testing Patterns

Vitest + Vue Test Utils + jsdom, configured in `vitest.config.ts` (not through
Nuxt). Aliases `~` and `@` resolve to `app/`; `#imports` resolves to
`tests/stubs/nuxt-imports.ts`, a stub that **records** `useHead`/`useSeoMeta`
payloads so the SEO head can be asserted directly.

Tests live in `tests/components/`, `tests/composables/`, `tests/pages/`,
`tests/utils/`, plus `tests/translations.spec.ts`.

### Coverage

Thresholds are a **ratchet**, not a target: measured floor minus slack, raised in
steps and never lowered. Currently 90 statements / 80 branches / 60 functions /
90 lines over `app/components/**`, `app/composables/**` and `app/utils/**`
(v8's `functions` attribution varies between runs, which is why it sits low).

### Global Test Stubs

`vitest.setup.ts` stubs Nuxt globals so components mount without a Nuxt runtime:
`useState`, `useRequestHeaders`, `useI18n`, `useRouter`, `useRoute`, `useHead`,
`useSeoMeta`, `definePageMeta`, `onMounted`, plus a `matchMedia` that records its
listeners so tests can drive breakpoint changes with `dispatchEvent()`.

Two details that matter:

- **`useState` shares one ref per key**, like the real one. A fresh ref per call
  would make cross-call state (the locale) untestable.
- **The stubbed `useI18n().t()` returns the key itself**, and the `NuxtLink` stub
  renders its `to` as an `href` so tests can assert on crawlable URLs. Both are
  exported through `globalStubs`; pass it as `global: { stubs: globalStubs }`.

**When you need real behavior**, override the global stub:

```ts
import { useI18n as realUseI18n } from '~/composables/useI18n'
// @ts-expect-error - Override global stub for this test
globalThis.useI18n = realUseI18n
```

Set the locale with `setLocale('es')`. Do **not** drive it by mutating
`navigator.language` — the composable no longer reads it.

### Testing Best Practices

- **Fake timers**: for `setTimeout`, use `vi.useFakeTimers()` and
  `vi.advanceTimersByTimeAsync()` rather than real delays; restore with
  `vi.useRealTimers()` in `afterEach`.
- **Mocking location**:
  ```ts
  delete window.location
  // @ts-expect-error - Mocking window.location for test
  window.location = { href: '' }
  ```
- **Restore globals you stub** (`vi.unstubAllGlobals()`); the suite shares one
  environment across files.
- **Testable by construction**: if a component cannot be mounted with
  `globalStubs` and a `t()` that returns the key, the design is wrong, not the test.

## Performance budget

`nuxt.config.ts` and `app/app.vue` carry deliberate performance work. Anything
that touches it must be declared and measured, not adjusted in passing:

- Critical CSS inlined in `app.head.style`, **including the four `@font-face`
  rules** (Poppins 400/500/600/700). There is no `/fonts/*.css` stylesheet: a
  deferred stylesheet made the font preloads pointless and cost CLS on swap.
  Weights 300 and 800 are unused and their `.woff2` files were removed — check
  before introducing `font-light` or `font-extrabold`.
- A Nitro `render:html` hook defers the `_nuxt/entry` stylesheet (media=print swap).
- `@nuxt/image` uses `provider: 'none'` — `<NuxtImage>` does not transform
  anything; optimized variants live pre-built in `public/images/`.
- Font and hero-image preloads in `app/app.vue`'s `useHead`.
- `routeRules` set immutable cache headers for `/fonts/**`, `/images/**`, `/_nuxt/**`.
- `nitro.prerender.routes` prerenders `/` and `/es` so crawlers get static HTML
  for both.
- Manual vendor chunks for `vue` and `vue-router`.

## Special Configurations

### .well-known Handling

`server/middleware/wellknown.ts` serves `/.well-known/*` from `public/`, which
stops browser dev tools from generating 404 noise for
`/.well-known/appspecific/com.chrome.devtools.json`. Make sure
`public/.well-known/` ships in production artifacts.

### TypeScript

`tsconfig.json` uses project references to the Nuxt-generated configs plus
`tsconfig.test.json`, which relaxes rules for test files.

### MCP Servers

`.mcp.json` at the repo root configures `chrome-devtools`, `pencil`,
`playwright` and `context7`. `context7` reads its key from the
`CONTEXT7_API_KEY` environment variable — never commit a key.

Use `chrome-devtools` for Core Web Vitals, console inspection, screenshots and
responsive checks; `pencil` for the design file (see below); `context7` for
up-to-date library documentation.

## Design system

`DESIGN.md` (repo root) is the brand and design contract, in the
[DESIGN.md format](https://github.com/google-labs-code/design.md): YAML front
matter holds the machine-readable tokens (colors, typography, rounded, spacing,
components) and the markdown body the rationale. **Read it before building or
restyling any UI**, in code or on the pen.dev canvas, and take colors, type,
spacing, radii and accent/text pairings from it instead of inventing values.

`DESIGN.md` is maintained by hand against the whole of `pencil.pen`, not
generated from any single frame. (An earlier version of this file claimed it was
generated from the `Design system` frame, node `I5xP6`. It is not, and never
was: that frame has never carried the alpha tokens or the component geometry —
`navbar`, `navbar-lang-chip`, `navbar-drawer` — that the contract depends on.
When the design changes, update `DESIGN.md` and the pen together, deliberately.)

`pencil.pen` is an **encrypted** pen.dev design file: access it only through the
pencil MCP tools, never with Read or Grep. `pen-assets/` holds the exported
source assets it references.

**Known debt**: there is no `tailwind.config.*`, and the components carry ~120
hardcoded hex values (arbitrary classes like `bg-[#031E72]` and inline styles).
The tokens in `DESIGN.md` are not consumed by the code — every screen retypes the
value. Materializing them as a Tailwind theme or CSS custom properties is a
pending decision; do not make it unilaterally in the middle of another change.

## Notes

- Never edit or commit `.nuxt/` autogenerated files (`eslint.config.mjs`
  consumes `.nuxt/eslint.config.mjs`).
- `@nuxt/ui` 4.1.0 sits in `dependencies` but is **not registered in `modules`**.
  It is dead weight today and a trap for anyone assuming it is available: either
  adopt it deliberately or uninstall it. Do not `import` from it as things stand.
- `scripts/generate-favicon.js` regenerates favicons.
- Docker: `docker-compose up` for local dev with volume mounts; `Dockerfile`
  uses Node 21.

## Common Workflows

### Adding a New KYC Step

1. Create the page in `app/pages/kyc/[step-name].vue` with `definePageMeta({ layout: 'kyc' })`
2. Add validation in `app/utils/kyc-[step-name]-validation.ts`
3. Create the form component in `app/components/Kyc/Kyc[StepName]Form.vue`
4. Add translations under `kyc.[step-name].*` in **both** locale files
5. Write tests in `tests/pages/[step-name].spec.ts` and `tests/components/Kyc[StepName]Form.spec.ts`
6. If you find yourself copying `loadKycState`/`saveKycState` a fourth time,
   stop and hoist it into a composable instead

### Adding a Landing Section

1. Create the top-level section in `app/components/[Name]Section.vue` and compose
   it from a `app/components/[Name]/` folder if it needs presentational pieces
2. Add that folder to the coverage `exclude` in `vitest.config.ts`
3. Stack it in `app/components/LandingPage.vue`
4. Add every string to both locale files; take colors, type and spacing from `DESIGN.md`
5. Write a test for the section component (the folder is excluded, the section is not)

### Adding Translations

1. Add the keys to **both** `locales/en.json` and `locales/es.json`
2. Use nested structure (e.g. `auth.signin.title`)
3. Access via `t('auth.signin.title')` from `useI18n()`
4. Run `bun run test tests/translations.spec.ts` — parity is enforced
