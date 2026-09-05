<template>
  <!-- Route-level entry point into the web app. DESIGN.md
       `components.navbar-signup-link`: a LINK, never a second button — the bar
       carries exactly one CTA (`button-cta-marketing`) and this does not
       compete with it. Nav-link tokens only: `foreground` at rest, `blue-sky`
       on hover, weight 500. No fill, no border, no radius.

       No `aria-current`, per the contract: it points at another document, so
       there is no current-section state to express. NuxtLink would add it on an
       exact route match, which cannot happen here — the navbar only renders on
       the landing, and /signup uses the `auth` layout, which has no navbar. -->
  <NuxtLink to="/signup" :class="classes" @click="emit('navigate')">
    {{ t('nav.signup') }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'desktop' | 'mobile'
}>(), {
  variant: 'desktop',
})

const emit = defineEmits<{
  navigate: []
}>()

// i18n composable (auto-imported from app/composables) — label only.
const { t } = useI18n()

const BASE = 'font-medium transition-colors duration-200 text-[#EBF2FF] hover:text-[#61F0FF]'

// Drawer, action group: nav-md (14/500) at the 44px touch floor.
const MOBILE = 'flex items-center min-h-[44px] text-sm'

// Bar: hidden below 1280. `barVisibleFrom: 1280px` is a measured value, not a
// preference — in Spanish no legal label fits under ~1085px, and at 768 the row
// is already 2px over its content box before anything is added to it. The width
// budget is tabulated in DESIGN.md "Sign-up entry point".
const DESKTOP = 'nav-signup hidden xl:inline-flex items-center whitespace-nowrap text-sm'

const classes = computed(() => `${BASE} ${props.variant === 'mobile' ? MOBILE : DESKTOP}`)
</script>

<style scoped>
/* Same bridge as NavLinks: the contract's nav-lg step is at 1440, which is not
   a Tailwind stop (this repo's `xl` is 1280). `text-sm` above covers nav-md for
   1280-1439; this raises it to nav-lg from 1440. When a tailwind.config exists
   with the contract's screens, both become utilities and this block goes. */
@media (min-width: 1440px) {
  .nav-signup { font-size: 16px; line-height: 1.5; }
}
</style>
