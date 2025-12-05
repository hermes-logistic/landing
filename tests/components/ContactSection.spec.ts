import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactSection from '../../app/components/ContactSection.vue'

describe('ContactSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.attributes('id')).toBe('contact')
  })
})
