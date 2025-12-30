import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import KycProfileForm from '../../app/components/Kyc/KycProfileForm.vue'
import type { KycProfileData } from '../../app/utils/kyc-validation'

// Mock country-state-city library with simplified data for faster tests
vi.mock('country-state-city', () => ({
  Country: {
    getAllCountries: () => [
      { isoCode: 'US', name: 'United States', phonecode: '+1' },
      { isoCode: 'SV', name: 'El Salvador', phonecode: '+503' },
      { isoCode: 'MX', name: 'Mexico', phonecode: '+52' }
    ],
    getCountryByCode: (code: string) => {
      const countries = [
        { isoCode: 'US', name: 'United States', phonecode: '+1' },
        { isoCode: 'SV', name: 'El Salvador', phonecode: '+503' },
        { isoCode: 'MX', name: 'Mexico', phonecode: '+52' }
      ]
      return countries.find(c => c.isoCode === code)
    }
  },
  City: {
    getCitiesOfCountry: (code: string) => {
      const cities: Record<string, Array<{ name: string }>> = {
        US: [{ name: 'New York' }, { name: 'Los Angeles' }, { name: 'Chicago' }],
        SV: [{ name: 'San Salvador' }, { name: 'Santa Ana' }, { name: 'San Miguel' }],
        MX: [{ name: 'Mexico City' }, { name: 'Guadalajara' }, { name: 'Monterrey' }]
      }
      return cities[code] || []
    }
  }
}))

// Mock validation
vi.mock('../../app/utils/kyc-validation', () => ({
  validateKycProfile: vi.fn((data, t) => {
    const errors: Record<string, string> = {}
    let isValid = true

    if (!data.country) {
      errors.country = t('kyc.profile.validation.countryRequired')
      isValid = false
    }
    if (!data.city) {
      errors.city = t('kyc.profile.validation.cityRequired')
      isValid = false
    }
    if (!data.firstName) {
      errors.firstName = t('kyc.profile.validation.firstNameRequired')
      isValid = false
    }
    if (!data.lastName) {
      errors.lastName = t('kyc.profile.validation.lastNameRequired')
      isValid = false
    }
    if (!data.phone) {
      errors.phone = t('kyc.profile.validation.phoneRequired')
      isValid = false
    }
    if (!data.address1) {
      errors.address1 = t('kyc.profile.validation.address1Required')
      isValid = false
    }
    if (!data.acceptTerms) {
      errors.acceptTerms = t('kyc.profile.validation.termsRequired')
      isValid = false
    }

    return { isValid, errors }
  })
}))

