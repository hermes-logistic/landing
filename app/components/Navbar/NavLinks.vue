<template>
  <div class="hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8">
    <!-- font-normal (400) y no label-lg (500) de DESIGN.md: no existe poppins-500.woff2
         en public/fonts/ (caras: 300/400/600/700/800), así que un 500 se pintaría con
         la 400 igualmente. Declaramos lo que realmente se pinta. Si se embarca el face
         500, esto pasa a font-medium y ya. El estado activo va por color + aria-current,
         nunca por peso. -->
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.href"
      :class="[
        'font-normal transition-colors duration-200 md:text-xs lg:text-sm xl:text-base',
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
