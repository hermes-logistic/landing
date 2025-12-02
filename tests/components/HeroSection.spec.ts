import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../../app/components/HeroSection.vue'
import { globalStubs } from '../../vitest.setup'

describe('HeroSection', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: globalStubs,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders some content', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: globalStubs,
      },
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
  })
})
