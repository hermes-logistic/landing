<template>
  <LandingPage />
</template>

<script setup lang="ts">
import LandingPage from '../components/LandingPage.vue'
import { useLocalePage } from '../composables/useLocalePage'

// Spanish lives on its own indexable URL rather than being negotiated from
// Accept-Language over the root — see app/composables/useLocaleRoutes.ts.
useLocalePage('es')
</script>
