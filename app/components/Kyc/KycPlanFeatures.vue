<template>
  <div 
    class="p-6 lg:p-10 overflow-hidden rounded-[10px]"
    style="background: linear-gradient(180deg, #01051D 0%, rgba(1, 5, 29, 0) 100%), #001751;"
  >
    <h4 class="text-[22px] leading-[28px] font-bold text-[#EBF2FF] mb-6">
      {{ t('kyc.subscription.featuresTitle') }}
    </h4>
    <ul class="space-y-4">
      <li 
        v-for="(feature, idx) in features" 
        :key="idx"
        class="flex items-start gap-3 text-sm leading-5 text-white"
      >
        <!-- Custom Tick Circle Icon based on Figma -->
        <div class="w-6 h-6 flex-shrink-0 relative">
          <!-- Circle Background (Opacity 0.4) -->
          <div class="absolute inset-0 rounded-full bg-[#61F0FF] opacity-40" />
          <!-- Checkmark (Solid) -->
          <svg 
            class="absolute inset-0 w-full h-full text-[#61F0FF] p-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span>{{ feature }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  features: string[]
}>()
</script>
