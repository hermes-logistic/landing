<template>
  <LandingPage />
</template>

<script setup lang="ts">
import LandingPage from '../components/LandingPage.vue'
import { useLocalePage } from '../composables/useLocalePage'

// English is served from the root, so `/` is also the x-default target.
useLocalePage('en')
</script>
