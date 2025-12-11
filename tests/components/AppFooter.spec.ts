import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../../app/components/AppFooter.vue'

describe('AppFooter', () => {
  it('renders company name and links', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.text()).toContain('HERMES')
    expect(wrapper.text()).toContain('Privacy Policy')
  })
})
