<template>
  <div class="min-h-screen bg-[#01051D]">
    <AppNavbar
      :is-contact-modal-open="isContactModalOpen"
      @open-contact-modal="isContactModalOpen = true"
      @close-contact-modal="isContactModalOpen = false"
    />
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
// The whole landing page, shared by every locale route. `/` and `/es` render
// this identically; only the locale and the SEO head differ, and those are set
// by useLocalePage() in each page.
import { ref } from 'vue'
import ContactModal from './ContactModal.vue'

const isContactModalOpen = ref(false)
</script>
