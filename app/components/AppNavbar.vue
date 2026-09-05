<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50"
    role="navigation"
    :aria-label="t('nav.aria.main')"
  >
    <!-- The bar's fill and hairline live here, on a child of <nav>, not on the
         <nav> itself. With the drawer open the <nav> also *contains* the panel,
         so a fill up there paints the same #001751 behind the panel's 2xl
         bottom corners: the corner clips correctly and the nav immediately
         refills it with an identical color, so the radius is invisible and the
         drawer ends in a straight line. A transparent <nav> over an opaque bar
         keeps the geometry identical and lets the 16px corners read.
         Full-bleed on purpose — the max-w-[1440px] centering belongs to the
         content row inside, not to the surface. -->
    <div
      :class="[
        'nav-surface border-b',
        isTop && !mobileMenuOpen ? 'nav-transparent' : 'nav-solid',
        mobileMenuOpen ? 'nav-drawer-open' : '',
      ]"
    >
      <div class="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 xl:px-20">
        <div class="flex items-center justify-between gap-4 md:gap-3 lg:gap-4 h-16 md:h-20">
          <!-- Logo. DESIGN.md navbar.logoWidth is a WIDTH token [130, 150, 150,
               190, 238], so 390 is sized by width: driving it from h-[30px] gave
               132.2px against the 130 the contract fixes. From 768 up the shipped
               heights already land on the token widths, so they stay as they are. -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink :to="homePath" :aria-label="t('nav.aria.home')">
              <img
                src="/images/hermes-logo.svg"
                :alt="t('nav.aria.logo')"
                width="238"
                height="54"
                class="w-[130px] h-auto md:w-auto md:h-[34px] lg:h-[43px] xl:h-[54px] block"
                decoding="async"
              >
            </NuxtLink>
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
              class="border border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-[#01051D] transition-colors duration-300 font-medium text-sm shrink-0 whitespace-nowrap md:px-4 md:py-2 lg:px-5 lg:py-2 xl:px-6"
              aria-haspopup="dialog"
              :aria-expanded="isContactModalOpen"
              @click="openContactModal"
            >
              {{ t('nav.cta') }}
            </button>
            <NavLangSwitch :locale="locale" />
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              class="text-[#EBF2FF] p-2"
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
      @open-contact="openContactModal"
    />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import NavLinks from './Navbar/NavLinks.vue'
import NavLangSwitch from './Navbar/NavLangSwitch.vue'
import NavMobileMenu from './Navbar/NavMobileMenu.vue'
import { NAV_LINKS } from './Navbar/links'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { isLocale, pathForLocale } from '~/composables/useLocaleRoutes'

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
const { t, locale } = useI18n()

// The logo returns to the current locale's home, not always to the English root.
const homePath = computed(() => pathForLocale(isLocale(locale.value) ? locale.value : 'en'))

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
.nav-surface {
  transition: background-color 200ms ease, border-color 200ms ease, backdrop-filter 200ms ease;
}

.nav-solid {
  background-color: rgba(0, 23, 81, 1); /* #001751 solid */
  border-bottom: 1px solid #B7CDF51F; /* border-hairline-cool */
}

.nav-transparent {
  background-color: rgba(0, 23, 81, 0.5); /* transparent at top */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #B7CDF51F; /* border-hairline-cool */
}

/* With the drawer open the hairline belongs to the drawer's own rounded bottom
   edge (navbar-drawer.borderWidth is 1px, singular): keeping the bar's border
   here would draw a second, square 1px line straight across those 2xl corners.
   Color, not width, so toggling the drawer shifts nothing — the 1px row stays
   in the box and keeps painting the bar's own #001751 through it, which is what
   holds the joint at a single hairline. Declared after .nav-solid /
   .nav-transparent so equal specificity resolves in its favour. */
.nav-drawer-open {
  border-bottom-color: transparent;
}
</style>
