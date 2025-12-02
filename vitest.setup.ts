import { beforeAll } from 'vitest'
import { ref } from 'vue'

beforeAll(() => {
  // Stub common Nuxt components used in SFCs
  // @ts-ignore
  globalThis.customElements?.define?.('nuxt-link', class extends HTMLElement {})
  // Stub Nuxt composables used in tests
  // useState(key, init) -> simple ref
  // @ts-ignore
  globalThis.useState = (key: string, init: () => any) => {
    return ref(init())
  }
  // @ts-ignore
  globalThis.useRequestHeaders = () => ({ 'accept-language': 'en' })
  // @ts-ignore
  globalThis.useI18n = () => {
    const localeRef = ref('en')
    return {
      t: (key: string) => key,
      locale: localeRef,
      setLocale: (l: string) => { localeRef.value = l },
    }
  }
})

// Provide minimal stubs for Vue global components when mounting
export const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to'],
  },
  NuxtImage: {
    name: 'NuxtImage',
    template: '<img />',
    props: ['src', 'alt'],
  },
}
