<template>
  <!-- Redirect page: navigate to /signin on mount -->
  <div />
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
const router = useRouter()
router.replace('/signin')
</script>
