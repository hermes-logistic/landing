<template>
  <div class="relative z-10 text-center mb-16 md:mb-20">
    <!-- Label -->
    <h3 class="font-poppins font-semibold text-sm tracking-[0.05em] uppercase text-[#FF734D] mb-2">
      {{ t('pricing.label') }}
    </h3>
    
    <!-- Title -->
    <h2 class="font-poppins font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.5] text-[#EBF2FF]">
      {{ t('pricing.title') }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>
