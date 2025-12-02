import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BenefitCard from '../../app/components/Benefits/BenefitCard.vue'
import { globalStubs } from '../../vitest.setup'

const baseProps = {
  title: 'Ahorro Garantizado',
  description: 'Reduce costes operativos con optimización inteligente.',
}

describe('BenefitCard', () => {
  it('renders title and description', () => {
    const wrapper = mount(BenefitCard, {
      props: { ...baseProps },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain(baseProps.title)
    expect(wrapper.text()).toContain('Reduce costes')
  })

  it('applies default primary background class', () => {
    const wrapper = mount(BenefitCard, {
      props: { ...baseProps },
      global: { stubs: globalStubs },
    })
    expect(wrapper.html()).toContain('bg-[#61F0FF]')
  })

  it('applies secondary variant background', () => {
    const wrapper = mount(BenefitCard, {
      props: { ...baseProps, variant: 'secondary' },
      global: { stubs: globalStubs },
    })
    expect(wrapper.html()).toContain('bg-[#FFC152]')
  })
})
