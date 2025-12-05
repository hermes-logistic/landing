import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FeaturesSection from '../../app/components/FeaturesSection.vue'

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => {
    if (key === 'features.slides') {
      return [
        { title: 'Slide 1', description: 'Desc 1' },
        { title: 'Slide 2', description: 'Desc 2' }
      ]
    }
    return key
  }
}))

describe('FeaturesSection', () => {
  it('mounts and has section id', () => {
    const wrapper = mount(FeaturesSection)
    expect(wrapper.attributes('id')).toBe('features')
  })
})
