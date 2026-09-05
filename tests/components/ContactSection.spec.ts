import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactSection from '../../app/components/ContactSection.vue'

describe('ContactSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.attributes('id')).toBe('contact')
  })

  // The stubbed t() returns the key, so this asserts the mobile illustration's
  // alt text is sourced from the locale files, not hardcoded in English.
  it('takes the illustration alt text from the locale files', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.html()).toContain('contact.aria.illustration')
  })
})
