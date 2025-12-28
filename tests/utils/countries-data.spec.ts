import { describe, it, expect } from 'vitest'
import {
  countries,
  citiesByCountry,
  getCitiesByCountry,
  getCountryByCode,
  getPhoneCodeByCountry
} from '../../app/utils/countries-data'

describe('countries-data', () => {
  describe('countries array', () => {
    it('contains country data with required fields', () => {
      expect(countries.length).toBeGreaterThan(0)
      
      countries.forEach(country => {
        expect(country).toHaveProperty('code')
        expect(country).toHaveProperty('name')
        expect(country).toHaveProperty('phoneCode')
        expect(country.code).toMatch(/^[A-Z]{2}$/)
        expect(country.phoneCode).toMatch(/^\+\d+$/)
      })
    })

    it('includes El Salvador', () => {
      const sv = countries.find(c => c.code === 'SV')
      expect(sv).toBeDefined()
      expect(sv?.name).toBe('El Salvador')
      expect(sv?.phoneCode).toBe('+503')
    })

    it('includes United States', () => {
      const us = countries.find(c => c.code === 'US')
      expect(us).toBeDefined()
      expect(us?.name).toBe('United States')
      expect(us?.phoneCode).toBe('+1')
    })
  })

  describe('citiesByCountry', () => {
    it('has cities for all countries in the list', () => {
      countries.forEach(country => {
        const cities = citiesByCountry[country.code]
        expect(cities).toBeDefined()
        expect(Array.isArray(cities)).toBe(true)
        expect(cities!.length).toBeGreaterThan(0)
      })
    })

    it('includes expected cities for El Salvador', () => {
      const svCities = citiesByCountry['SV']
      expect(svCities).toContain('San Salvador')
      expect(svCities).toContain('Santa Ana')
    })

    it('includes expected cities for United States', () => {
      const usCities = citiesByCountry['US']
      expect(usCities).toContain('New York')
      expect(usCities).toContain('Los Angeles')
      expect(usCities).toContain('Miami')
    })
  })

  describe('getCitiesByCountry', () => {
    it('returns cities for valid country code', () => {
      const cities = getCitiesByCountry('US')
      expect(Array.isArray(cities)).toBe(true)
      expect(cities.length).toBeGreaterThan(0)
      expect(cities).toContain('New York')
    })

    it('returns empty array for invalid country code', () => {
      const cities = getCitiesByCountry('XX')
      expect(Array.isArray(cities)).toBe(true)
      expect(cities.length).toBe(0)
    })

    it('returns empty array for empty string', () => {
      const cities = getCitiesByCountry('')
      expect(cities.length).toBe(0)
    })
  })

  describe('getCountryByCode', () => {
    it('returns country object for valid code', () => {
      const country = getCountryByCode('SV')
      expect(country).toBeDefined()
      expect(country?.name).toBe('El Salvador')
      expect(country?.phoneCode).toBe('+503')
    })

    it('returns undefined for invalid code', () => {
      const country = getCountryByCode('XX')
      expect(country).toBeUndefined()
    })

    it('returns undefined for empty string', () => {
      const country = getCountryByCode('')
      expect(country).toBeUndefined()
    })

    it('is case-sensitive', () => {
      const country = getCountryByCode('us')
      expect(country).toBeUndefined()
    })
  })

  describe('getPhoneCodeByCountry', () => {
    it('returns phone code for valid country', () => {
      expect(getPhoneCodeByCountry('US')).toBe('+1')
      expect(getPhoneCodeByCountry('SV')).toBe('+503')
      expect(getPhoneCodeByCountry('MX')).toBe('+52')
    })

    it('returns +1 as default for invalid country', () => {
      expect(getPhoneCodeByCountry('XX')).toBe('+1')
    })

    it('returns +1 as default for empty string', () => {
      expect(getPhoneCodeByCountry('')).toBe('+1')
    })
  })
})
