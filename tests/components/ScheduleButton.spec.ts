import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScheduleButton from '../../app/components/ScheduleButton.vue'
import en from '../../locales/en.json'

describe('ScheduleButton', () => {
  it('renders translated schedule CTA', () => {
    const wrapper = mount(ScheduleButton)
    expect(wrapper.text()).toContain('Schedule a Demo')
  })

  // This component imports useI18n directly, so t() resolves against the real
  // locale files. Asserting against en.json proves the label comes from there
  // and fails if anyone hardcodes it back into the template.
  it('takes the button aria-label from the locale files', () => {
    const wrapper = mount(ScheduleButton)
    expect(wrapper.get('button').attributes('aria-label')).toBe(en.hero.aria.schedule)
  })
})
