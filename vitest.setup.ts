import { beforeAll, vi } from 'vitest'
import { ref } from 'vue'

beforeAll(() => {
  // jsdom ships no usable window.matchMedia — stub one that records its
  // listeners so tests can drive breakpoint changes via dispatchEvent().
  // @ts-expect-error - Stubbing matchMedia for tests
  globalThis.matchMedia = vi.fn((query: string) => {
    const listeners: Array<(event: unknown) => void> = []
    const remove = (handler: (event: unknown) => void) => {
      const index = listeners.indexOf(handler)
      if (index > -1) listeners.splice(index, 1)
    }
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((_type: string, handler: (event: unknown) => void) => { listeners.push(handler) }),
      removeEventListener: vi.fn((_type: string, handler: (event: unknown) => void) => { remove(handler) }),
      addListener: vi.fn((handler: (event: unknown) => void) => { listeners.push(handler) }),
      removeListener: vi.fn((handler: (event: unknown) => void) => { remove(handler) }),
      dispatchEvent: vi.fn((event: unknown) => {
        listeners.slice().forEach(handler => handler(event))
        return true
      }),
    }
  })

  // Stub common Nuxt components used in SFCs
  // @ts-expect-error - Stubbing custom elements for tests
  globalThis.customElements?.define?.('nuxt-link', class extends HTMLElement {})
  // Stub Nuxt composables used in tests.
  // useState(key, init) shares one ref per key, like the real one — returning a
  // fresh ref per call would make cross-call state (the locale) untestable.
  const states = new Map<string, ReturnType<typeof ref>>()
  // @ts-expect-error - Stubbing useState for tests
  globalThis.useState = (key: string, init: () => unknown) => {
    if (!states.has(key)) states.set(key, ref(init()))
    return states.get(key)!
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
  // Auto-imports que usan las páginas de auth/KYC sin importarlos explícitamente.
  // @ts-expect-error - Stubbing definePageMeta for tests
  globalThis.definePageMeta = () => {}
  // @ts-expect-error - Stubbing useHead for tests
  globalThis.useHead = (_meta?: Record<string, unknown>) => {}
  // @ts-expect-error - Stubbing useSeoMeta for tests
  globalThis.useSeoMeta = (_meta?: Record<string, unknown>) => {}
  // @ts-expect-error - Stubbing useRouter for tests
  globalThis.useRouter = () => ({
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    back: () => {},
    forward: () => {},
    go: () => {},
    currentRoute: ref({ path: '/', params: {}, query: {} }),
  })
  // @ts-expect-error - Stubbing useRoute for tests
  globalThis.useRoute = () => ({ path: '/', params: {}, query: {}, meta: {} })
  // @ts-expect-error - Stubbing onMounted for tests
  globalThis.onMounted = (fn: () => void) => fn()
})

// Provide minimal stubs for Vue global components when mounting
export const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    // Renders the href so tests can assert on the crawlable URL, not just the slot.
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  NuxtImage: {
    name: 'NuxtImage',
    template: '<img />',
    props: ['src', 'alt'],
  },
  NuxtImg: {
    name: 'NuxtImg',
    template: '<img />',
    props: ['src', 'alt'],
  },
}
