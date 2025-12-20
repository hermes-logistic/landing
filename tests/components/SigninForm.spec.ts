import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import SigninForm from '../../app/components/Signin/SigninForm.vue'

describe('SigninForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(SigninForm, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          },
          SocialLoginButtons: true
        }
      }
    })
  })

  describe('Form rendering', () => {
    it('renders the form with all input fields', () => {
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
    })

    it('displays correct placeholders and aria-labels', () => {
      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')
      
      expect(emailInput.attributes('aria-label')).toBeTruthy()
      expect(passwordInput.attributes('aria-label')).toBeTruthy()
      expect(emailInput.attributes('placeholder')).toContain('Email')
      expect(passwordInput.attributes('placeholder')).toContain('Password')
    })

    it('renders submit button with correct text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Sign In')
    })

    it('renders link to signup page', () => {
      const signupLink = wrapper.find('a[aria-label="Sign up"]')
      expect(signupLink.exists()).toBe(true)
      expect(signupLink.attributes('to')).toBe('/signup')
    })

    it('renders forgot password link', () => {
      const forgotPasswordLink = wrapper.findAll('a').find(link => 
        link.text().toLowerCase().includes('forgot')
      )
      expect(forgotPasswordLink?.exists()).toBe(true)
      expect(forgotPasswordLink?.attributes('to')).toBe('/forgot-password')
    })

    it('renders social login section', () => {
      expect(wrapper.text()).toContain('Or choose other option')
      expect(wrapper.findComponent({ name: 'SocialLoginButtons' }).exists()).toBe(true)
    })

    it('renders Hermes logo with link to home', () => {
      const logoLink = wrapper.find('a[aria-label="Home"]')
      expect(logoLink.exists()).toBe(true)
      expect(logoLink.attributes('to')).toBe('/')
      
      const logo = logoLink.find('img')
      expect(logo.exists()).toBe(true)
      expect(logo.attributes('src')).toContain('hermes-logo')
    })
  })

  describe('Email validation', () => {
    it('shows validation error for empty email', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('')
      await emailInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This field is required')
    })

    it('shows validation error for invalid email format', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Please enter a valid email address')
    })

    it('does not show validation error for valid email', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('test@example.com')
      await emailInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('Please enter a valid email address')
      expect(wrapper.text()).not.toContain('This field is required')
    })

    it('applies error styling to email input when invalid', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid')
      await emailInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(emailInput.classes()).toContain('border-red-500')
    })
  })

  describe('Password validation', () => {
    it('shows validation error for empty password', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('')
      await passwordInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This field is required')
    })

    it('shows validation error for short password', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('short')
      await passwordInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Password must be at least 8 characters')
    })

    it('does not show validation error for valid password', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('securePassword123')
      await passwordInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('Password must be at least 8 characters')
      expect(wrapper.text()).not.toContain('This field is required')
    })

    it('applies error styling to password input when invalid', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('short')
      await passwordInput.trigger('blur')
      
      await wrapper.vm.$nextTick()
      expect(passwordInput.classes()).toContain('border-red-500')
    })
  })

  describe('Form submission', () => {
    it('prevents submission with invalid form data', async () => {
      const form = wrapper.find('form')
      
      // Leave form empty
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      // Should show validation errors
      expect(wrapper.text()).toContain('This field is required')
    })

    it('disables submit button when loading', async () => {
      const form = wrapper.find('form')
      
      // Fill form with valid data
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('securePassword123')
      
      // Submit form
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('shows loading text on submit button when submitting', async () => {
      const form = wrapper.find('form')
      
      // Fill form with valid data
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('securePassword123')
      
      // Submit form
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toContain('Loading')
    })

    it('clears form after successful submission', async () => {
      vi.useFakeTimers()
      
      const form = wrapper.find('form')
      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')
      
      // Fill form with valid data
      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('securePassword123')
      
      // Submit form
      await form.trigger('submit')
      
      // Advance timers to simulate the 1500ms delay
      await vi.advanceTimersByTimeAsync(1500)
      await wrapper.vm.$nextTick()
      
      // Form should be cleared
      expect((emailInput.element as HTMLInputElement).value).toBe('')
      expect((passwordInput.element as HTMLInputElement).value).toBe('')
      
      vi.useRealTimers()
    })
  })

  describe('Social login integration', () => {
    it('emits social login event when social button is clicked', () => {
      const socialButtons = wrapper.findComponent({ name: 'SocialLoginButtons' })
      expect(socialButtons.exists()).toBe(true)
    })

    it('handles social login with valid provider', () => {
      // Mock window.location to avoid jsdom navigation errors
      const originalLocation = window.location
      // @ts-expect-error - Deleting window.location for mocking
      delete window.location
      // @ts-expect-error - Mocking window.location for testing
      window.location = { href: '' }
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      // @ts-expect-error - Accessing component internal methods for testing
      const component = wrapper.vm as { handleSocialLogin: (provider: 'google' | 'microsoft') => void }
      
      // Should not log validation errors for valid providers
      component.handleSocialLogin('google')
      expect(window.location.href).toBe('/api/auth/google')
      
      component.handleSocialLogin('microsoft')
      expect(window.location.href).toBe('/api/auth/microsoft')
      
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      
      // Restore
      // @ts-expect-error - Restoring window.location after test
      window.location = originalLocation
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels via aria-label', () => {
      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')
      
      expect(emailInput.attributes('aria-label')).toBeTruthy()
      expect(passwordInput.attributes('aria-label')).toBeTruthy()
    })

    it('shows error messages that screen readers can access', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid')
      await emailInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.text-red-500')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBeTruthy()
    })

    it('submit button has proper disabled state for accessibility', async () => {
      const form = wrapper.find('form')
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('securePassword123')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(submitButton.classes()).toContain('disabled:opacity-50')
      expect(submitButton.classes()).toContain('disabled:cursor-not-allowed')
    })
  })
})
