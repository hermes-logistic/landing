# AI Coding Agent Instructions for Hermes Logistic Landing Page

## Project Overview
This is a Next.js 14 landing page for Hermes Logistic fleet management platform with internationalization (i18n) support. The project uses the App Router with dynamic `[lang]` segments for locale-based routing.

## Architecture & Key Patterns

### Internationalization (i18n) Architecture
- **Locale routing**: Routes follow pattern `/[lang]/` where lang is 'en' or 'es'
- **Middleware**: `/src/middleware.ts` handles automatic locale detection and redirects
- **Dictionary system**: `/dictionary.ts` + `/src/locales/*.json` for translations
- **Type safety**: Locale type defined in `/i18n.config.ts`
- **Static generation**: `generateStaticParams()` in layout creates static pages for both locales

### Component Structure
- **Barrel exports**: `/src/components/index.ts` exports all components
- **Client components**: Most components use `'use client'` directive (e.g., `Navbar.tsx`)
- **Props pattern**: Components receive language dictionaries as `lang` prop
- **Type definitions**: Component interfaces in `/src/types/home.ts`

### Styling Approach
- **SCSS + Bootstrap**: Global styles in `/src/styles/global.scss` with Bootstrap integration
- **Custom theme**: Colors defined in `/src/styles/colors.scss` and merged with Bootstrap theme
- **Swiper integration**: Custom CSS variables for slider styling in global.scss

## Development Workflows

### Local Development
```bash
bun run dev  # Start development server on port 3000
bun run build && bun run start  # Test production build
```

### Key Commands
- Dev container includes Bun and Google Cloud CLI features
- PostCreateCommand: `bun install` (runs automatically in dev container)
- Engine requirements: Node 21.2.x, bun 1.2.23

### Deployment
- **Docker**: Alpine-based container with Node 21.2.0 (see `Dockerfile`)
- **Google Cloud**: Cloud Build configuration in `cloudbuild.yaml` (currently commented out)
- **Build process**: `bun run build` creates optimized production bundle

## Code Conventions

### File Organization
- Components: `/src/components/` with PascalCase naming
- Assets: `/src/assets/images/` with nested folders (icons/, slider/)
- Styles: `/src/styles/` with feature-based SCSS files
- Types: `/src/types/` for TypeScript interfaces

### Component Patterns
```tsx
// Standard component signature for i18n
const Component: React.FC<{ lang: Record<string, string>; currentLang?: string }> = ({ lang, currentLang = 'en' }) => {
  // Component logic
}
```

### Helper Utilities
- `convertBreaks()` in `/src/common/helpers.tsx`: Converts `<br>` tags in JSON strings to React elements
- `useOnScreen` hook for intersection observer functionality

### Internationalization Usage
```tsx
// In page components
const { mainSection, menu } = await getDictionary(lang)

// Access translations
<h1>{mainSection.title}</h1>
```

## External Dependencies & Integration Points

### Key Libraries
- **Next.js 14**: App Router with TypeScript
- **Bootstrap 5.3.1**: UI framework with custom SCSS theming
- **Swiper**: Slider/carousel components
- **@formatjs/intl-localematcher + negotiator**: Locale detection
- **react-icons**: Icon library

### External Services
- **Font loading**: Poppins from Google Fonts with Next.js font optimization
- **App integration**: Links to `https://app.hermesv.dev` (hardcoded in Navbar)
- **Bootstrap JS**: CDN script for interactive components

### Asset Management
- **Images**: SVG icons and PNGs in `/src/assets/images/`
- **Public files**: Favicons, manifest, robots.txt in `/public/`
- **Sharp**: Image optimization for Next.js

## Critical Files for Understanding Context
- `/src/middleware.ts`: Core i18n routing logic
- `/src/app/[lang]/layout.tsx`: Root layout with locale params
- `/dictionary.ts`: Translation loading mechanism
- `/src/components/Navbar.tsx`: Navigation with scroll effects and smooth scrolling
- `/src/styles/global.scss`: Bootstrap integration and custom theming