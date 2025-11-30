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
import { useHead } from '#imports'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap' }
  ]
})
// Smooth scroll behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>
