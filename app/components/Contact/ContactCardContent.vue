<template>
  <div class="relative z-20 p-6 sm:p-10 md:p-[71px_88px] text-center md:text-left">
    <!-- Title -->
    <h2 id="contact-heading" class="text-2xl sm:text-3xl md:text-[45px] font-semibold text-[#EBF2FF] leading-[1.3em] md:leading-[1.5em] tracking-[0.01em] mb-4">
      {{ t('contact.title') }}
    </h2>

    <!-- Description -->
    <p class="text-sm sm:text-base font-normal text-[#EBF2FF] leading-[1.5em] tracking-[0.01em] max-w-[487px] mx-auto md:mx-0 mb-6 md:mb-8">
      {{ t('contact.description') }}
    </p>

    <!-- CTA Button -->
    <button
      class="bg-[#61F0FF] text-[#01051D] px-8 sm:px-12 md:px-16 py-3 md:py-4 rounded-full font-bold text-sm md:text-base leading-[1.5em] tracking-[0.01em] hover:bg-[#50D8E6] transition-colors"
      aria-label="Contact us to optimize your fleet"
      @click="emit('open-modal')"
    >
      {{ t('contact.cta') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  'open-modal': []
}>()
</script>
