<template>
  <div class="min-h-screen bg-[#01051D]">
    <NuxtRouteAnnouncer />
    <AppNavbar />
    <HeroSection />
    <WhoWeAreSection />
    <OurPurposeSection />
    <BenefitsSection />
    <FeaturesSection />
    <PricingSection />
    <ContactSection />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from '#imports'

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
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap' },
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
