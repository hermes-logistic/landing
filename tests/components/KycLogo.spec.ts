import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KycLogo from '../../app/components/Kyc/KycLogo.vue'

describe('KycLogo', () => {
  it('renders the logo link', () => {
    const wrapper = mount(KycLogo)
    
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/')
  })

  it('has proper aria-label for accessibility', () => {
    const wrapper = mount(KycLogo)
    
    expect(wrapper.find('a').attributes('aria-label')).toBe('Hermes - Home')
  })

  it('renders the logo image', () => {
    const wrapper = mount(KycLogo)
    const img = wrapper.find('img')
    
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('hermes-logo')
    expect(img.attributes('alt')).toBe('Hermes Logistics')
  })

  it('has proper image dimensions', () => {
    const wrapper = mount(KycLogo)
    const img = wrapper.find('img')
    
    expect(img.attributes('width')).toBe('200')
    expect(img.attributes('height')).toBe('48')
  })

  it('applies responsive height classes', () => {
    const wrapper = mount(KycLogo)
    const img = wrapper.find('img')
    
    expect(img.classes()).toContain('h-10')
    expect(img.classes()).toContain('lg:h-12')
  })
})
