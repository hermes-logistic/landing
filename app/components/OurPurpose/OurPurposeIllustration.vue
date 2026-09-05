<template>
  <div class="relative flex justify-center items-center">
    <img 
      src="/images/our-purpose/our-purpose-illustration.svg" 
      :alt="t('ourPurpose.aria.illustration')"
      class="w-full max-w-lg h-auto"
      loading="lazy" decoding="async">
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
