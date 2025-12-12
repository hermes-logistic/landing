import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialLoginButtons from '../../app/components/Signup/SocialLoginButtons.vue'

describe('SocialLoginButtons', () => {
  it('renders Google and Microsoft buttons', () => {
    const wrapper = mount(SocialLoginButtons)
    
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    
    expect(wrapper.text()).toContain('Sign up with Google')
    expect(wrapper.text()).toContain('Sign up with Microsoft')
  })

  it('emits socialLogin event when Google button is clicked', async () => {
    const wrapper = mount(SocialLoginButtons)
    
    const googleButton = wrapper.findAll('button')[0]
    await googleButton.trigger('click')
    
    expect(wrapper.emitted('socialLogin')).toBeTruthy()
    expect(wrapper.emitted('socialLogin')?.[0]).toEqual(['google'])
  })

  it('emits socialLogin event when Microsoft button is clicked', async () => {
    const wrapper = mount(SocialLoginButtons)
    
    const microsoftButton = wrapper.findAll('button')[1]
    await microsoftButton.trigger('click')
    
    expect(wrapper.emitted('socialLogin')).toBeTruthy()
    expect(wrapper.emitted('socialLogin')?.[0]).toEqual(['microsoft'])
  })

  it('has correct styling for buttons', () => {
    const wrapper = mount(SocialLoginButtons)
    
    const buttons = wrapper.findAll('button')
    buttons.forEach(button => {
      expect(button.classes()).toContain('w-full')
      expect(button.classes()).toContain('rounded-full')
      expect(button.classes()).toContain('border-[#61F0FF]')
    })
  })

  it('contains SVG icons for both providers', () => {
    const wrapper = mount(SocialLoginButtons)
    
    const svgs = wrapper.findAll('svg')
    expect(svgs).toHaveLength(2)
    
    svgs.forEach(svg => {
      expect(svg.attributes('width')).toBe('20')
      expect(svg.attributes('height')).toBe('20')
    })
  })
})
