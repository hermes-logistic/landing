import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SigninForm from '../../app/components/Signin/SigninForm.vue'
import * as validation from '../../app/utils/validation'

describe('SigninForm - OAuth Security', () => {
  it('validates OAuth provider before redirect', () => {
    const isValidOAuthProviderSpy = vi.spyOn(validation, 'isValidOAuthProvider')
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const wrapper = mount(SigninForm, {
      global: {
        stubs: {
          NuxtLink: true,
          SocialLoginButtons: true
        }
      }
    })

    // @ts-expect-error - Accessing component internal methods for testing
    const component = wrapper.vm as { handleSocialLogin: (provider: string) => void }
    
    // Test with valid provider
    component.handleSocialLogin('google')
    expect(isValidOAuthProviderSpy).toHaveBeenCalledWith('google')
    
    // Test with invalid provider (simulating potential attack)
    component.handleSocialLogin('evil.com' as 'google')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid OAuth provider:', 'evil.com')
    
    isValidOAuthProviderSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('does not redirect for invalid OAuth provider', () => {
    const originalLocation = window.location.href
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const wrapper = mount(SigninForm, {
      global: {
        stubs: {
          NuxtLink: true,
          SocialLoginButtons: true
        }
      }
    })

    // @ts-expect-error - Accessing component internal methods for testing
    const component = wrapper.vm as { handleSocialLogin: (provider: string) => void }
    
    // Attempt redirect with invalid provider
    component.handleSocialLogin('malicious-site.com' as 'google')
    
    // Location should not have changed
    expect(window.location.href).toBe(originalLocation)
    expect(consoleErrorSpy).toHaveBeenCalled()
    
    consoleErrorSpy.mockRestore()
  })
})
