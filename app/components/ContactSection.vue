<template>
  <section id="contact" class="relative min-h-[700px] md:h-[716px] overflow-hidden" aria-labelledby="contact-heading">
    <!-- Background -->
    <ContactBackground />

    <!-- Mobile Layout: Illustration on top, content below -->
    <div class="relative z-10 flex flex-col md:hidden items-center justify-start h-full px-4 pt-8">
      <!-- Illustration for mobile -->
      <div class="mb-4">
        <NuxtImg
          src="/images/contact/contact-illustration.svg"
          alt="Contact illustration"
          class="w-[200px] h-auto"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
      </div>
      <!-- Card for mobile -->
      <ContactCard @open-modal="emit('open-modal')" />
    </div>

    <!-- Desktop Layout -->
    <div class="relative z-10 hidden md:flex items-center justify-center h-full px-4">
      <ContactCard @open-modal="emit('open-modal')" />
    </div>

    <!-- Illustration for desktop -->
    <ContactIllustration />
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'open-modal': []
}>()
</script>
