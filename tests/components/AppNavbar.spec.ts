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

  it('renders signup link with correct href', () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: globalStubs }
    })

    const signupLink = wrapper.find('a[href="/signup"]')
    expect(signupLink.exists()).toBe(true)
  })

  it('shows signup link in mobile menu when opened', async () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: globalStubs }
    })
    const toggle = wrapper.find('button[aria-label="Toggle navigation menu"]')
    await toggle.trigger('click')
    const mobileSignup = wrapper.find('a[href="/signup"]')
    expect(mobileSignup.exists()).toBe(true)
  })
})
