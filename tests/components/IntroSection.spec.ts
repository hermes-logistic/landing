import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IntroSection from '../../app/components/IntroSection.vue'

describe('IntroSection', () => {
  it('renders translated hero title', () => {
    const wrapper = mount(IntroSection)
    expect(wrapper.text()).toContain('Transform your fleet')
  })
})
