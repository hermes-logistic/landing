import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import KycSubscriptionCard from '../../app/components/Kyc/KycSubscriptionCard.vue'

const mockPlan = {
  name: 'Basic',
  units: 'U: 1-5',
  price: '$40.00',
  description: 'The Basic Plan is ideal for small businesses or entrepreneurs seeking an efficient and economical fleet management solution.',
  paymentSpecs: 'Payment specs here.',
  button: 'Get Plan',
  features: [
    'Route optimization',
    'Real-time monitoring',
    'Mobile application',
    'Geofencing',
    'Basic reports',
    'Email support'
  ]
}

describe('KycSubscriptionCard', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(KycSubscriptionCard, {
      props: {
        plan: mockPlan,
        isSelected: false,
        planIndex: 0
      }
    })
  })

  describe('Rendering', () => {
    it('renders the plan card', () => {
      expect(wrapper.find('[role="radio"]').exists()).toBe(true)
    })

    it('displays plan name', () => {
      expect(wrapper.text()).toContain('Basic')
    })

    it('displays plan description', () => {
      expect(wrapper.text()).toContain('The Basic Plan is ideal for small businesses')
    })

    it('displays plan price', () => {
      expect(wrapper.text()).toContain('$40.00')
    })

    it('displays license range badge', () => {
      expect(wrapper.text()).toContain('U: 1-5')
    })

    it('displays payment specs', () => {
      expect(wrapper.text()).toContain('Payment specs here.')
    })

    it('renders the company logo SVG', () => {
      // Accept either inline SVG or an image file from Figma
      const hasSvg = wrapper.find('svg').exists()
      const hasImg = wrapper.find('img').exists()
      expect(hasSvg || hasImg).toBe(true)
    })

    it('renders the radio button indicator', () => {
      const radioIndicator = wrapper.find('.w-5.h-5.rounded-full')
      expect(radioIndicator.exists()).toBe(true)
    })
  })

  describe('Selection state', () => {
    it('has correct border when not selected', () => {
      const card = wrapper.find('[role="radio"]')
      expect(card.classes()).toContain('border-[#94A4C2]/50')
    })

    it('has correct border when selected', async () => {
      await wrapper.setProps({ isSelected: true })
      const card = wrapper.find('[role="radio"]')
      expect(card.classes()).toContain('border-[#61F0FF]')
    })

    it('shows filled radio button when selected', async () => {
      await wrapper.setProps({ isSelected: true })
      const innerCircle = wrapper.find('.w-2.h-2.rounded-full')
      expect(innerCircle.exists()).toBe(true)
    })

    it('does not show inner circle when not selected', () => {
      const innerCircle = wrapper.find('.w-2.h-2.rounded-full')
      expect(innerCircle.exists()).toBe(false)
    })
  })

  describe('Click handling', () => {
    it('emits select event on click', async () => {
      await wrapper.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')?.length).toBe(1)
    })

    it('emits select event on Enter key', async () => {
      await wrapper.trigger('keydown.enter')
      expect(wrapper.emitted('select')).toBeTruthy()
    })

    it('emits select event on Space key', async () => {
      await wrapper.trigger('keydown.space')
      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })

  describe('Plan name colors', () => {
    it('applies correct color for Basic plan (index 0)', () => {
      const heading = wrapper.find('h3')
      expect(heading.classes()).toContain('text-[#EBF2FF]')
    })

    it('applies correct color for Standard plan (index 1)', async () => {
      await wrapper.setProps({ planIndex: 1 })
      const heading = wrapper.find('h3')
      expect(heading.classes()).toContain('text-[#6C8AD0]')
    })

    it('applies correct color for Premium plan (index 2)', async () => {
      await wrapper.setProps({ planIndex: 2 })
      const heading = wrapper.find('h3')
      expect(heading.classes()).toContain('text-[#FFC152]')
    })

    it('applies correct color for Enterprise plan (index 3)', async () => {
      await wrapper.setProps({ planIndex: 3 })
      const heading = wrapper.find('h3')
      expect(heading.classes()).toContain('text-[#FF734D]')
    })
  })

  describe('Accessibility', () => {
    it('has role="radio"', () => {
      expect(wrapper.find('[role="radio"]').exists()).toBe(true)
    })

    it('has aria-checked=false when not selected', () => {
      expect(wrapper.find('[role="radio"]').attributes('aria-checked')).toBe('false')
    })

    it('has aria-checked=true when selected', async () => {
      await wrapper.setProps({ isSelected: true })
      expect(wrapper.find('[role="radio"]').attributes('aria-checked')).toBe('true')
    })

    it('has aria-labelledby pointing to plan name', () => {
      const radio = wrapper.find('[role="radio"]')
      const labelledBy = radio.attributes('aria-labelledby')
      expect(labelledBy).toContain('plan-name-Basic')
    })

    it('has tabindex for keyboard navigation', () => {
      const card = wrapper.find('[role="radio"]')
      expect(card.attributes('tabindex')).toBe('0')
    })
  })
})
