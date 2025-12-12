import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignupPage from '../../app/pages/signup.vue'

describe('signup page', () => {
  it('renders SignupForm component', () => {
    const wrapper = mount(SignupPage, {
      global: {
        stubs: {
          SignupForm: {
            template: '<div class="signup-form-stub">SignupForm</div>'
          }
        }
      }
    })
    
    expect(wrapper.find('.signup-form-stub').exists()).toBe(true)
  })

  it('has the correct structure', () => {
    const wrapper = mount(SignupPage, {
      global: {
        stubs: {
          SignupForm: true
        }
      }
    })
    
    expect(wrapper.vm).toBeDefined()
  })
})
