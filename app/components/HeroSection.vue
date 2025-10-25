<template>
  <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001751] to-[#01051D] overflow-hidden pt-20">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-20 left-10 w-96 h-96 bg-[#61F0FF] rounded-full filter blur-[150px]" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#FF734D] rounded-full filter blur-[150px]" />
    </div>

    <div class="relative w-full px-4 sm:px-6 lg:px-8 py-20 z-10">
      <div class="max-w-7xl mx-auto">
        <IntroSection />
      </div>

      <ScheduleButton class="mt-[60px]" />

      <StatsSection />
    </div>
  </section>
</template>

<script setup>
import IntroSection from './IntroSection.vue'
import ScheduleButton from './ScheduleButton.vue'
</script>
