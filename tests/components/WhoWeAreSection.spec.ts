import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhoWeAreSection from '../../app/components/WhoWeAreSection.vue'

describe('WhoWeAreSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(WhoWeAreSection)
    expect(wrapper.attributes('id')).toBe('who-we-are')
  })
})
