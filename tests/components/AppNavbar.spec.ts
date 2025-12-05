import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '../../app/components/AppNavbar.vue'
import { globalStubs } from '../../vitest.setup'

describe('AppNavbar', () => {
  it('mounts without errors', () => {
    const wrapper = mount(AppNavbar, {
      global: {
        stubs: globalStubs,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contains nav or links', () => {
    const wrapper = mount(AppNavbar, {
      global: {
        stubs: globalStubs,
      },
    })
    const hasNav = wrapper.find('nav').exists()
    const hasLinks = wrapper.findAll('a').length > 0
    expect(hasNav || hasLinks).toBe(true)
  })
})
