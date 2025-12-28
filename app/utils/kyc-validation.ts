export interface KycProfileData {
  country: string
  city: string
  firstName: string
  lastName: string
  phoneCode: string
  phone: string
  address1: string
  address2: string
  acceptTerms: boolean
}

export interface KycProfileErrors {
  country: string
  city: string
  firstName: string
  lastName: string
  phone: string
  address1: string
  acceptTerms: string
}

export interface ValidationResult {
  isValid: boolean
  errors: KycProfileErrors
}

type TranslateFunction = (key: string) => string

export function validateKycProfile(
  data: KycProfileData,
  t: TranslateFunction
): ValidationResult {
  const errors: KycProfileErrors = {
    country: '',
    city: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    acceptTerms: ''
  }

  let isValid = true

  // Country validation
  if (!data.country || data.country.trim() === '') {
    errors.country = t('kyc.profile.validation.countryRequired')
    isValid = false
  }

  // City validation
  if (!data.city || data.city.trim() === '') {
    errors.city = t('kyc.profile.validation.cityRequired')
    isValid = false
  }

  // First name validation
  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = t('kyc.profile.validation.firstNameRequired')
    isValid = false
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = t('kyc.profile.validation.firstNameMin')
    isValid = false
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = t('kyc.profile.validation.lastNameRequired')
    isValid = false
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = t('kyc.profile.validation.lastNameMin')
    isValid = false
  }

  // Phone validation
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = t('kyc.profile.validation.phoneRequired')
    isValid = false
  } else if (!isValidPhoneNumber(data.phone)) {
    errors.phone = t('kyc.profile.validation.phoneInvalid')
    isValid = false
  }

  // Address 1 validation
  if (!data.address1 || data.address1.trim() === '') {
    errors.address1 = t('kyc.profile.validation.address1Required')
    isValid = false
  }

  // Terms validation
  if (!data.acceptTerms) {
    errors.acceptTerms = t('kyc.profile.validation.termsRequired')
    isValid = false
  }

  return { isValid, errors }
}

export function isValidPhoneNumber(phone: string): boolean {
  // Remove spaces, dashes, and parentheses for validation
  const cleanPhone = phone.replace(/[\s\-()]/g, '')
  // Phone should be at least 7 digits and only contain numbers
  return /^\d{7,15}$/.test(cleanPhone)
}
