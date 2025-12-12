import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '../../app/components/AppNavbar.vue'
import { useI18n as realUseI18n } from '../../app/composables/useI18n'

describe('Landing i18n', () => {
  it('renders Spanish nav text when locale is es', async () => {
    // Ensure AppNavbar uses the actual composable instead of the test stub
    // @ts-expect-error: replace test stub with real composable
    global.useI18n = realUseI18n
    // @ts-expect-error: set navigator language for test environment
    global.navigator = { ...(global.navigator || {}), language: 'es-ES' }

    const wrapper = mount(AppNavbar, {
      global: {
        stubs: {
          ContactModal: true,
        }
      }
    })

    expect(wrapper.text()).toContain('Quiénes Somos')
  })

  it('renders English nav text when locale is en', async () => {
    // Ensure AppNavbar uses the actual composable instead of the test stub
    // @ts-expect-error: replace test stub with real composable
    global.useI18n = realUseI18n
    // @ts-expect-error: set navigator language for test environment
    global.navigator = { ...(global.navigator || {}), language: 'en-US' }

    const wrapper = mount(AppNavbar, {
      global: {
        stubs: {
          ContactModal: true,
        }
      }
    })

    expect(wrapper.text()).toContain('Who We Are')
  })
})
