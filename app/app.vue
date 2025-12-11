<template>
  <div class="min-h-screen bg-[#01051D]">
    <NuxtRouteAnnouncer />
    <AppNavbar :is-contact-modal-open="isContactModalOpen" @open-contact-modal="isContactModalOpen = true" @close-contact-modal="isContactModalOpen = false" />
    <HeroSection />
    <WhoWeAreSection />
    <OurPurposeSection />
    <BenefitsSection />
    <FeaturesSection />
    <PricingSection />
    <ContactSection @open-modal="isContactModalOpen = true" />
    <AppFooter />
    
    <!-- Contact Modal -->
    <ContactModal :is-open="isContactModalOpen" @close="isContactModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead, useSeoMeta } from '#imports'
import ContactModal from './components/ContactModal.vue'

const isContactModalOpen = ref(false)

// SEO Meta Tags
useSeoMeta({
  title: 'Hermes Logistics - Fleet Management & Route Optimization',
  description: 'Transform your fleet with Hermes Logistics. Optimize routes, reduce costs, and increase delivery efficiency. Advanced technology for smarter logistics.',
  ogTitle: 'Hermes Logistics - Fleet Management & Route Optimization',
  ogDescription: 'Leverage technology to optimize your routes, reduce costs, and increase the efficiency of your deliveries.',
  ogImage: '/images/og-image.png',
  ogUrl: 'https://www.hermesv.io',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Hermes Logistics - Fleet Management & Route Optimization',
  twitterDescription: 'Transform your fleet with intelligent route optimization and real-time analytics.',
  twitterImage: '/images/og-image.png',
  keywords: 'fleet management, route optimization, logistics, delivery optimization, fleet tracking, transportation management, supply chain, last mile delivery',
  author: 'Hermes Logistics',
  robots: 'index, follow',
  ogType: 'website',
  ogLocale: 'en_US',
  ogLocaleAlternate: ['es_ES']
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    // Preload critical fonts with high priority (above the fold)
    { rel: 'preload', href: '/fonts/poppins-400.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/fonts/poppins-600.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    // Preload hero background image (LCP element)
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-lg.webp', as: 'image', type: 'image/webp', media: '(min-width: 1025px)' },
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-md.webp', as: 'image', type: 'image/webp', media: '(min-width: 641px) and (max-width: 1024px)' },
    { rel: 'preload', href: '/images/backgrounds/chicago-hero-sm.webp', as: 'image', type: 'image/webp', media: '(max-width: 640px)' },
    // Load font stylesheet asynchronously with media query to avoid blocking render
    { rel: 'stylesheet', href: '/fonts/poppins.css', media: 'print', onload: "this.media='all'" },
    // Fallback for no-JavaScript environments
    { rel: 'stylesheet', href: '/fonts/poppins.css', media: '(prefers-color-scheme: no-preference)' },
    { rel: 'canonical', href: 'https://www.hermesv.io' }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ]
})

// Smooth scroll behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>
