import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmEmailPage from '../../app/pages/confirm-email.vue'

interface HeadMeta {
  title?: string
  meta?: Array<Record<string, unknown>>
  link?: Array<Record<string, unknown>>
  [key: string]: unknown
}

describe('ConfirmEmail Page', () => {
  let capturedMeta: HeadMeta | undefined

  beforeEach(() => {
    capturedMeta = undefined
    // @ts-expect-error - Overriding global stubs for test
    globalThis.definePageMeta = () => {}
    // @ts-expect-error - Capture useHead calls for test
    globalThis.useHead = (meta?: Record<string, unknown> | (() => Record<string, unknown>)) => {
      // The page passes a getter so the head re-evaluates when the locale
      // changes after hydration (the locale is no longer negotiated from
      // Accept-Language — see app/app.vue). Unwrap it here so the assertions
      // below keep inspecting the payload rather than the function.
      capturedMeta = (typeof meta === 'function' ? meta() : meta) as HeadMeta
    }
  })

  describe('Component integration', () => {
    it('mounts and renders ConfirmEmailCard component', () => {
      const wrapper = mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      expect(wrapper.findComponent({ name: 'ConfirmEmailCard' }).exists()).toBe(true)
    })

    it('renders ConfirmEmailCard content', () => {
      const wrapper = mount(ConfirmEmailPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :to="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      // Component uses real i18n composable which loads en.json
      expect(wrapper.text()).toContain('Confirm Your Email')
      expect(wrapper.text()).toContain('Hello, User')
    })
  })

  describe('SEO metadata', () => {
    it('calls useHead with confirm email meta tags', () => {
      mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      expect(capturedMeta).toBeDefined()
      const meta = capturedMeta as HeadMeta
      expect(meta.title).toBeDefined()
      expect(meta.meta).toBeDefined()
    })

    it('includes open graph meta tags', () => {
      mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const ogTags = metaArray.filter((m) => (m.property as string)?.startsWith('og:'))
      expect(ogTags.length).toBeGreaterThan(0)
    })

    it('includes twitter meta tags', () => {
      mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const twitterTags = metaArray.filter((m) => (m.name as string)?.startsWith('twitter:'))
      expect(twitterTags.length).toBeGreaterThan(0)
    })

    it('includes canonical link for confirm-email', () => {
      mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      const canonical = (meta.link as Array<Record<string, unknown>>)?.find((l) => l.rel === 'canonical')
      expect(canonical).toBeDefined()
      expect((canonical?.href as string) || '').toContain('/confirm-email')
    })

    it('is noindex: a form is not indexable content', () => {
      mount(ConfirmEmailPage, {
        global: {
          stubs: {
            ConfirmEmailCard: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const robots = metaArray.find((m) => m.name === 'robots')
      // Deliberate: /confirm-email is a form, and the only variant ever served
      // is the default locale's (Spanish covers the landing only). The
      // self-referential canonical above is the case where the two coexist
      // unambiguously.
      expect(robots?.content).toBe('noindex, nofollow')
    })
  })
})
