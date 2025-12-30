<template>
  <div class="min-h-screen bg-[#01051D] relative overflow-hidden">
    <!-- Background gradient effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Top gradient -->
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#61F0FF] opacity-5 blur-[150px] rounded-full" />
      <!-- Bottom gradient -->
      <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#3B82F6] opacity-5 blur-[150px] rounded-full" />
    </div>
    
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
