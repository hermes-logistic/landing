import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SigninPage from '../../app/pages/signin.vue'

interface HeadMeta {
  title?: string
  meta?: Array<Record<string, unknown>>
  link?: Array<Record<string, unknown>>
  [key: string]: unknown
}

describe('Signin Page', () => {
  let capturedMeta: HeadMeta | undefined

  beforeEach(() => {
    capturedMeta = undefined
    // Reset global stubs for each test
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
    it('mounts and renders SigninForm component', () => {
      const wrapper = mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      expect(wrapper.findComponent({ name: 'SigninForm' }).exists()).toBe(true)
    })

    it('renders with actual SigninForm component', () => {
      const wrapper = mount(SigninPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>'
            },
            SocialLoginButtons: true
          }
        }
      })

      // Verify that the real SigninForm renders its form elements
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('SigninForm component is functional within the page', async () => {
      const wrapper = mount(SigninPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>'
            },
            SocialLoginButtons: true
          }
        }
      })

      // Test form validation works
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')
      await wrapper.vm.$nextTick()

      // Should show validation error
      expect(wrapper.text()).toContain('Please enter a valid email address')
    })
  })

  describe('SEO metadata', () => {
    it('calls useHead with signin meta tags', () => {
      mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      expect(capturedMeta).toBeDefined()
      const meta = capturedMeta as HeadMeta
      expect(meta.title).toBeDefined()
    })

    it('includes open graph meta tags', () => {
      mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      expect(meta.meta).toBeDefined()
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const ogTags = metaArray.filter((m) => (m.property as string)?.startsWith('og:'))
      expect(ogTags.length).toBeGreaterThan(0)
    })

    it('includes twitter meta tags', () => {
      mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      expect(meta.meta).toBeDefined()
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const twitterTags = metaArray.filter((m) => (m.name as string)?.startsWith('twitter:'))
      expect(twitterTags.length).toBeGreaterThan(0)
    })

    it('includes canonical link', () => {
      mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      expect(meta.link).toBeDefined()
      const canonical = (meta.link as Array<Record<string, unknown>>)?.find((l) => l.rel === 'canonical')
      expect(canonical).toBeDefined()
      expect(canonical?.href).toContain('/signin')
    })

    it('is noindex: a form is not indexable content', () => {
      mount(SigninPage, {
        global: {
          stubs: {
            SigninForm: true
          }
        }
      })

      const meta = capturedMeta as HeadMeta
      const metaArray = (meta.meta as Array<Record<string, unknown>>) || []
      const robots = metaArray.find((m) => m.name === 'robots')
      // Deliberate: /signin is a form, and the only variant ever served is the
      // default locale's (Spanish covers the landing only). The self-referential
      // canonical above is the case where the two coexist unambiguously.
      expect(robots?.content).toBe('noindex, nofollow')
    })
  })
})
