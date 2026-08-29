<template>
  <div class="hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8">
    <!-- font-medium = label-lg (500) de DESIGN.md. OJO: no existe poppins-500.woff2 en
         public/fonts/, así que hoy renderiza a 400. Gap de asset abierto y escalado —
         no lo "arregles" cambiando el peso. -->
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.href"
      :class="[
        'font-medium transition-colors duration-200 md:text-xs lg:text-sm xl:text-base',
        link.href === activeHash ? 'text-[#61F0FF]' : 'text-white hover:text-[#61F0FF]',
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
