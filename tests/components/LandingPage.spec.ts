import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LandingPage from '../../app/components/LandingPage.vue'
import { globalStubs } from '../../vitest.setup'

/** Section components are rendered as stubs; only the composition is asserted. */
function mountPage() {
  return mount(LandingPage, {
    global: {
      stubs: {
        ...globalStubs,
        AppNavbar: { name: 'AppNavbar', template: '<nav />', props: ['isContactModalOpen'] },
        HeroSection: true,
        WhoWeAreSection: true,
        OurPurposeSection: true,
        BenefitsSection: true,
        FeaturesSection: true,
        PricingSection: true,
        ContactSection: { name: 'ContactSection', template: '<contact-section-stub />' },
        AppFooter: true,
        ContactModal: { name: 'ContactModal', template: '<div />', props: ['isOpen'] },
      },
    },
  })
}

describe('LandingPage', () => {
  it('stacks the sections in the order the page reads', () => {
    const wrapper = mountPage()
    const order = [
      'hero-section-stub',
      'who-we-are-section-stub',
      'our-purpose-section-stub',
      'benefits-section-stub',
      'features-section-stub',
      'pricing-section-stub',
      'contact-section-stub',
      'app-footer-stub',
    ]
    const rendered = order.filter(tag => wrapper.html().includes(`<${tag}`))
    expect(rendered).toEqual(order)
  })

  it('mounts exactly one contact modal, closed', () => {
    const wrapper = mountPage()
    const modals = wrapper.findAllComponents({ name: 'ContactModal' })
    expect(modals).toHaveLength(1)
    expect(modals[0]!.props('isOpen')).toBe(false)
  })

  it('opens the modal when the navbar asks for it and closes it again', async () => {
    const wrapper = mountPage()
    const modal = () => wrapper.findComponent({ name: 'ContactModal' })

    await wrapper.findComponent({ name: 'AppNavbar' }).vm.$emit('open-contact-modal')
    expect(modal().props('isOpen')).toBe(true)

    await modal().vm.$emit('close')
    expect(modal().props('isOpen')).toBe(false)
  })

  it('opens the modal from the contact section CTA', async () => {
    const wrapper = mountPage()
    await wrapper.findComponent({ name: 'ContactSection' }).vm.$emit('open-modal')
    expect(wrapper.findComponent({ name: 'ContactModal' }).props('isOpen')).toBe(true)
  })
})
