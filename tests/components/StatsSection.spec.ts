import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsSection from '../../app/components/StatsSection.vue'
import en from '../../locales/en.json'

describe('StatsSection', () => {
  it('renders all stat percentage values', () => {
    const wrapper = mount(StatsSection)
    const text = wrapper.text()
    expect(text).toContain('10%')
    expect(text).toContain('20%')
    expect(text).toContain('40%')
  })

  // This component imports useI18n directly, so t() resolves against the real
  // locale files. Asserting against en.json proves every accessible name comes
  // from there and fails if anyone hardcodes one back into the template.
  it('takes every accessible name from the locale files', () => {
    const wrapper = mount(StatsSection)

    expect(wrapper.get('[role="region"]').attributes('aria-label')).toBe(en.stats.aria.section)

    const alts = wrapper.findAll('img').map(img => img.attributes('alt'))
    expect(alts).toEqual([en.stats.aria.fuel, en.stats.aria.hours, en.stats.aria.cost])
  })
})
