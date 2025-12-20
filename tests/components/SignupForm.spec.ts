import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import SignupForm from '../../app/components/Signup/SignupForm.vue'

describe('SignupForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(SignupForm, {
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

  it('renders the form with all input fields', () => {
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('displays correct labels and placeholders', () => {
    const emailInput = wrapper.find('#email')
    const passwordInput = wrapper.find('#password')
    // Labels are not visually rendered by design; check aria-labels instead
    expect(emailInput.attributes('aria-label')).toBeTruthy()
    expect(passwordInput.attributes('aria-label')).toBeTruthy()
    expect(emailInput.attributes('placeholder')).toBeTruthy()
    expect(passwordInput.attributes('placeholder')).toBeTruthy()
  })

  // Name field removed from signup form.

  it('shows validation error for invalid email', async () => {
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Please enter a valid email address')
  })

  it('shows validation error for short password', async () => {
    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('short')
    await passwordInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Password must be at least 8 characters')
  })

  it('does not show validation error for valid email', async () => {
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('Please enter a valid email address')
  })

  it('does not show validation error for valid password', async () => {
    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('securePassword123')
    await passwordInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters')
  })

  it('renders submit button with correct text', () => {
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('Sign Up')
  })

  it('disables submit button when loading', async () => {
    const form = wrapper.find('form')
    
    // Fill form with valid data
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#password').setValue('securePassword123')
    
    // Submit form
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('renders social login section', () => {
    expect(wrapper.text()).toContain('Or choose other option')
  })

  it('renders forgot password link', () => {
    expect(wrapper.text()).toContain('Forgot your password?')
  })

  it('has correct form structure', () => {
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    
    const inputs = form.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  it('validates form before submission', async () => {
    const form = wrapper.find('form')
    
    // Try to submit empty form
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    
    // Should show validation errors
    expect(wrapper.text()).toContain('This field is required')
  })

  it('clears form after successful submission', async () => {
    vi.useFakeTimers()
    
    const form = wrapper.find('form')
    
    // Fill form
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#password').setValue('securePassword123')
    
    // Submit
    await form.trigger('submit')
    
    // Advance timers to simulate the 1500ms delay
    await vi.advanceTimersByTimeAsync(1500)
    await wrapper.vm.$nextTick()
    
    // Check if form is cleared (name field was removed)
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#password').element as HTMLInputElement).value).toBe('')
    
    vi.useRealTimers()
  })
})
