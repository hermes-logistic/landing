import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OurPurposeSection from '../../app/components/OurPurposeSection.vue'

describe('OurPurposeSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(OurPurposeSection)
    expect(wrapper.attributes('id')).toBe('our-purpose')
  })
})
