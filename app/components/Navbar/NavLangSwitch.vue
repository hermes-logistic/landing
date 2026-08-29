<template>
  <div
    class="flex items-center gap-2"
    role="group"
    :aria-label="t('nav.aria.languageSwitch')"
  >
    <button
      type="button"
      lang="en"
      :aria-pressed="locale === 'en'"
      :aria-label="t('nav.aria.switchToEnglish')"
      :class="[buttonClass, locale === 'en' ? activeClass : inactiveClass]"
      @click="emit('select', 'en')"
    >
      EN
    </button>
    <button
      type="button"
      lang="es"
      :aria-pressed="locale === 'es'"
      :aria-label="t('nav.aria.switchToSpanish')"
      :class="[buttonClass, locale === 'es' ? activeClass : inactiveClass]"
      @click="emit('select', 'es')"
    >
      ES
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  locale: string
  variant?: 'desktop' | 'mobile'
}>(), {
  variant: 'desktop',
})

const emit = defineEmits<{
  select: [value: string]
}>()

// i18n composable (auto-imported from app/composables) — labels only.
const { t } = useI18n()

// surface-raised / foreground / foreground-muted from DESIGN.md.
const activeClass = 'bg-[#152E6D] text-[#EBF2FF]'
const inactiveClass = 'text-[#94A4C2]'

const buttonClass = computed(() => [
  'text-sm rounded transition-colors duration-200',
  props.variant === 'mobile' ? 'px-3 py-1' : 'px-2 py-1 lg:px-3',
])
</script>
