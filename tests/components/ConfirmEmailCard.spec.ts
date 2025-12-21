import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmEmailCard from '../../app/components/ConfirmEmail/ConfirmEmailCard.vue'

describe('ConfirmEmailCard', () => {
  const mountComponent = () => mount(ConfirmEmailCard, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a :to="to"><slot /></a>',
          props: ['to']
        }
      }
    }
  })

  describe('Rendering', () => {
    it('renders the title heading', () => {
      const wrapper = mountComponent()
      const h1 = wrapper.find('h1')

      expect(h1.exists()).toBe(true)
      // Test uses real i18n composable which loads en.json
      expect(h1.text()).toContain('Confirm Your Email')
    })

    it('renders the welcome heading', () => {
      const wrapper = mountComponent()
      const h2 = wrapper.find('h2')

      expect(h2.exists()).toBe(true)
      expect(h2.text()).toContain('Hello, User')
    })

    it('renders the description paragraph', () => {
      const wrapper = mountComponent()
      const paragraph = wrapper.find('p')

      expect(paragraph.exists()).toBe(true)
      expect(paragraph.text()).toContain('confirmation email')
    })
  })

  describe('Navigation', () => {
    it('renders CTA button linking to signin', () => {
      const wrapper = mountComponent()
      const signinLink = wrapper.findAll('a').find(a => a.attributes('to') === '/signin' && a.attributes('aria-label') === 'Sign in')

      expect(signinLink).toBeDefined()
      expect(signinLink?.text()).toContain('Sign In')
    })

    it('renders footer logo linking to home', () => {
      const wrapper = mountComponent()
      const homeLink = wrapper.find('a[aria-label="Home"]')

      expect(homeLink.exists()).toBe(true)
      expect(homeLink.attributes('to')).toBe('/')
    })
  })

  describe('Images', () => {
    it('renders the title envelope illustration', () => {
      const wrapper = mountComponent()
      const illustration = wrapper.find('img[alt="Email confirmation illustration"]')

      expect(illustration.exists()).toBe(true)
      expect(illustration.attributes('src')).toBe('/images/confirm-email/title-envelope.svg')
    })

    it('renders the Hermes logo', () => {
      const wrapper = mountComponent()
      const logo = wrapper.find('img[alt="Hermes Logistics"]')

      expect(logo.exists()).toBe(true)
      expect(logo.attributes('src')).toBe('/images/confirm-email/hermes-logo-full.svg')
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels on links', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('a[aria-label="Sign in"]').exists()).toBe(true)
      expect(wrapper.find('a[aria-label="Home"]').exists()).toBe(true)
    })

    it('has alt text on all images', () => {
      const wrapper = mountComponent()
      const images = wrapper.findAll('img')

      images.forEach((img) => {
        expect(img.attributes('alt')).toBeTruthy()
      })
    })
  })
})
