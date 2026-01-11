# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt 4 landing site for Hermes Logistics with authentication flows and KYC wizard. Uses TypeScript, Tailwind CSS, and `bun` as the package manager.

## Development Commands

```bash
# Package management (always use bun, NOT npm/yarn/pnpm)
bun install

# Development server (http://localhost:3000)
bun run dev

# Build for production
bun run build
bun run preview  # Preview production build

# Testing (Vitest + jsdom)
bun run test              # Run all tests
bun run test:watch        # Watch mode
bun run test:coverage     # With coverage (80% threshold)

# Linting
bun run lint
bun run lint:fix
```

## Architecture

### Layouts System
Four layouts in `app/layouts/` provide different page scaffolds:
- **`landing.vue`**: Public pages (header, footer, section container)
- **`auth.vue`**: Minimal layout for signin/signup
- **`dashboard.vue`**: Authenticated app areas
- **`kyc.vue`**: Multi-step KYC wizard with shared wizard state

Set layout with `definePageMeta({ layout: 'auth' })` in pages.

### KYC Wizard Architecture
The KYC wizard is a multi-step flow managed by shared state:
- **State management**: `useKycWizard()` composable in `app/composables/useKycWizard.ts` uses Nuxt's `useState` to persist `currentStep` and `completedSteps` across route changes
- **Layout**: `app/layouts/kyc.vue` renders the wizard shell (logo, progress indicator, step container)
- **Pages**: Each step is a separate page under `app/pages/kyc/`:
  - `/kyc` (redirects to first step)
  - `/kyc/profile` - Step 1: Personal information
  - `/kyc/subscription` - Step 2: Plan selection
  - `/kyc/drivers` - Step 3: Driver management
- **Validation**: Each step has its own validation utility in `app/utils/` (e.g., `kyc-validation.ts`, `kyc-drivers-validation.ts`)
- **Navigation**: Steps navigate using `router.push()` and update the wizard state via `useKycWizard()`

### Component Organization
```
app/components/
  ├── AppNavbar.vue, AppFooter.vue     # Top-level layout components
  ├── HeroSection.vue, StatsSection.vue # Top-level section components
  ├── Benefits/                        # Nested presentational components
  │   ├── BenefitCard.vue
  │   ├── BenefitsBackground.vue
  │   └── ...
  ├── Signin/, Signup/                 # Auth component groups
  ├── Kyc/                             # KYC wizard components
  └── ...
```

**Coverage scope**: Only top-level components (e.g., `BenefitsSection.vue`) are covered by test coverage metrics, not nested presentational subcomponents in folders like `Benefits/`.

### I18n Implementation
- **Custom composable**: `useI18n()` in `app/composables/useI18n.ts` wraps `i18n-js`
- **Locale detection**: Server-side uses `Accept-Language` header, client-side uses `navigator.language`
- **State persistence**: Uses `useState('i18n-locale')` to maintain locale across SSR/client
- **Translation files**: `locales/en.json` and `locales/es.json`
- **Usage**: `const { t, locale, setLocale } = useI18n()`

### Validation Utilities
Shared validation functions in `app/utils/`:
- **`validation.ts`**: Email, password, OAuth provider validation
  - `isValidEmail()`, `isValidPassword()`: Form validation
  - `isValidOAuthProvider()`: Validates against `VALID_OAUTH_PROVIDERS` allowlist to prevent open redirect attacks
- **`kyc-validation.ts`**: KYC profile step validation
- **`kyc-drivers-validation.ts`**: Driver information validation

**Security pattern**: Always validate OAuth providers with `isValidOAuthProvider()` before redirecting to prevent open redirect vulnerabilities.

## Testing Patterns

### Global Test Stubs
`vitest.setup.ts` provides global stubs for Nuxt composables to enable lightweight component mounting:
- `useState`, `useRequestHeaders`, `useI18n`, `useRouter`, `useHead`, `definePageMeta`, `onMounted`
- Component stubs: `NuxtLink`, `NuxtImage` exported as `globalStubs`

