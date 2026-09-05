import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../../app/components/AppFooter.vue'

describe('AppFooter', () => {
  it('renders company name and links', () => {
    const wrapper = mount(AppFooter)
    // The wordmark stays hardcoded on purpose — a brand name is not translated.
    expect(wrapper.text()).toContain('HERMES')
    // The stubbed t() returns the key, so this asserts the whole bottom row is
    // sourced from the locale files rather than from hardcoded English strings.
    // Half a translated footer is worse than none — assert all three together.
    expect(wrapper.text()).toContain('footer.copyright')
    expect(wrapper.text()).toContain('footer.privacyPolicy')
    expect(wrapper.text()).toContain('footer.terms')
  })
})
