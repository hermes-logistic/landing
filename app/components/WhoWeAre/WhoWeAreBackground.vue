<template>
  <div class="absolute inset-0 overflow-visible">
    <!-- Gradient that blends with adjacent sections - no hard edges -->
    <div 
      class="absolute inset-0 w-full h-full"
      style="background: radial-gradient(ellipse 80% 50% at 80% 50%, rgba(3, 30, 114, 0.4) 0%, transparent 70%);"
    />
    <!-- Subtle glow effect -->
    <div 
      class="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20"
      style="background: radial-gradient(circle, rgba(97, 240, 255, 0.3) 0%, transparent 70%); filter: blur(100px);"
    />
  </div>
</template>
