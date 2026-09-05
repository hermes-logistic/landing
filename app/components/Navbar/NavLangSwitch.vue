<template>
  <div
    class="flex items-center gap-2"
    role="group"
    :aria-label="t('nav.aria.languageSwitch')"
  >
    <NuxtLink
      v-for="option in options"
      :key="option.locale"
      :to="option.to"
      :hreflang="option.hreflang"
      :lang="option.locale"
      :aria-label="option.ariaLabel"
      :aria-current="option.locale === locale ? 'page' : undefined"
      :class="[buttonClass, option.locale === locale ? activeClass : inactiveClass]"
    >
      {{ option.label }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SUPPORTED_LOCALES,
  hreflangFor,
  pathForLocale,
} from '~/composables/useLocaleRoutes'

const props = withDefaults(defineProps<{
  locale: string
  variant?: 'desktop' | 'mobile'
}>(), {
  variant: 'desktop',
})

// i18n composable (auto-imported from app/composables) — labels only.
const { t } = useI18n()

const ARIA_KEY: Record<string, string> = {
  en: 'nav.aria.switchToEnglish',
  es: 'nav.aria.switchToSpanish',
}

// Real links rather than buttons: each locale is its own indexable URL, so the
// switch has to be crawlable and work without JavaScript. NuxtLink still routes
// client-side, but renders a plain <a href>.
const options = computed(() => SUPPORTED_LOCALES.map(locale => ({
  locale,
  to: pathForLocale(locale),
  hreflang: hreflangFor(locale),
  label: locale.toUpperCase(),
  ariaLabel: t(ARIA_KEY[locale] ?? 'nav.aria.languageSwitch'),
})))

// deep-blue-100 / on-accent from DESIGN.md navbar-lang-chip. The fill has to
// clear 3:1 against the bar on its own (WCAG 1.4.11), measured against the
// AT-REST translucent bar — the worse case — not the scrolled one. That rules
// out surface-raised (1.32:1) and deep-blue-300 (2.10:1), and it is what
// retired deep-blue-200 #4E6DB5: 3.37:1 scrolled but only 2.97:1 at rest.
// #6C8AD0 gives 4.41:1 at rest / 4.98:1 scrolled. Going up the ramp flips the
// label to dark: white on #6C8AD0 is 3.40:1, while #01051D is 5.94:1 and is
// the pairing the DESIGN.md contrast table pre-approves.
const activeClass = 'bg-[#6C8AD0] text-[#01051D]'
const inactiveClass = 'text-[#94A4C2] hover:text-[#EBF2FF]'

const buttonClass = computed(() => [
  'text-xs font-medium lg:text-sm rounded transition-colors duration-200',
  props.variant === 'mobile' ? 'px-3 py-1' : 'px-2 py-1 lg:px-3',
])
</script>
