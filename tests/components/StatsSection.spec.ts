import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsSection from '../../app/components/StatsSection.vue'

describe('StatsSection', () => {
  it('renders all stat percentage values', () => {
    const wrapper = mount(StatsSection)
    const text = wrapper.text()
    expect(text).toContain('10%')
    expect(text).toContain('20%')
    expect(text).toContain('40%')
  })
})
