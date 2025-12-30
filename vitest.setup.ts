import { beforeAll } from 'vitest'
import { ref } from 'vue'

beforeAll(() => {
  // Stub common Nuxt components used in SFCs
  // @ts-expect-error - Stubbing custom elements for tests
  globalThis.customElements?.define?.('nuxt-link', class extends HTMLElement {})
  // Stub Nuxt composables used in tests
  // useState(key, init) -> simple ref
  // @ts-expect-error - Stubbing useState for tests
  globalThis.useState = (key: string, init: () => unknown) => {
    return ref(init())
  }
  // @ts-expect-error - Stubbing useRequestHeaders for tests
  globalThis.useRequestHeaders = () => ({ 'accept-language': 'en' })
  // @ts-expect-error - Stubbing useI18n for tests
  globalThis.useI18n = () => {
    const localeRef = ref('en')
    return {
      t: (key: string) => key,
      locale: localeRef,
      setLocale: (l: string) => { localeRef.value = l },
    }
  }
  // @ts-expect-error - Stubbing definePageMeta for tests
  globalThis.definePageMeta = () => {}
  // @ts-expect-error - Stubbing useHead for tests
  globalThis.useHead = (_meta?: Record<string, unknown>) => {}
  // @ts-expect-error - Stubbing useRouter for tests
  globalThis.useRouter = () => ({
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    back: () => {},
    forward: () => {},
    go: () => {},
    currentRoute: ref({ path: '/', params: {}, query: {} })
  })
  // @ts-expect-error - Stubbing onMounted for tests
  globalThis.onMounted = (fn: () => void) => fn()
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
