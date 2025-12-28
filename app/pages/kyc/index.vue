<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'kyc'
})

const router = useRouter()

// Redirect to the profile page (first step)
onMounted(() => {
  router.replace('/kyc/profile')
})
</script>
