<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import { useI18n } from './composables/useI18n'

// App shell. Everything that varies per locale — title, description, canonical,
// hreflang, Open Graph — lives in useLocalePage() and is applied by each page
// under app/pages/. What stays here is locale-independent: fonts, preloads and
// the viewport.
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    // Reactive so the SSR'd HTML carries the locale of the route being rendered.
    lang: computed(() => locale.value),
  },
  link: [
    // Preload critical fonts with high priority (above the fold).
    // 400 body, 500 nav items (label-lg), 600 the remaining `font-semibold`,
    // 700 `font-bold` (the navbar CTA among others, also above the fold).
    // Their @font-face rules ship inline in nuxt.config.ts `app.head.style`:
    // there is no longer a /fonts/*.css stylesheet, because a deferred stylesheet
    // made these preloads pointless and forced a font swap late in the render.
    { rel: 'preload', href: '/fonts/poppins-400.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/poppins-500.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/poppins-600.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/poppins-700.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    // Preload hero background image (LCP element)
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-lg.webp', as: 'image', type: 'image/webp', media: '(min-width: 1025px)' },
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-md.webp', as: 'image', type: 'image/webp', media: '(min-width: 641px) and (max-width: 1024px)' },
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-sm.webp', as: 'image', type: 'image/webp', media: '(max-width: 640px)' },
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
  ],
})

// Smooth scroll behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>
