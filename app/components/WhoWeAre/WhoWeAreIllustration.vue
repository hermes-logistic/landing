<template>
  <div class="relative flex justify-center lg:justify-end">
    <NuxtImg 
      src="/images/who-we-are/illustration.svg" 
      :alt="t('whoWeAre.label')"
      class="w-full max-w-[677px] h-auto"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
