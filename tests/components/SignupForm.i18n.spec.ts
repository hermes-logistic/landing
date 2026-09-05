import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignupForm from '../../app/components/Signup/SignupForm.vue'
import { useI18n } from '../../app/composables/useI18n'

/**
 * The signup form renders in the active locale.
 *
 * The locale is set through setLocale() rather than `navigator.language`:
 * useI18n() no longer negotiates the language from the browser or from
 * Accept-Language. On the web app routes the browser preference is adopted once
 * after hydration, by app/app.vue, which calls this same setLocale().
 */
describe('SignupForm i18n', () => {
  const stubs = {
    NuxtLink: { template: '<a><slot/></a>' },
    SocialLoginButtons: true,
  }

  it('renders Spanish translations when the locale is es', () => {
    useI18n().setLocale('es')
    const wrapper = mount(SignupForm, { global: { stubs } })
    expect(wrapper.text()).toContain('¡Bienvenido!')
    expect(wrapper.text()).toContain('Crea tu cuenta en Hermes')
  })

  it('renders English translations when the locale is en', () => {
    useI18n().setLocale('en')
    const wrapper = mount(SignupForm, { global: { stubs } })
    expect(wrapper.text()).toContain('Welcome!')
    expect(wrapper.text()).toContain('Create your Hermes account')
  })
})
