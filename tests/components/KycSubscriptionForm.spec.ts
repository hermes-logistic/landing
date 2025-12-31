import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import KycSubscriptionForm from '../../app/components/Kyc/KycSubscriptionForm.vue'
import KycSubscriptionCard from '../../app/components/Kyc/KycSubscriptionCard.vue'

// Mock pricing plans data
const mockPlans = [
  {
    name: 'Basic',
    units: 'U: 1-5',
    price: '$40.00',
    description: 'The Basic Plan is ideal for small businesses.',
    paymentSpecs: 'Payment specs here.',
    button: 'Get Plan',
    features: ['Route optimization', 'Real-time monitoring']
  },
  {
    name: 'Standard',
    units: 'U: 6-24',
    price: '$35.00',
    description: 'The Standard Plan is perfect for mid-sized businesses.',
    paymentSpecs: 'Payment specs here.',
    button: 'Get Plan',
    features: ['Everything in Basic', 'Advanced analytics']
  },
  {
    name: 'Premium',
    units: 'U: 25-60',
    price: '$30.00',
    description: 'The Premium Plan is designed for growing companies.',
    paymentSpecs: 'Payment specs here.',
    button: 'Get Plan',
    features: ['Everything in Standard', 'Predictive analytics']
  },
  {
    name: 'Enterprise',
    units: 'U: +60',
    price: 'Custom',
    description: 'The Enterprise Plan is the definitive choice.',
    paymentSpecs: 'Payment specs here.',
    button: 'Get Plan',
    features: ['Everything in Premium', 'Custom development']
  }
]

