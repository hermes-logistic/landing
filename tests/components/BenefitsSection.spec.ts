import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BenefitsSection from '../../app/components/BenefitsSection.vue'

describe('BenefitsSection', () => {
  it('renders at least one known benefit translation', () => {
    const wrapper = mount(BenefitsSection)
    expect(wrapper.html()).toContain('Time and Money Savings')
  })
})
