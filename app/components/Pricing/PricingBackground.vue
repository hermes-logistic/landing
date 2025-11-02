<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Deep Blue Background -->
    <div class="absolute inset-0 bg-[#031E72]" />

    <!-- Gradient Ellipses -->
    <div class="absolute inset-0">
      <!-- Cyan/Turquoise Ellipse (Left) -->
      <div
        class="absolute w-[640px] h-[756px] left-0 top-[237px] rounded-full opacity-50"
        style="
          background: #61F0FF;
          filter: blur(200px);
        "
      />

      <!-- Orange Ellipse (Right) -->
      <div
        class="absolute w-[534px] h-[501px] right-0 top-0 rounded-full opacity-50"
        style="
          background: #FF734D;
          filter: blur(200px);
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Background component with adjusted opacity for ellipses
</script>
