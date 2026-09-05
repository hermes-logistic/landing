<template>
  <div class="relative w-full">
    <img src="/images/schedule-demo-background.svg" alt="" width="1305" height="233" class="w-full h-auto" decoding="async" aria-hidden="true">
    <div class="absolute inset-0 flex items-center justify-center z-10">
      <button 
        class="bg-[#61F0FF] text-[#031E72] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#50D8E6] transition-colors"
        :aria-label="t('hero.aria.schedule')"
      >
        {{ t('hero.schedule') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>