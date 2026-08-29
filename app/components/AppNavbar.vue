<template>
  <nav
    :class="['fixed top-0 left-0 right-0 z-50 border-b', isTop ? 'nav-transparent' : 'nav-solid']"
    role="navigation"
    :aria-label="t('nav.aria.main')"
  >
    <div class="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 xl:px-20">
      <div class="flex items-center justify-between gap-4 h-16 md:h-20">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <a href="/" :aria-label="t('nav.aria.home')">
            <img
              src="/images/hermes-logo.svg"
              alt="Hermes Logistics logo"
              width="238"
              height="54"
              class="h-[30px] md:h-[34px] lg:h-[43px] xl:h-[54px] w-auto block"
              decoding="async"
            >
          </a>
        </div>

        <!-- Desktop Navigation -->
        <NavLinks
          :links="NAV_LINKS"
          :active-hash="activeHash"
          @navigate="onNavigate"
        />

        <!-- CTA Button + language switch -->
        <div class="hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8">
          <button
            class="border border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-[#01051D] transition-all duration-300 font-bold text-sm tracking-wide md:px-4 md:py-2 lg:px-5 lg:py-2.5 xl:px-6"
            aria-haspopup="dialog"
            :aria-expanded="isContactModalOpen"
            @click="openContactModal"
          >
            {{ t('nav.cta') }}
          </button>
          <NavLangSwitch :locale="locale" @select="setLocale" />
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            class="text-white p-2"
            :aria-expanded="mobileMenuOpen"
            :aria-label="t('nav.aria.toggleMenu')"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <NavMobileMenu
      :open="mobileMenuOpen"
      :links="NAV_LINKS"
      :active-hash="activeHash"
      :locale="locale"
      :is-contact-modal-open="isContactModalOpen"
      @close="closeMobileMenu"
      @navigate="onNavigate"
      @select-locale="setLocale"
      @open-contact="openContactModal"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavLinks from './Navbar/NavLinks.vue'
import NavLangSwitch from './Navbar/NavLangSwitch.vue'
import NavMobileMenu from './Navbar/NavMobileMenu.vue'
import { NAV_LINKS } from './Navbar/links'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

defineProps<{
  isContactModalOpen: boolean
}>()

const emit = defineEmits<{
  openContactModal: []
  closeContactModal: []
}>()

const mobileMenuOpen = ref(false)
const isTop = ref(true)
const activeHash = ref(typeof window === 'undefined' ? '' : window.location.hash)

// i18n composable (auto-imported from app/composables)
const { t, locale, setLocale } = useI18n()

useBodyScrollLock(mobileMenuOpen)

let desktopQuery: MediaQueryList | null = null

function onScroll() {
  isTop.value = window.scrollY < 20
}

function onHashChange() {
  activeHash.value = window.location.hash
}

// Reset the drawer when crossing into the desktop breakpoint, so it can't
// reappear already open when the viewport narrows again.
function onDesktopChange(event: MediaQueryListEvent) {
  if (event.matches) mobileMenuOpen.value = false
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function onNavigate(href: string) {
  activeHash.value = href
  mobileMenuOpen.value = false
}

function openContactModal() {
  emit('openContactModal')
  mobileMenuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('hashchange', onHashChange)
  if (typeof window.matchMedia === 'function') {
    desktopQuery = window.matchMedia('(min-width: 768px)')
    desktopQuery.addEventListener('change', onDesktopChange)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('hashchange', onHashChange)
  desktopQuery?.removeEventListener('change', onDesktopChange)
  desktopQuery = null
})
</script>

<style scoped>
nav {
  transition: background-color 200ms ease, border-color 200ms ease, backdrop-filter 200ms ease;
}

.nav-solid {
  background-color: rgba(0, 23, 81, 1); /* #001751 solid */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-transparent {
  background-color: rgba(0, 23, 81, 0.5); /* transparent at top */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
