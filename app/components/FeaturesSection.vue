<template>
  <section id="features" class="relative py-20 bg-gradient-to-b from-[#01051D] to-[#031E72] scroll-mt-16 md:scroll-mt-20" aria-labelledby="features-heading">
    <!-- Background -->
    <FeaturesBackground />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Title Section -->
      <FeaturesTitle />
      
      <!-- Carousel Section with 104px top margin as per Figma -->
      <div class="mt-[104px]">
        <FeaturesCarousel :slides="slides" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const { t } = useI18n()

// Get slides data from translations
const slides = computed(() => {
  const rawSlides = t('features.slides', { returnObjects: true }) as unknown;
  return Array.isArray(rawSlides) ? rawSlides as Array<{ title: string; description: string }> : [];
})
</script>
