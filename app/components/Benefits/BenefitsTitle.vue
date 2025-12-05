<template>
  <div class="relative z-10 mb-16 md:mb-20">
    <span class="text-[#FF734D] text-xs font-semibold tracking-[0.1em] uppercase mb-3 block">
      {{ t('benefits.label') }}
    </span>
    <h2 id="benefits-heading" class="text-3xl md:text-4xl lg:text-[45px] font-semibold text-[#EBF2FF] leading-tight">
      {{ t('benefits.title') }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>
