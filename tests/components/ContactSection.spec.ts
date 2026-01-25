import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactSection from '../../app/components/ContactSection.vue'
import { globalStubs } from '../../vitest.setup'

describe('ContactSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(ContactSection, {
      global: {
        stubs: globalStubs,
      },
    })
    expect(wrapper.attributes('id')).toBe('contact')
  })
})
