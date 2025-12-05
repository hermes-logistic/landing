<template>
  <div class="text-center">
    <h1 class="text-5xl md:text-7xl font-semibold text-white mb-6 leading-[1.5]">
      {{ t('hero.title') }}
    </h1>
    <p class="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-[1.5] tracking-[0.01em]">
      {{ t('hero.description') }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>