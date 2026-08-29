<template>
  <div
    v-if="open"
    id="mobile-menu"
    ref="rootEl"
    class="md:hidden bg-[#001751] border-t border-[#B7CDF51F]"
  >
    <div class="px-5 py-4 space-y-3">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.href"
        :class="[
          'block py-2 font-normal',
          link.href === activeHash ? 'text-[#61F0FF]' : 'text-[#EBF2FF] hover:text-[#61F0FF]',
        ]"
        :aria-current="link.href === activeHash ? 'page' : undefined"
        @click="emit('navigate', link.href)"
      >
        {{ t(link.labelKey) }}
      </a>

      <button
        class="w-full mt-4 px-6 py-2.5 border border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-[#01051D] transition-colors duration-300 font-bold text-sm tracking-wide shrink-0 whitespace-nowrap"
        aria-haspopup="dialog"
        :aria-expanded="isContactModalOpen"
        @click="emit('openContact')"
      >
        {{ t('nav.cta') }}
      </button>

      <div class="flex items-center justify-center mt-3">
        <NavLangSwitch
          :locale="locale"
          variant="mobile"
          @select="emit('selectLocale', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import NavLangSwitch from './NavLangSwitch.vue'
import type { NavLink } from './links'
import { useFocusTrap } from '~/composables/useFocusTrap'

const props = defineProps<{
  open: boolean
  links: readonly NavLink[]
  activeHash: string
  locale: string
  isContactModalOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  navigate: [href: string]
  selectLocale: [value: string]
  openContact: []
}>()

// i18n composable (auto-imported from app/composables) — labels only.
const { t } = useI18n()

const rootEl = ref<HTMLElement | null>(null)

useFocusTrap(rootEl, toRef(props, 'open'), () => emit('close'))
</script>
