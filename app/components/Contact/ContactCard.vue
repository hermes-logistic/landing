<template>
  <div class="relative w-full max-w-[1033px] md:h-[362px] mx-auto">
    <!-- Card Background -->
    <ContactCardBackground />

    <!-- Card Content -->
    <ContactCardContent @open-modal="emit('open-modal')" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'open-modal': []
}>()
</script>
