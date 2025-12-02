<!-- GitHub Copilot / AI Agent instructions for contributors -->

This repository is a small Nuxt 4-based landing site. The goal of this file is to give an AI coding agent the minimal, high-value context it needs to be productive without asking for clarification.

## Project Overview
- **Framework**: Nuxt 4 with TypeScript.
- **Purpose**: A landing site with modular components for sections like benefits, features, pricing, and more.
- **Key Directories**:
  - `app/`: Contains the main application structure, including pages, components, and composables.
  - `assets/`: Static assets like CSS (e.g., Tailwind).
  - `locales/`: JSON files for internationalization (e.g., `en.json`, `es.json`).
  - `public/`: Publicly accessible files (e.g., `robots.txt`, images).
  - `scripts/`: Utility scripts (e.g., `generate-favicon.js`).

## Component Tree
The site is composed of modular sections and nested components. Use `app/components/` for reusable UI.

Top-level components in `app/components/`:
- `AppNavbar.vue`, `AppFooter.vue`, `ScheduleButton.vue`
- Section blocks: `HeroSection.vue`, `IntroSection.vue`, `BenefitsSection.vue`, `FeaturesSection.vue`, `PricingSection.vue`, `ContactSection.vue`, `StatsSection.vue`, `OurPurposeSection.vue`, `WhoWeAreSection.vue`

Nested component structure:
- `Benefits/`
  - `BenefitCard.vue`
  - `BenefitsBackground.vue`
  - `BenefitsTitle.vue`
- `Contact/`
  - `ContactBackground.vue`
  - `ContactCard.vue`
  - `ContactCardBackground.vue`
  - `ContactCardContent.vue`
  - `ContactIllustration.vue`
- `Features/`
  - `FeaturesBackground.vue`
  - `FeaturesCarousel.vue`
  - `FeaturesSlide.vue`
  - `FeaturesTitle.vue`
- `Pricing/`
  - `PricingBackground.vue`
  - `PricingCard.vue`
  - `PricingCardFeatured.vue`
  - `PricingTitle.vue`
- `OurPurpose/`
  - `OurPurposeBackground.vue`
  - `OurPurposeContent.vue`
  - `OurPurposeIllustration.vue`
- `WhoWeAre/`
  - `WhoWeAreBackground.vue`
  - `WhoWeAreContent.vue`
  - `WhoWeAreIllustration.vue`

## Developer Workflows
- **Package Manager**: Always use `bun` for all package management and script execution.
- **Development**:
  - Install dependencies: `bun install`.
  - Start the dev server: `bun run dev`.
  - Default dev server URL: `http://localhost:3000`.
- **Build and Preview**:
  - Build for production: `bun run build`.
  - Preview production build: `bun run preview`.
- **Testing**:
  - Run tests once: `bun run test`.
  - Run tests in watch mode: `bun run test:watch`.
  - Run tests with coverage: `bun run test:coverage`.
  - Coverage threshold: Minimum 80% for lines, branches, functions, and statements.
- **Linting**:
  - Check for linting issues: `bun run lint`.
  - Auto-fix linting issues: `bun run lint:fix`.
- **Docker**:
  - Build image: `docker build .`.
  - Run with Docker Compose: `docker-compose up` (uses volume mounts for local edits).

## Patterns and Conventions
- **Component Structure**:
  - Use the `app/components/` directory for reusable Vue components.
  - Prefer composing section components from nested folders (see Component Tree).
- **Routing**:
  - Follow Nuxt's file-based routing in `app/pages/`.
  - Example: `app/pages/about.vue` creates the `/about` route.
- **Styling**:
  - Use Tailwind CSS (`assets/css/tailwind.css`).
  - Keep styles scoped to components where possible.
- **Internationalization**:
  - Use `useI18n` composable from `app/composables/useI18n.ts`.
  - Add translations in `locales/` (e.g., `en.json`, `es.json`).
- **Image Optimization**:
  - Use the `@nuxt/image` module and `<NuxtImage>` component for optimized images.

## Key Files
- `package.json`: Scripts and dependencies.
- `nuxt.config.ts`: Nuxt configuration, including enabled modules (`@nuxt/eslint`, `@nuxt/image`, etc.).
- `app/app.vue`: Application entry point with global components like `NuxtRouteAnnouncer`.
- `Dockerfile` and `docker-compose.yaml`: Container setup and development mounts.
- `README.md`: Basic usage and hints.

Entry layout:
- `app/app.vue` should import and arrange section components for the landing page.

## Testing and Debugging
- **Testing**:
  - Framework: Vitest with Vue Test Utils and jsdom environment.
  - Test location: Place unit tests in `tests/` directory (e.g., `tests/components/`, `tests/composables/`).
  - Run tests: `bun run test` (exits after run, no interaction required).
  - Watch mode: `bun run test:watch` for active development.
  - Coverage: `bun run test:coverage` to generate coverage report.
  - Coverage scope: Only `app/components/**` (top-level sections) and `app/composables/**` are included.
  - Coverage exclusions: Nested component subfolders, static files, config files, and assets.
  - Minimum coverage: 80% for lines, branches, functions, and statements.
  - Global stubs: `useState`, `useRequestHeaders`, `useI18n`, `NuxtLink`, `NuxtImage` are stubbed in `vitest.setup.ts`.
- **Debugging**:
  - Reproduce issues locally with `bun run dev`.
  - Validate production output with `bun run build`.
  - Check test failures with `bun run test` for detailed error output.

Recommended quick checks:
- Run `bun run preview` to inspect optimized build output.
- Run `bun run test:coverage` to verify coverage thresholds are met.

## Common Pitfalls
- Avoid editing `.nuxt` autogenerated files or committing them.
- Ensure Node.js version compatibility (Dockerfile uses Node 21).
- Do not introduce global runtime configuration in `.nuxt/*`.

## Examples
- **Adding a Page**:
  - Create `app/pages/contact.vue` with a default export and Nuxt page template.
- **Adding a Component**:
  - Add `app/components/TestimonialSection.vue` and import it where needed.
- **Using Translations**:
  - Add keys to `locales/en.json` and reference them using `useI18n`.

## Integration Points
- **Modules**:
  - `@nuxt/image`: For image optimization.
  - `@nuxt/eslint`: For linting.
  - `@nuxt/ui`: For UI components.
- **Scripts**:
  - `scripts/generate-favicon.js`: Generates favicons for the site.

If unsure about a non-trivial change, create a small PR with a clear description and a minimal repro (page or component) and ask maintainers for review.

Please ask the human maintainer for missing runtime secrets or deployment keys — do not attempt to invent them.
