<template>
  <div class="hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8">
    <!-- label-lg de DESIGN.md: 500, servido por public/fonts/poppins-500.woff2.
         El estado activo va por color + aria-current, nunca por peso. -->
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.href"
      :class="[
        'nav-link font-medium transition-colors duration-200 md:text-xs',
        link.href === activeHash ? 'text-[#61F0FF]' : 'text-[#EBF2FF] hover:text-[#61F0FF]',
      ]"
      :aria-current="link.href === activeHash ? 'page' : undefined"
      @click="emit('navigate', link.href)"
    >
      {{ t(link.labelKey) }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { NavLink } from './links'

defineProps<{
  links: readonly NavLink[]
  activeHash: string
}>()

const emit = defineEmits<{
  navigate: [href: string]
}>()

// i18n composable (auto-imported from app/composables) — labels only.
const { t } = useI18n()
</script>

<style scoped>
/* Puente hasta la migración de tokens. DESIGN.md navbar.linkTypography pide
   nav-md (14/500) desde 844 y nav-lg (16/500) desde 1440, y ninguno de los dos
   es parada de Tailwind. Cuando exista un tailwind.config con los screens del
   contrato, esto se sustituye por utilidades y este bloque desaparece. */
@media (min-width: 844px) {
  .nav-link { font-size: 14px; line-height: 1.429; }
}

@media (min-width: 1440px) {
  .nav-link { font-size: 16px; line-height: 1.5; }
}
</style>
