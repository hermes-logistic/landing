<template>
  <div class="text-center">
    <span class="text-[#FF734D] text-sm font-semibold tracking-[0.05em] uppercase">
      {{ t('features.label') }}
    </span>
    <h2 class="text-[40px] md:text-5xl font-semibold text-[#EBF2FF] mt-4 mb-6">
      {{ t('features.title') }}
    </h2>
    <p class="text-[#EBF2FF] text-base max-w-3xl mx-auto">
      {{ t('features.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
