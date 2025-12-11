import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScheduleButton from '../../app/components/ScheduleButton.vue'

describe('ScheduleButton', () => {
  it('renders translated schedule CTA', () => {
    const wrapper = mount(ScheduleButton)
    expect(wrapper.text()).toContain('Schedule a Demo')
  })
})
