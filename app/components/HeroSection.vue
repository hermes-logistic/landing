<template>
  <section class="relative min-h-screen flex flex-col justify-center bg-[#01051D] overflow-hidden pt-20">
    <!-- Background Image (Layer 0) - Responsive with srcset -->
    <div class="absolute inset-0 z-0">
      <picture>
        <source
          media="(max-width: 640px)"
          srcset="/images/backgrounds/chicago-hero-sm.webp"
          type="image/webp"
        >
        <source
          media="(max-width: 1024px)"
          srcset="/images/backgrounds/chicago-hero-md.webp"
          type="image/webp"
        >
        <img
          src="/images/backgrounds/chicago-hero-lg.webp"
          alt=""
          width="1920"
          height="1080"
          class="w-full h-full object-cover opacity-20"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
        >
      </picture>
      <div class="absolute inset-0 bg-gradient-to-b from-[#031E72]/70 via-transparent to-[#01051D]" />
    </div>

    <!-- Global Decorative Elements (Layer 1) -->
    <div class="absolute inset-0 z-10 pointer-events-none">
      <div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#FF734D] rounded-full filter blur-[250px] opacity-30" />
      <div class="absolute bottom-0 -left-1/4 w-2/3 h-1/3 bg-[#61F0FF] rounded-full filter blur-[200px] opacity-10" />
      <div class="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-[#FF734D] rounded-full filter blur-[200px] opacity-20" />
    </div>

    <!-- Content Wrapper (Layer 3) -->
    <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 flex-grow flex flex-col items-center">
      <!-- Intro Section -->
      <div class="relative text-center z-40">
        <IntroSection />
      </div>

      <!-- Schedule Button -->
      <div class="mt-[60px] relative z-40 w-full">
        <ScheduleButton />
      </div>

      <!-- Spacer to push StatsSection to the bottom -->
      <div class="flex-grow" />

      <!-- Stats Section with Glassmorphism effect -->
      <div class="w-full max-w-5xl z-40">
        <StatsSection />
      </div>
    </div>
  </section>
</template>

<script setup>
import IntroSection from './IntroSection.vue'
import ScheduleButton from './ScheduleButton.vue'
</script>
