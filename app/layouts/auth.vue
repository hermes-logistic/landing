<template>
  <div class="relative min-h-screen bg-[#01051D] overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0 flex items-center justify-center">
      <!-- Responsive Background Image with Figma effects -->
      <div class="absolute w-full h-full">
        <picture>
          <source
            media="(min-width: 1025px)"
            srcset="/images/backgrounds/trafico-urbano-hero-lg.webp"
          >
          <source
            media="(min-width: 641px)"
            srcset="/images/backgrounds/trafico-urbano-hero-md.webp"
          >
          <img
            src="/images/backgrounds/trafico-urbano-hero-sm.webp"
            alt="Urban traffic background"
            class="w-full h-full object-cover"
          >
        </picture>
        
        <!-- Dark overlay (Figma: linear-gradient(0deg, rgba(1, 5, 29, 0.9), rgba(1, 5, 29, 0.9))) -->
        <div class="absolute inset-0 bg-[#01051D]/90" />
        
        <!-- Gradient from right to left (Figma: linear-gradient(270deg, #01051D 37.4%, rgba(1, 5, 29, 0) 100%)) -->
        <div class="absolute inset-0 bg-gradient-to-l from-[#01051D] from-[37.4%] to-transparent to-100%" />
      </div>
    </div>

    <!-- Content - z-10 to be above background -->
    <div class="relative z-10 min-h-screen">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