describe('KycSubscriptionForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Override the useI18n mock to return actual plan data
    // @ts-expect-error - Overriding global stub for this test
    globalThis.useI18n = () => ({
      t: (key: string, opts?: { returnObjects?: boolean }) => {
        if (key === 'pricing.plans' && opts?.returnObjects) {
          return mockPlans
        }
        const translations: Record<string, string> = {
          'kyc.subscription.title': 'Choose your Plan',
          'kyc.subscription.subtitle': 'Select the subscription plan that best fits your fleet management needs.',
          'kyc.subscription.selectPlan': 'Select a subscription plan',
          'kyc.subscription.featuresTitle': 'Features included',
          'kyc.subscription.back': 'Back',
          'kyc.subscription.nextStep': 'Next Step',
          'kyc.subscription.validation.planRequired': 'Please select a subscription plan to continue'
        }
        return translations[key] || key
      },
      locale: { value: 'en' },
      setLocale: () => {}
    })

    wrapper = mount(KycSubscriptionForm, {
      global: {
        components: {
          KycSubscriptionCard
        }
      }
    })
  })

  describe('Rendering', () => {
    it('renders the form container', () => {
      expect(wrapper.find('.w-full.max-w-5xl').exists()).toBe(true)
    })

    it('displays the title', () => {
      expect(wrapper.text()).toContain('Choose your Plan')
    })

    it('displays the subtitle', () => {
      expect(wrapper.text()).toContain('Select the subscription plan that best fits your fleet management needs.')
    })

    it('renders 4 plan cards', () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      expect(cards.length).toBe(4)
    })

    it('renders the plans grid with radiogroup role', () => {
      const grid = wrapper.find('[role="radiogroup"]')
      expect(grid.exists()).toBe(true)
    })

    it('renders back button', () => {
      expect(wrapper.text()).toContain('Back')
    })

    it('renders next step button', () => {
      expect(wrapper.text()).toContain('Next Step')
    })
  })

  describe('Plan selection', () => {
    it('starts with no plan selected', () => {
      const vm = wrapper.vm as unknown as { selectedPlanIndex: number | null }
      expect(vm.selectedPlanIndex).toBe(null)
    })

    it('selects a plan when clicking on a card', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      const firstCard = cards.at(0)
      await firstCard?.trigger('click')
      
      const vm = wrapper.vm as unknown as { selectedPlanIndex: number | null }
      expect(vm.selectedPlanIndex).toBe(0)
    })

    it('only allows one plan to be selected at a time', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      
      const firstCard = cards.at(0)
      const thirdCard = cards.at(2)
      await firstCard?.trigger('click')
      await thirdCard?.trigger('click')
      
      const vm = wrapper.vm as unknown as { selectedPlanIndex: number | null }
      expect(vm.selectedPlanIndex).toBe(2)
    })

    it('clears error when selecting a plan', async () => {
      // Try to submit without selection to show error
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      const vm = wrapper.vm as unknown as { showError: boolean }
      expect(vm.showError).toBe(true)
      
      // Select a plan
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      const secondCard = cards.at(1)
      await secondCard?.trigger('click')
      
      expect(vm.showError).toBe(false)
    })
  })

  describe('Features Section', () => {
    it('does not show features section initially', () => {
      expect(wrapper.text()).not.toContain('Features included')
    })

    it('shows features section when a plan is selected', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      const firstCard = cards.at(0)
      await firstCard?.trigger('click')
      
      expect(wrapper.text()).toContain('Features included')
    })

    it('shows correct features for selected plan', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      const firstCard = cards.at(0)
      await firstCard?.trigger('click')
      
      // Basic plan features
      expect(wrapper.text()).toContain('Route optimization')
      expect(wrapper.text()).toContain('Real-time monitoring')
      
      // Should not show features from other plans (unless they overlap)
      // Standard has 'Advanced analytics' which Basic doesn't
      expect(wrapper.text()).not.toContain('Advanced analytics')
    })

    it('updates features when changing plan selection', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      
      // Select Standard plan
      const secondCard = cards.at(1)
      await secondCard?.trigger('click')
      
      expect(wrapper.text()).toContain('Advanced analytics')
      
      // Select Premium plan
      const thirdCard = cards.at(2)
      await thirdCard?.trigger('click')
      
      expect(wrapper.text()).toContain('Predictive analytics')
    })
  })

  describe('Validation', () => {
    it('shows error message when submitting without selection', async () => {
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      expect(wrapper.text()).toContain('Please select a subscription plan to continue')
    })

    it('does not show error initially', () => {
      expect(wrapper.text()).not.toContain('Please select a subscription plan to continue')
    })

    it('does not emit submit when no plan selected', async () => {
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      expect(wrapper.emitted('submit')).toBeFalsy()
    })
  })

  describe('Form submission', () => {
    it('emits submit event with selected plan data', async () => {
      vi.useFakeTimers()
      
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      const secondCard = cards.at(1)
      await secondCard?.trigger('click') // Select Standard plan
      
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      expect(wrapper.emitted('submit')).toBeTruthy()
      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as { planIndex: number; plan: { name: string } }
      expect(emittedData.planIndex).toBe(1)
      expect(emittedData.plan.name).toBe('Standard')
      
      vi.useRealTimers()
    })

    it('emits correct plan for each selection', async () => {
      vi.useFakeTimers()
      
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      
      // Select Premium plan (index 2)
      const thirdCard = cards.at(2)
      await thirdCard?.trigger('click')
      
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as { planIndex: number; plan: { name: string } }
      expect(emittedData.planIndex).toBe(2)
      expect(emittedData.plan.name).toBe('Premium')
      
      vi.useRealTimers()
    })
  })

  describe('Back navigation', () => {
    it('emits back event when clicking back button', async () => {
      const backButton = wrapper.findAll('button').find(b => b.text().includes('Back'))
      await backButton?.trigger('click')
      
      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has radiogroup aria-label', () => {
      const grid = wrapper.find('[role="radiogroup"]')
      expect(grid.attributes('aria-label')).toBe('Select a subscription plan')
    })

    it('shows error with role="alert"', async () => {
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('Next Step'))
      await nextButton?.trigger('click')
      
      const errorMessage = wrapper.find('[role="alert"]')
      expect(errorMessage.exists()).toBe(true)
    })
  })

  describe('Plan card props', () => {
    it('passes correct isSelected prop to cards', async () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      
      // Initially all should be not selected
      cards.forEach(card => {
        expect(card.props('isSelected')).toBe(false)
      })
      
      // Select first plan
      const firstCard = cards.at(0)
      await firstCard?.trigger('click')
      
      // Now first should be selected
      expect(firstCard?.props('isSelected')).toBe(true)
      const secondCard = cards.at(1)
      expect(secondCard?.props('isSelected')).toBe(false)
    })

    it('passes correct planIndex to each card', () => {
      const cards = wrapper.findAllComponents({ name: 'KycSubscriptionCard' })
      
      cards.forEach((card, index) => {
        expect(card.props('planIndex')).toBe(index)
      })
    })
  })
})
