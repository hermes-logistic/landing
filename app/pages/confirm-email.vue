<template>
  <ConfirmEmailCard />
</template>

<script setup lang="ts">
import ConfirmEmailCard from '../components/ConfirmEmail/ConfirmEmailCard.vue'

import { useI18n } from '../composables/useI18n'

definePageMeta({ layout: 'auth' })

const { t, locale } = useI18n()

useHead({
  title: `${t('auth.confirmEmail.title')} - ${t('whoWeAre.title')}`,
  meta: [
    { name: 'description', content: t('auth.confirmEmail.description') },
    { name: 'keywords', content: 'email confirmation, signup, hermes logistics' },
    { name: 'author', content: 'Hermes Logistics' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph
    { property: 'og:title', content: `${t('auth.confirmEmail.title')} - ${t('whoWeAre.title')}` },
    { property: 'og:description', content: t('auth.confirmEmail.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/og-image.png' },
    { property: 'og:url', content: 'https://www.hermesv.io/confirm-email' },
    { property: 'og:locale', content: locale.value === 'es' ? 'es_ES' : 'en_US' },
    { property: 'og:locale:alternate', content: locale.value === 'es' ? 'en_US' : 'es_ES' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${t('auth.confirmEmail.title')} - ${t('whoWeAre.title')}` },
    { name: 'twitter:description', content: t('auth.confirmEmail.description') },
    { name: 'twitter:image', content: '/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.hermesv.io/confirm-email' }
  ]
})
</script>
