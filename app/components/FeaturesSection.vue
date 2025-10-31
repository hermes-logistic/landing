<template>
  <section id="features" class="relative py-20 bg-[#01051D]">
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
const { t } = useI18n()

// Get slides data from translations
const slides = computed(() => {
  return t('features.slides', [], { returnObjects: true }) as Array<{
    title: string
    description: string
  }>
})
</script>
