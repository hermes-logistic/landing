<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <NuxtLayout> wraps <NuxtPage> because auth/KYC declare layouts
         (`auth`, `kyc`, `dashboard`) through definePageMeta. The landing pages
         opt out with `layout: false`: `/` and `/es` render LandingPage.vue,
         which owns the whole page shell itself. There is deliberately no
         `layouts/default.vue` — a page either names its layout or has none. -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead, useRoute } from '#imports'
import { useI18n } from './composables/useI18n'
import { isLocalePinnedPath, preferredLocale } from './composables/useLocaleRoutes'

// App shell. Everything that varies per locale — title, description, canonical,
// hreflang, Open Graph — lives in useLocalePage() and is applied by each page
// under app/pages/. What stays here is locale-independent: fonts, preloads and
// the viewport.
const { locale, setLocale } = useI18n()
const route = useRoute()

// Locale policy, in one place.
//
// The URL decides the locale on the landing: `/` is English, `/es` is Spanish,
// and those pages pin it in setup (useLocalePage). Accept-Language negotiation
// is gone for good — serving two languages from one URL is what made the
// Spanish content invisible to crawlers, and it also makes SSR output
// non-deterministic per URL.
//
// The web app routes (/signin, /signup, /kyc/**) carry no locale in the URL, so
// the server always renders them in the default locale. Only after hydration,
// and only when the visitor deep-linked straight into one of them, do we adopt
// their browser language: those pages are interactive app screens, not
// indexable content, so a post-hydration switch costs nothing and keeps the
// Spanish copy in locales/es.json reachable. Entering through the landing
// instead carries whatever locale the visitor was already reading in.
onMounted(() => {
  if (isLocalePinnedPath(route.path)) return
  const preferred = preferredLocale()
  if (preferred) setLocale(preferred)
})

// Preload critical fonts with high priority (above the fold).
// 400 body, 500 nav items (label-lg), 600 the remaining `font-semibold`,
// 700 `font-bold` (the navbar CTA among others, also above the fold).
// Their @font-face rules ship inline in nuxt.config.ts `app.head.style`:
// there is no longer a /fonts/*.css stylesheet, because a deferred stylesheet
// made these preloads pointless and forced a font swap late in the render.
// Every route uses Poppins, so these are unconditional.
const FONT_PRELOADS = [
  { rel: 'preload', href: '/fonts/poppins-400.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/poppins-500.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/poppins-600.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  { rel: 'preload', href: '/fonts/poppins-700.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
]

// The hero background is the landing's LCP element — and ONLY the landing's.
// HeroSection.vue is the single consumer, so on /signin, /signup and /kyc/**
// these three used to be a wasted download plus a permanent console warning
// ("preloaded ... but not used within a few seconds"). Gated on the route, they
// stay byte-identical on / and /es, where the budget actually depends on them.
const HERO_PRELOADS = [
  { rel: 'preload', href: '/images/backgrounds/chicago-hero-lg.webp', as: 'image', type: 'image/webp', media: '(min-width: 1025px)' },
  { rel: 'preload', href: '/images/backgrounds/chicago-hero-md.webp', as: 'image', type: 'image/webp', media: '(min-width: 641px) and (max-width: 1024px)' },
  { rel: 'preload', href: '/images/backgrounds/chicago-hero-sm.webp', as: 'image', type: 'image/webp', media: '(max-width: 640px)' },
]

useHead(() => ({
  htmlAttrs: {
    // Reactive so the SSR'd HTML carries the locale of the route being rendered.
    lang: locale.value,
  },
  link: [
    ...FONT_PRELOADS,
    ...(isLocalePinnedPath(route.path) ? HERO_PRELOADS : []),
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
  ],
}))

// Smooth scroll behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>
