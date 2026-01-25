import { describe, it, expect } from 'vitest'
import {
  validateNumberOfDrivers,
  validateKycDriversData,
  type KycDriversData
} from '../../app/utils/kyc-drivers-validation'

describe('validateNumberOfDrivers', () => {
  it('returns null for valid number of drivers', () => {
    expect(validateNumberOfDrivers(1)).toBeNull()
    expect(validateNumberOfDrivers(5)).toBeNull()
    expect(validateNumberOfDrivers(50)).toBeNull()
    expect(validateNumberOfDrivers(100)).toBeNull()
  })

  it('returns error for less than 1 driver', () => {
    const result = validateNumberOfDrivers(0)

    expect(result).not.toBeNull()
    expect(result?.field).toBe('numberOfDrivers')
    expect(result?.message).toBe('Please add at least one driver')
  })

  it('returns error for negative number', () => {
    const result = validateNumberOfDrivers(-5)

    expect(result).not.toBeNull()
    expect(result?.field).toBe('numberOfDrivers')
    expect(result?.message).toBe('Please add at least one driver')
  })

  it('returns error for more than 100 drivers', () => {
    const result = validateNumberOfDrivers(101)

    expect(result).not.toBeNull()
    expect(result?.field).toBe('numberOfDrivers')
    expect(result?.message).toBe('Maximum 100 drivers allowed')
  })

  it('returns error for non-integer number', () => {
    const result = validateNumberOfDrivers(5.5)

    expect(result).not.toBeNull()
    expect(result?.field).toBe('numberOfDrivers')
    expect(result?.message).toBe('Number of drivers must be a whole number')
  })

  it('returns error for decimal number even if close to integer', () => {
    const result = validateNumberOfDrivers(10.1)

    expect(result).not.toBeNull()
    expect(result?.field).toBe('numberOfDrivers')
  })
})

describe('validateKycDriversData', () => {
  it('returns empty array for valid data', () => {
    const data: KycDriversData = { numberOfDrivers: 5 }
    const errors = validateKycDriversData(data)

    expect(errors).toEqual([])
  })

  it('returns error array for invalid number of drivers', () => {
    const data: KycDriversData = { numberOfDrivers: 0 }
    const errors = validateKycDriversData(data)

    expect(errors.length).toBe(1)
    expect(errors[0].field).toBe('numberOfDrivers')
    expect(errors[0].message).toBe('Please add at least one driver')
  })

  it('returns error for number exceeding maximum', () => {
    const data: KycDriversData = { numberOfDrivers: 150 }
    const errors = validateKycDriversData(data)

    expect(errors.length).toBe(1)
    expect(errors[0].field).toBe('numberOfDrivers')
    expect(errors[0].message).toBe('Maximum 100 drivers allowed')
  })

  it('returns error for decimal number', () => {
    const data: KycDriversData = { numberOfDrivers: 7.8 }
    const errors = validateKycDriversData(data)

    expect(errors.length).toBe(1)
    expect(errors[0].field).toBe('numberOfDrivers')
    expect(errors[0].message).toBe('Number of drivers must be a whole number')
  })

  it('handles edge case of exactly 1 driver', () => {
    const data: KycDriversData = { numberOfDrivers: 1 }
    const errors = validateKycDriversData(data)

    expect(errors).toEqual([])
  })

  it('handles edge case of exactly 100 drivers', () => {
    const data: KycDriversData = { numberOfDrivers: 100 }
    const errors = validateKycDriversData(data)

    expect(errors).toEqual([])
  })
})
