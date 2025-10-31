<template>
  <div 
    class="relative flex-shrink-0 w-full h-[360px] transition-all duration-300"
    :class="{ 'scale-105': isActive }"
  >
    <!-- Border Gradient Background -->
    <div 
      class="absolute inset-0 rounded-[10px] p-[1.5px] transition-all duration-300"
      :style="{
        background: isActive 
          ? 'linear-gradient(180deg, rgba(183, 205, 245, 1) 0%, rgba(183, 205, 245, 0) 100%)' 
          : 'linear-gradient(180deg, rgba(183, 205, 245, 1) 0%, rgba(0, 0, 0, 0) 100%)'
      }"
    >
      <!-- Inner Background Card con backdrop blur -->
      <div 
        class="w-full h-full rounded-[8.5px] overflow-hidden transition-all duration-300"
        :class="[
          isActive 
            ? 'bg-[#61F0FF] shadow-[0px_55px_80px_0px_rgba(255,193,82,0.15)]' 
            : 'bg-[#01051D] shadow-[0px_60px_80px_0px_rgba(0,0,0,0.25)]'
        ]"
        style="backdrop-filter: blur(30px);"
      >
        <!-- Content -->
        <div class="relative h-full flex flex-col">
          <!-- Imagen superior (160px de altura) -->
          <div class="relative w-full h-[160px] flex-shrink-0 overflow-hidden">
            <img
              :src="imagePath"
              :alt="title"
              class="w-full h-full object-cover"
              loading="lazy"
            >
          </div>

          <!-- Texto Content con padding bottom adicional -->
          <div class="flex-1 flex flex-col justify-start px-[30px] pt-[25px] pb-[35px]">
            <h3 
              class="text-xl font-semibold mb-4 text-center transition-colors duration-300"
              :class="isActive ? 'text-[#01051D]' : 'text-[#EBF2FF]'"
            >
              {{ title }}
            </h3>
            <p 
              class="text-base leading-relaxed text-center transition-colors duration-300"
              :class="isActive ? 'text-[#01051D]' : 'text-[#EBF2FF]'"
            >
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  imagePath: string
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>
