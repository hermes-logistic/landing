<template>
  <SignupForm />
</template>

<script setup lang="ts">
import SignupForm from '../components/Signup/SignupForm.vue'

import { useI18n } from '../composables/useI18n'

definePageMeta({ layout: 'auth' })

const { t, locale } = useI18n()

useHead(() => ({
  title: `${t('auth.signup.title')} - ${t('whoWeAre.title')}`,
  meta: [
    { name: 'description', content: t('auth.signup.description') },
    { name: 'keywords', content: 'fleet management, route optimization, sign up, logistics, delivery' },
    { name: 'author', content: 'Hermes Logistics' },
    // noindex: es un formulario, no contenido. Además su versión servida es
    // siempre la del locale por defecto (el español sólo cubre la landing), así
    // que indexarla publicaría una única variante inglesa de una pantalla de
    // aplicación. El canonical de abajo es autorreferente, que es el caso en
    // que conviven sin ambigüedad con noindex.
    { name: 'robots', content: 'noindex, nofollow' },

    // Open Graph
    { property: 'og:title', content: `${t('auth.signup.title')} - ${t('whoWeAre.title')}` },
    { property: 'og:description', content: t('auth.signup.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/og-image.png' },
    { property: 'og:url', content: 'https://www.hermesv.io/signup' },
    { property: 'og:locale', content: locale.value === 'es' ? 'es_ES' : 'en_US' },
    { property: 'og:locale:alternate', content: locale.value === 'es' ? 'en_US' : 'es_ES' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${t('auth.signup.title')} - ${t('whoWeAre.title')}` },
    { name: 'twitter:description', content: t('auth.signup.description') },
    { name: 'twitter:image', content: '/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.hermesv.io/signup' }
  ]
}))
</script>
