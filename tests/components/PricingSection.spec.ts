import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingSection from '../../app/components/PricingSection.vue'

// Stub i18n and PricingCard to surface plan names
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => {
    if (key === 'pricing.plans') {
      return [
        { name: 'Basic', units: 'U: 1-5', price: '$40.00', description: 'Desc', paymentSpecs: 'Specs', button: 'Get Plan', features: [] },
        { name: 'Enterprise', units: 'U: +60', price: 'Custom', description: 'Desc', paymentSpecs: 'Specs', button: 'Get Plan', features: [] }
      ]
    }
    return key
  }
}))

describe('PricingSection', () => {
  it('passes plans to cards', () => {
    const wrapper = mount(PricingSection, {
      global: {
        stubs: {
          PricingCard: {
            props: ['plan'],
            template: '<div class="plan-stub">{{ plan.name }}</div>'
          },
          PricingBackground: { template: '<div />' },
          PricingTitle: { template: '<div />' }
        }
      }
    })
    expect(wrapper.html()).toContain('Basic')
    expect(wrapper.html()).toContain('Enterprise')
  })
})
