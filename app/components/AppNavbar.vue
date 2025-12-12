<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 border-b', isTop ? 'nav-transparent backdrop-blur-lg' : 'nav-solid']" role="navigation" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <a href="/" aria-label="Hermes - Home">
            <img src="/images/hermes-logo.svg" alt="Hermes Logistics logo" width="120" height="40" class="logo-img" loading="lazy" decoding="async" fetchpriority="low">
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#who-we-are" class="text-white hover:text-[#61F0FF] transition-colors duration-200 text-base font-semibold">
            {{ t('nav.who') }}
          </a>
          <a href="#benefits" class="text-white hover:text-[#61F0FF] transition-colors duration-200 text-base font-normal">
            {{ t('nav.benefits') }}
          </a>
          <a href="#features" class="text-white hover:text-[#61F0FF] transition-colors duration-200 text-base font-normal">
            {{ t('nav.features') }}
          </a>
          <a href="#pricing" class="text-white hover:text-[#61F0FF] transition-colors duration-200 text-base font-normal">
            {{ t('nav.pricing') }}
          </a>
          <a href="/signup" class="text-white hover:text-[#61F0FF] transition-colors duration-200 text-base font-semibold">
            {{ t('auth.signup.heading') }}
          </a>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:flex items-center space-x-4">
          <div>
            <button
              class="px-6 py-2.5 border-[1.5px] border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-white transition-all duration-300 font-bold text-sm tracking-wide"
              @click="openContactModal"
            >
              {{ t('nav.contact') }}
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <button :class="['text-sm px-3 py-1 rounded', locale === 'en' ? 'bg-white/10 text-white' : 'text-white/70']" @click="setLocale('en')">EN</button>
            <button :class="['text-sm px-3 py-1 rounded', locale === 'es' ? 'bg-white/10 text-white' : 'text-white/70']" @click="setLocale('es')">ES</button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            class="text-white p-2" 
            :aria-expanded="mobileMenuOpen" 
            aria-label="Toggle navigation menu"
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
    <div v-if="mobileMenuOpen" id="mobile-menu" class="md:hidden bg-[#001751] border-t border-white/10">
      <div class="px-4 py-4 space-y-3">
        <a href="/signup" class="block text-white hover:text-[#61F0FF] py-2">{{ t('auth.signup.heading') }}</a>
        <a href="#who-we-are" class="block text-white hover:text-[#61F0FF] py-2">{{ t('nav.who') }}</a>
        <a href="#benefits" class="block text-white hover:text-[#61F0FF] py-2">{{ t('nav.benefits') }}</a>
        <a href="#features" class="block text-white hover:text-[#61F0FF] py-2">{{ t('nav.features') }}</a>
        <a href="#features" class="block text-white hover:text-[#61F0FF] py-2">{{ t('nav.products') }}</a>
        <a href="#pricing" class="block text-white hover:text-[#61F0FF] py-2">{{ t('nav.pricing') }}</a>
        <button
          class="w-full mt-4 px-6 py-2.5 border-[1.5px] border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-white transition-all duration-300 font-bold text-sm tracking-wide"
          @click="openContactModal"
        >
          {{ t('nav.contact') }}
        </button>
        <div class="flex items-center justify-center space-x-3 mt-3">
          <button :class="['px-3 py-1 rounded', locale === 'en' ? 'bg-white/10 text-white' : 'text-white/70']" @click="setLocale('en')">EN</button>
          <button :class="['px-3 py-1 rounded', locale === 'es' ? 'bg-white/10 text-white' : 'text-white/70']" @click="setLocale('es')">ES</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Contact Modal -->
  <ContactModal :is-open="isContactModalOpen" @close="isContactModalOpen = false" />
</template>

<script setup lang="ts" name="NavBar">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ContactModal from './ContactModal.vue'

const mobileMenuOpen = ref(false)
const isTop = ref(true)
const isContactModalOpen = ref(false)

// i18n composable (auto-imported from app/composables)
const { t, locale, setLocale } = useI18n()

function onScroll() {
  isTop.value = window.scrollY < 20
}

function openContactModal() {
  isContactModalOpen.value = true
  mobileMenuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
nav {
  transition: background-color 200ms ease, border-color 200ms ease;
}

.logo-img {
  display: block;
  width: auto;
  height: 54px;
}

.nav-solid {
  background-color: rgba(0, 23, 81, 1) !important; /* #001751 solid */
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
}

.nav-transparent {
  background-color: rgba(0, 23, 81, 0.5) !important; /* transparent at top */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
}
</style>