**When you need real behavior**: Override the global stub in your test:
```ts
import { useI18n as realUseI18n } from '~/composables/useI18n'
// @ts-expect-error - Override global stub for this test
globalThis.useI18n = realUseI18n
```

### Testing Best Practices
- **Fake timers**: For tests with `setTimeout`, use `vi.useFakeTimers()` and `vi.advanceTimersByTimeAsync()` instead of real delays. Restore with `vi.useRealTimers()` in `afterEach`.
- **Mocking location**: Mock `window.location.href` assignments with:
  ```ts
  delete window.location
  // @ts-expect-error - Mocking window.location for test
  window.location = { href: '' }
  ```
- **useState behavior**: Global stub returns a `ref(init())`, sufficient for most tests
- **Locale testing**: Mock `navigator.language` to test locale detection

### Running Specific Tests
```bash
# Run a specific test file
bun run vitest tests/components/KycDriversForm.spec.ts

# Run tests matching a pattern
bun run vitest --grep "validation"
```

## Special Configurations

### .well-known Handling
- **Purpose**: Prevents 404 noise from browser dev tools requesting `/.well-known/appspecific/com.chrome.devtools.json`
- **Implementation**: Middleware at `server/middleware/wellknown.ts` serves `/.well-known/*` from `public/`
- **Deployment**: Ensure `public/.well-known/` is included in production artifacts

### TypeScript Configuration
- **Main config**: `tsconfig.json` uses project references to Nuxt-generated configs
- **Test config**: `tsconfig.test.json` with relaxed rules for test files (referenced from main config)

### Vite & Build Optimization
- Manual chunks for `vue` and `vue-router` to optimize bundle splitting
- Critical CSS inlining via `nuxt.config.ts` inline styles
- Deferred non-critical CSS loading via Nitro render hook
- Route-based caching rules for static assets

### MCP Servers (Model Context Protocol)

This project has MCP servers configured in `.vscode/mcp.json` that provide additional capabilities:

#### Framelink Figma MCP
- **Purpose**: Integrates with Figma to access design files, extract design tokens, fetch assets, and understand UI specifications
- **Use cases**:
  - Verify component implementations match Figma designs
  - Extract color values, spacing, typography from design files
  - Download assets (icons, images, illustrations) directly from Figma
  - Sync design tokens between Figma and code
- **Configuration**: Uses Figma API key (configured in `.vscode/mcp.json`)
- **When to use**: When implementing new UI components, ask to fetch the relevant Figma design specs to ensure pixel-perfect implementation

#### chrome-devtools MCP
- **Purpose**: Provides Chrome DevTools capabilities for browser automation, debugging, and performance analysis
- **Use cases**:
  - Automated accessibility testing
  - Performance profiling and Core Web Vitals measurement
  - Screenshot capture for visual regression testing
  - Network request monitoring
  - Console log inspection
- **When to use**: For debugging rendering issues, performance optimization, or automated browser testing

**Note**: MCP servers are available in VSCode when using Claude Code and can be leveraged to enhance development workflows.

## Common Workflows

### Adding a New KYC Step
1. Create page in `app/pages/kyc/[step-name].vue`
2. Add validation utilities in `app/utils/kyc-[step-name]-validation.ts`
3. Create form component in `app/components/Kyc/Kyc[StepName]Form.vue`
4. Update `useKycWizard()` if adding new state properties
5. Add translations under `kyc.[step-name].*` in `locales/{en,es}.json`
6. Write tests in `tests/pages/[step-name].spec.ts` and `tests/components/Kyc[StepName]Form.spec.ts`

### Adding Auth Validation
- Add validation functions to `app/utils/validation.ts`
- Export from shared utilities to ensure consistency across signin/signup
- Write tests in `tests/utils/validation.spec.ts`

### Adding Translations
1. Add keys to both `locales/en.json` and `locales/es.json`
2. Use nested structure (e.g., `auth.signin.title`)
3. Access via `t('auth.signin.title')` from `useI18n()`
