import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignupForm from '../../app/components/Signup/SignupForm.vue'

describe('SignupForm i18n', () => {
  it('renders Spanish translations when locale is `es`', async () => {
    // Simulate browser language so the composable's useState initializer picks 'es'
    // @ts-expect-error - test env mutation
    global.navigator = { ...(global.navigator || {}), language: 'es-ES' }

    const wrapper = mount(SignupForm, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot/></a>' },
          SocialLoginButtons: true
        }
      }
    })

    // Check heading and description fragments in Spanish
    expect(wrapper.text()).toContain('¡Bienvenido!')
    expect(wrapper.text()).toContain('Crea tu cuenta en Hermes')
  })

  it('renders English translations when locale is `en`', async () => {
    // Simulate browser language so the composable's useState initializer picks 'en'
    // @ts-expect-error - test env mutation
    global.navigator = { ...(global.navigator || {}), language: 'en-US' }

    const wrapper = mount(SignupForm, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot/></a>' },
          SocialLoginButtons: true
        }
      }
    })

    // Check heading and description fragments in English
    expect(wrapper.text()).toContain('Welcome!')
    expect(wrapper.text()).toContain('Create your Hermes account')
  })
})
