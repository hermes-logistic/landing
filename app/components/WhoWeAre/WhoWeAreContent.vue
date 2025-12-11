<template>
  <div>
    <span class="text-[#FF734D] text-xs font-semibold tracking-[0.1em] uppercase">
      {{ t('whoWeAre.label') }}
    </span>
    <h2 class="text-4xl md:text-[45px] font-semibold text-[#EBF2FF] mt-4 mb-6 leading-[1.5em]">
      {{ t('whoWeAre.title') }}
    </h2>
    <p class="text-[#EBF2FF] text-base leading-[1.5em] mb-6">
      {{ t('whoWeAre.description1') }}
    </p>
    <p class="text-[#EBF2FF] text-base leading-[1.5em]">
      {{ t('whoWeAre.description2') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
