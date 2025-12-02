import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingCard from '../../app/components/Pricing/PricingCard.vue'
import { globalStubs } from '../../vitest.setup'

const plan = {
  name: 'Starter',
  units: '50 envíos',
  price: '$49',
  description: 'Plan básico para operaciones pequeñas',
  paymentSpecs: 'Mensual',
  button: 'Comenzar',
  features: [
    'Seguimiento básico',
    'Reportes mensuales',
    'Soporte estándar'
  ]
}

describe('PricingCard', () => {
  it('renders plan name, price and button text', () => {
    const wrapper = mount(PricingCard, {
      props: { plan },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain(plan.name)
    expect(wrapper.text()).toContain(plan.price)
    expect(wrapper.text()).toContain(plan.button)
  })

  it('lists all features', () => {
    const wrapper = mount(PricingCard, {
      props: { plan },
      global: { stubs: globalStubs },
    })
    const features = wrapper.findAll('ul li')
    expect(features.length).toBe(plan.features.length)
  })
})
