<template>
  <LandingPage />
</template>

<script setup lang="ts">
import LandingPage from '../components/LandingPage.vue'
import { useLocalePage } from '../composables/useLocalePage'

// La landing es su propio shell (LandingPage.vue trae navbar, secciones, footer
// y modal), así que no pasa por ningun layout. Los layouts `auth`/`kyc`/
// `dashboard` son de la web app y se declaran en sus propias paginas.
definePageMeta({ layout: false })

// Spanish lives on its own indexable URL rather than being negotiated from
// Accept-Language over the root — see app/composables/useLocaleRoutes.ts.
useLocalePage('es')
</script>
