<template>
  <section id="our-purpose" class="relative py-20 bg-[#01051D] overflow-hidden">
    <!-- Background Gradient -->
    <OurPurposeBackground />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Content Container with Shadow -->
      <div 
        class="bg-gradient-to-br from-[#001751]/100 to-[#001751]/0 rounded-[10px] p-12 lg:p-16"
        style="box-shadow: 0px 55px 100px 0px rgba(183, 205, 245, 0.1), 0px 31px 40px 0px rgba(1, 5, 29, 1);"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Illustration (left side) -->
          <OurPurposeIllustration />

          <!-- Content (right side) -->
          <OurPurposeContent />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
