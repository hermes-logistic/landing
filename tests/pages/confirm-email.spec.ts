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
    globalThis.useHead = (meta?: Record<string, unknown>) => {
      capturedMeta = meta as HeadMeta
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
  })
})
