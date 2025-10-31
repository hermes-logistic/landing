<template>
  <div>
    <h2 class="text-4xl md:text-[45px] font-semibold text-[#EBF2FF] mb-6 leading-[1.5em]">
      {{ t('ourPurpose.title') }}
    </h2>
    <!-- Paragraph: set lang attr and conditional classes to improve Spanish justification/hyphenation -->
    <p
      :lang="localeStr"
      :class="[
        'text-[#EBF2FF] text-base text-justify',
        localeStr === 'es' ? 'hyphens-auto lg:max-w-[38rem] lg:leading-[1.6em]' : 'lg:max-w-[40rem] lg:leading-[1.5em]'
      ]"
    >
      {{ t('ourPurpose.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const { t, locale } = useI18n()
// ensure locale value is a simple string (e.g. 'en' or 'es')
const localeStr = computed(() => (typeof locale === 'string' ? locale : locale.value || 'en'))
</script>
