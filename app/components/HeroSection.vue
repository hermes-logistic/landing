<template>
  <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001751] to-[#01051D] overflow-hidden pt-20">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-20 left-10 w-96 h-96 bg-[#61F0FF] rounded-full filter blur-[150px]" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#FF734D] rounded-full filter blur-[150px]" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
      <IntroSection />
      <ScheduleButton />

      <!-- Stats Section (optional based on design) -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div class="text-4xl font-bold text-[#61F0FF] mb-2">10%</div>
          <div class="text-sm text-white/80 uppercase tracking-wider">Fuel Savings</div>
        </div>
        <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div class="text-4xl font-bold text-[#61F0FF] mb-2">20%</div>
          <div class="text-sm text-white/80 uppercase tracking-wider">Savings in Work Hours</div>
        </div>
        <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div class="text-4xl font-bold text-[#61F0FF] mb-2">40%</div>
          <div class="text-sm text-white/80 uppercase tracking-wider">Cost Production from Error Delays</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IntroSection from './IntroSection.vue'
import ScheduleButton from './ScheduleButton.vue'
</script>
