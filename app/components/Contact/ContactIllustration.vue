<template>
  <div class="absolute right-[100px] lg:right-[200px] top-[27px] z-30 hidden md:block">
    <NuxtImg
      src="/images/contact/contact-illustration.svg"
      :alt="t('contact.title')"
      class="w-[200px] lg:w-[240px] h-auto"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
