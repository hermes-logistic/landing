import { describe, it, expect } from 'vitest'
import {
  validateKycProfile,
  isValidPhoneNumber,
  type KycProfileData
} from '../../app/utils/kyc-validation'

const mockT = (key: string) => key

const validProfileData: KycProfileData = {
  country: 'US',
  city: 'New York',
  firstName: 'John',
  lastName: 'Doe',
  phoneCode: '+1',
  phone: '1234567890',
  address1: '123 Main Street',
  address2: 'Apt 4B',
  acceptTerms: true
}

describe('validateKycProfile', () => {
  describe('Valid data', () => {
    it('returns valid result for complete profile data', () => {
      const result = validateKycProfile(validProfileData, mockT)
      
      expect(result.isValid).toBe(true)
      expect(result.errors.country).toBe('')
      expect(result.errors.city).toBe('')
      expect(result.errors.firstName).toBe('')
      expect(result.errors.lastName).toBe('')
      expect(result.errors.phone).toBe('')
      expect(result.errors.address1).toBe('')
      expect(result.errors.acceptTerms).toBe('')
    })

    it('accepts profile without address2 (optional)', () => {
      const data = { ...validProfileData, address2: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(true)
    })
  })

  describe('Country validation', () => {
    it('returns error for empty country', () => {
      const data = { ...validProfileData, country: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.country).toBe('kyc.profile.validation.countryRequired')
    })

    it('returns error for whitespace-only country', () => {
      const data = { ...validProfileData, country: '   ' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.country).toBe('kyc.profile.validation.countryRequired')
    })
  })

  describe('City validation', () => {
    it('returns error for empty city', () => {
      const data = { ...validProfileData, city: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.city).toBe('kyc.profile.validation.cityRequired')
    })

    it('returns error for whitespace-only city', () => {
      const data = { ...validProfileData, city: '   ' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.city).toBe('kyc.profile.validation.cityRequired')
    })
  })

  describe('First name validation', () => {
    it('returns error for empty first name', () => {
      const data = { ...validProfileData, firstName: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBe('kyc.profile.validation.firstNameRequired')
    })

    it('returns error for first name shorter than 2 characters', () => {
      const data = { ...validProfileData, firstName: 'J' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.firstName).toBe('kyc.profile.validation.firstNameMin')
    })

    it('accepts first name with 2 characters', () => {
      const data = { ...validProfileData, firstName: 'Jo' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.errors.firstName).toBe('')
    })
  })

  describe('Last name validation', () => {
    it('returns error for empty last name', () => {
      const data = { ...validProfileData, lastName: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.lastName).toBe('kyc.profile.validation.lastNameRequired')
    })

    it('returns error for last name shorter than 2 characters', () => {
      const data = { ...validProfileData, lastName: 'D' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.lastName).toBe('kyc.profile.validation.lastNameMin')
    })

    it('accepts last name with 2 characters', () => {
      const data = { ...validProfileData, lastName: 'Li' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.errors.lastName).toBe('')
    })
  })

  describe('Phone validation', () => {
    it('returns error for empty phone', () => {
      const data = { ...validProfileData, phone: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe('kyc.profile.validation.phoneRequired')
    })

    it('returns error for invalid phone format', () => {
      const data = { ...validProfileData, phone: '123' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe('kyc.profile.validation.phoneInvalid')
    })

    it('accepts valid phone with spaces', () => {
      const data = { ...validProfileData, phone: '123 456 7890' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.errors.phone).toBe('')
    })

    it('accepts valid phone with dashes', () => {
      const data = { ...validProfileData, phone: '123-456-7890' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.errors.phone).toBe('')
    })
  })

  describe('Address validation', () => {
    it('returns error for empty address1', () => {
      const data = { ...validProfileData, address1: '' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.address1).toBe('kyc.profile.validation.address1Required')
    })

    it('returns error for whitespace-only address1', () => {
      const data = { ...validProfileData, address1: '   ' }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.address1).toBe('kyc.profile.validation.address1Required')
    })
  })

  describe('Terms validation', () => {
    it('returns error when terms not accepted', () => {
      const data = { ...validProfileData, acceptTerms: false }
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.acceptTerms).toBe('kyc.profile.validation.termsRequired')
    })
  })

  describe('Multiple errors', () => {
    it('returns all errors at once', () => {
      const data: KycProfileData = {
        country: '',
        city: '',
        firstName: '',
        lastName: '',
        phoneCode: '+1',
        phone: '',
        address1: '',
        address2: '',
        acceptTerms: false
      }
      
      const result = validateKycProfile(data, mockT)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.country).not.toBe('')
      expect(result.errors.city).not.toBe('')
      expect(result.errors.firstName).not.toBe('')
      expect(result.errors.lastName).not.toBe('')
      expect(result.errors.phone).not.toBe('')
      expect(result.errors.address1).not.toBe('')
      expect(result.errors.acceptTerms).not.toBe('')
    })
  })
})

describe('isValidPhoneNumber', () => {
  it('returns true for valid 10-digit number', () => {
    expect(isValidPhoneNumber('1234567890')).toBe(true)
  })

  it('returns true for valid number with spaces', () => {
    expect(isValidPhoneNumber('123 456 7890')).toBe(true)
  })

  it('returns true for valid number with dashes', () => {
    expect(isValidPhoneNumber('123-456-7890')).toBe(true)
  })

  it('returns true for valid number with parentheses', () => {
    expect(isValidPhoneNumber('(123) 456-7890')).toBe(true)
  })

  it('returns true for valid 7-digit number', () => {
    expect(isValidPhoneNumber('1234567')).toBe(true)
  })

  it('returns true for valid 15-digit number', () => {
    expect(isValidPhoneNumber('123456789012345')).toBe(true)
  })

  it('returns false for number too short', () => {
    expect(isValidPhoneNumber('123456')).toBe(false)
  })

  it('returns false for number too long', () => {
    expect(isValidPhoneNumber('1234567890123456')).toBe(false)
  })

  it('returns false for number with letters', () => {
    expect(isValidPhoneNumber('123456789a')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidPhoneNumber('')).toBe(false)
  })
})