describe('KycProfileForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(KycProfileForm, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })
  })

  describe('Form rendering', () => {
    it('renders the form with all input fields', () => {
      expect(wrapper.find('#country').exists()).toBe(true)
      expect(wrapper.find('#city').exists()).toBe(true)
      expect(wrapper.find('#firstName').exists()).toBe(true)
      expect(wrapper.find('#lastName').exists()).toBe(true)
      expect(wrapper.find('#phone').exists()).toBe(true)
      expect(wrapper.find('#phoneCode').exists()).toBe(true)
      expect(wrapper.find('#address1').exists()).toBe(true)
      expect(wrapper.find('#address2').exists()).toBe(true)
      expect(wrapper.find('#terms').exists()).toBe(true)
    })

    it('renders form header with title and subtitle', () => {
      expect(wrapper.find('h2').exists()).toBe(true)
      expect(wrapper.text()).toContain('kyc.profile.title')
      expect(wrapper.text()).toContain('kyc.profile.subtitle')
    })

    it('renders submit button with correct text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('kyc.profile.submit')
    })

    it('renders country select with options', () => {
      const countrySelect = wrapper.find('#country')
      const options = countrySelect.findAll('option')
      // Should have placeholder + 3 countries from mock
      expect(options.length).toBeGreaterThanOrEqual(3)
    })

    it('disables city select when no country is selected', () => {
      const citySelect = wrapper.find('#city')
      expect(citySelect.attributes('disabled')).toBeDefined()
    })
  })

  describe('Form validation', () => {
    it('shows validation errors when submitting empty form', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      expect(wrapper.text()).toContain('kyc.profile.validation.countryRequired')
      expect(wrapper.text()).toContain('kyc.profile.validation.firstNameRequired')
      expect(wrapper.text()).toContain('kyc.profile.validation.lastNameRequired')
      expect(wrapper.text()).toContain('kyc.profile.validation.phoneRequired')
      expect(wrapper.text()).toContain('kyc.profile.validation.address1Required')
      expect(wrapper.text()).toContain('kyc.profile.validation.termsRequired')
    })

    it('applies error styling to invalid fields', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      const countrySelect = wrapper.find('#country')
      expect(countrySelect.classes()).toContain('border-red-500')
    })
  })

  describe('Country and City interaction', () => {
    it('enables city select after country selection', async () => {
      const countrySelect = wrapper.find('#country')
      await countrySelect.setValue('US')
      await flushPromises()

      const citySelect = wrapper.find('#city')
      expect(citySelect.attributes('disabled')).toBeUndefined()
    })

    it('populates cities based on selected country', async () => {
      const countrySelect = wrapper.find('#country')
      await countrySelect.setValue('US')
      await flushPromises()

      const citySelect = wrapper.find('#city')
      const options = citySelect.findAll('option').filter(o => o.attributes('value') !== '')
      
      // Mock has 3 US cities
      expect(options.length).toBe(3)
      expect(options.some(o => o.text() === 'New York')).toBe(true)
    })

    it('resets city when country changes', async () => {
      const countrySelect = wrapper.find('#country')
      const citySelect = wrapper.find('#city')

      // Select US and a city
      await countrySelect.setValue('US')
      await flushPromises()
      
      // Get first available city and select it
      const firstCity = citySelect.findAll('option').filter(o => o.attributes('value') !== '')[0]
      if (firstCity) {
        await citySelect.setValue(firstCity.attributes('value') || '')
      }
      
      // Change country
      await countrySelect.setValue('SV')
      await flushPromises()

      expect((citySelect.element as HTMLSelectElement).value).toBe('')
    })

    it('updates phone code when country changes', async () => {
      const countrySelect = wrapper.find('#country')
      await countrySelect.setValue('SV')
      await flushPromises()

      const phoneCodeSelect = wrapper.find('#phoneCode')
      expect((phoneCodeSelect.element as HTMLSelectElement).value).toBe('+503')
    })
  })

  describe('Form submission', () => {
    it('emits submit event with form data when valid', async () => {
      // Fill all required fields
      await wrapper.find('#country').setValue('US')
      await flushPromises()
      
      const citySelect = wrapper.find('#city')
      const firstCity = citySelect.findAll('option').filter(o => o.attributes('value') !== '')[0]
      await citySelect.setValue(firstCity?.attributes('value') || 'New York')
      
      await wrapper.find('#firstName').setValue('John')
      await wrapper.find('#lastName').setValue('Doe')
      await wrapper.find('#phone').setValue('1234567890')
      await wrapper.find('#address1').setValue('123 Main St')
      await wrapper.find('#terms').setValue(true)

      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      expect(wrapper.emitted('submit')).toBeTruthy()
      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as KycProfileData
      expect(emittedData).toMatchObject({
        country: 'US',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        address1: '123 Main St',
        acceptTerms: true
      })
      // City should be one of the available cities (sorted alphabetically)
      expect(['Chicago', 'Los Angeles', 'New York']).toContain(emittedData.city)
    })

    it('does not emit submit when form is invalid', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      expect(wrapper.emitted('submit')).toBeFalsy()
    })
  })

  describe('Phone number field', () => {
    it('renders phone code selector', () => {
      const phoneCodeSelect = wrapper.find('#phoneCode')
      expect(phoneCodeSelect.exists()).toBe(true)
    })

    it('allows manual phone code selection', async () => {
      const phoneCodeSelect = wrapper.find('#phoneCode')
      await phoneCodeSelect.setValue('+52')
      
      expect((phoneCodeSelect.element as HTMLSelectElement).value).toBe('+52')
    })
  })

  describe('Terms checkbox', () => {
    it('renders terms and conditions checkbox', () => {
      const termsCheckbox = wrapper.find('#terms')
      expect(termsCheckbox.exists()).toBe(true)
      expect(termsCheckbox.attributes('type')).toBe('checkbox')
    })

    it('renders terms text', () => {
      expect(wrapper.text()).toContain('kyc.profile.terms.text')
    })
  })

  describe('Optional fields', () => {
    it('does not require address2 field', async () => {
      // Fill all required fields except address2
      await wrapper.find('#country').setValue('US')
      await flushPromises()
      
      const citySelect = wrapper.find('#city')
      const firstCity = citySelect.findAll('option').filter(o => o.attributes('value') !== '')[0]
      await citySelect.setValue(firstCity?.attributes('value') || 'New York')
      
      await wrapper.find('#firstName').setValue('John')
      await wrapper.find('#lastName').setValue('Doe')
      await wrapper.find('#phone').setValue('1234567890')
      await wrapper.find('#address1').setValue('123 Main St')
      await wrapper.find('#terms').setValue(true)

      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      // Should still emit successfully
      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('includes address2 in submission when provided', async () => {
      await wrapper.find('#country').setValue('US')
      await flushPromises()
      
      const citySelect = wrapper.find('#city')
      const firstCity = citySelect.findAll('option').filter(o => o.attributes('value') !== '')[0]
      await citySelect.setValue(firstCity?.attributes('value') || 'New York')
      
      await wrapper.find('#firstName').setValue('John')
      await wrapper.find('#lastName').setValue('Doe')
      await wrapper.find('#phone').setValue('1234567890')
      await wrapper.find('#address1').setValue('123 Main St')
      await wrapper.find('#address2').setValue('Apt 4B')
      await wrapper.find('#terms').setValue(true)

      const form = wrapper.find('form')
      await form.trigger('submit')
      await flushPromises()

      const emittedData = wrapper.emitted('submit')?.[0]?.[0] as KycProfileData | undefined
      expect(emittedData?.address2).toBe('Apt 4B')
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(8)
    })

    it('associates labels with inputs via for attribute', () => {
      const countryLabel = wrapper.find('label[for="country"]')
      expect(countryLabel.exists()).toBe(true)

      const firstNameLabel = wrapper.find('label[for="firstName"]')
      expect(firstNameLabel.exists()).toBe(true)
    })

    it('indicates required fields with asterisk', () => {
      const requiredMarkers = wrapper.findAll('.text-red-500')
      // Should have asterisks for: country, city, firstName, lastName, phone, address1
      expect(requiredMarkers.length).toBeGreaterThanOrEqual(6)
    })
  })
})
