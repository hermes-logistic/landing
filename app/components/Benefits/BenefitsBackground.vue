<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Fondo sólido -->
    <div class="absolute inset-0 bg-[#01051D]" />
    
    <!-- Efectos de elipsis con blur -->
    <div class="absolute top-0 left-0 w-full h-full">
      <!-- Elipsis izquierda superior -->
      <div 
        class="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
        style="background: radial-gradient(circle, rgba(183, 205, 245, 0.3) 0%, rgba(183, 205, 245, 0) 70%); filter: blur(80px);"
      />
      
      <!-- Elipsis derecha -->
      <div 
        class="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
        style="background: radial-gradient(circle, rgba(255, 115, 77, 0.2) 0%, rgba(255, 115, 77, 0) 70%); filter: blur(100px);"
      />
      
      <!-- Elipsis central inferior -->
      <div 
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
        style="background: radial-gradient(circle, rgba(110, 150, 229, 0.25) 0%, rgba(110, 150, 229, 0) 70%); filter: blur(120px);"
      />
    </div>
    
    <!-- Gradiente adicional para profundidad -->
    <div 
      class="absolute inset-0"
      style="background: radial-gradient(circle at 50% 50%, rgba(0, 23, 81, 0.1) 0%, transparent 60%);"
    />
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica para este componente visual
</script>
