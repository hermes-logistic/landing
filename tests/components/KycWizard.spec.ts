import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import KycWizard from '../../app/components/Kyc/KycWizard.vue'

describe('KycWizard', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(KycWizard, {
      props: {
        currentStep: 1,
        completedSteps: [],
        isCompleted: false
      }
    })
  })

  describe('Rendering', () => {
    it('renders the wizard navigation', () => {
      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('[aria-label="KYC Progress"]').exists()).toBe(true)
    })

    it('renders all 5 steps on desktop view', () => {
      const desktopWizard = wrapper.find('.hidden.md\\:flex')
      expect(desktopWizard.exists()).toBe(true)
      
      const steps = desktopWizard.findAll('button')
      expect(steps.length).toBe(5)
    })

    it('renders mobile view with current step only', () => {
      const mobileWizard = wrapper.find('.flex.md\\:hidden')
      expect(mobileWizard.exists()).toBe(true)
      expect(mobileWizard.text()).toContain('1')
    })

    it('displays step labels correctly', () => {
      const text = wrapper.text()
      expect(text).toContain('kyc.wizard.steps.profile')
      expect(text).toContain('kyc.wizard.steps.subscription')
      expect(text).toContain('kyc.wizard.steps.drivers')
      expect(text).toContain('kyc.wizard.steps.payment')
      expect(text).toContain('kyc.wizard.steps.done')
    })
  })

  describe('Step states', () => {
    it('highlights current step with active styling', () => {
      const firstStep = wrapper.findAll('.hidden.md\\:flex button').at(0)
      expect(firstStep?.classes()).toContain('opacity-100')
    })

    it('shows completed steps with checkmark', async () => {
      await wrapper.setProps({
        currentStep: 2,
        completedSteps: [1]
      })

      const firstStep = wrapper.findAll('.hidden.md\\:flex button').at(0)
      const svg = firstStep?.find('svg')
      expect(svg?.exists()).toBe(true)
    })

    it('shows step numbers for incomplete steps', () => {
      const futureStep = wrapper.findAll('.hidden.md\\:flex button').at(2)
      expect(futureStep?.text()).toContain('3')
    })
  })

  describe('Navigation', () => {
    it('emits navigate event when clicking completed step', async () => {
      await wrapper.setProps({
        currentStep: 3,
        completedSteps: [1, 2]
      })

      const secondStep = wrapper.findAll('.hidden.md\\:flex button').at(1)
      await secondStep?.trigger('click')

      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')?.[0]).toEqual([2])
    })

    it('does not emit navigate for future steps', async () => {
      const thirdStep = wrapper.findAll('.hidden.md\\:flex button').at(2)
      await thirdStep?.trigger('click')

      expect(wrapper.emitted('navigate')).toBeFalsy()
    })

    it('disables navigation to future steps', () => {
      const futureStep = wrapper.findAll('.hidden.md\\:flex button').at(3)
      expect(futureStep?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Connector lines', () => {
    it('renders connector lines between steps', () => {
      const connectors = wrapper.findAll('.hidden.md\\:flex .h-0\\.5')
      expect(connectors.length).toBe(4) // 4 connectors for 5 steps
    })

    it('highlights completed connectors', async () => {
      await wrapper.setProps({
        currentStep: 3,
        completedSteps: [1, 2]
      })

      const connectors = wrapper.findAll('.hidden.md\\:flex .h-0\\.5')
      expect(connectors.at(0)?.classes()).toContain('bg-[#61F0FF]')
      expect(connectors.at(1)?.classes()).toContain('bg-[#61F0FF]')
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-current for current step', () => {
      const currentStep = wrapper.findAll('.hidden.md\\:flex button').at(0)
      expect(currentStep?.attributes('aria-current')).toBe('step')
    })

    it('has aria-label for step status', () => {
      const steps = wrapper.findAll('.hidden.md\\:flex button')
      steps.forEach((step) => {
        expect(step.attributes('aria-label')).toBeTruthy()
      })
    })
  })

  describe('Mobile view', () => {
    it('shows current step label', () => {
      const mobileView = wrapper.find('.flex.md\\:hidden')
      // Should show step number and label (stepOf text was removed per design)
      expect(mobileView.text()).toContain('kyc.wizard.steps.profile')
    })

    it('updates mobile view when step changes', async () => {
      await wrapper.setProps({ currentStep: 3 })
      
      const mobileStepNumber = wrapper.find('.flex.md\\:hidden .text-xl')
      expect(mobileStepNumber.text()).toBe('3')
    })
  })
})
