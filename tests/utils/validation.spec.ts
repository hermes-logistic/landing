import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword, isValidOAuthProvider, VALID_OAUTH_PROVIDERS } from '../../app/utils/validation'

describe('Validation utilities', () => {
  describe('isValidEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('returns false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('notanemail')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user name@example.com')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('returns true for passwords meeting minimum length', () => {
      expect(isValidPassword('12345678')).toBe(true)
      expect(isValidPassword('password123')).toBe(true)
      expect(isValidPassword('a'.repeat(20))).toBe(true)
    })

    it('returns false for passwords below minimum length', () => {
      expect(isValidPassword('')).toBe(false)
      expect(isValidPassword('1234567')).toBe(false)
      expect(isValidPassword('short')).toBe(false)
    })

    it('accepts custom minimum length', () => {
      expect(isValidPassword('12345', 5)).toBe(true)
      expect(isValidPassword('1234', 5)).toBe(false)
      expect(isValidPassword('password123', 12)).toBe(false)
      expect(isValidPassword('password1234', 12)).toBe(true)
    })
  })

  describe('isValidOAuthProvider', () => {
    it('returns true for valid OAuth providers', () => {
      expect(isValidOAuthProvider('google')).toBe(true)
      expect(isValidOAuthProvider('microsoft')).toBe(true)
    })

    it('returns false for invalid OAuth providers', () => {
      expect(isValidOAuthProvider('')).toBe(false)
      expect(isValidOAuthProvider('facebook')).toBe(false)
      expect(isValidOAuthProvider('twitter')).toBe(false)
      expect(isValidOAuthProvider('evil.com')).toBe(false)
      expect(isValidOAuthProvider('../../../etc/passwd')).toBe(false)
    })

    it('is case-sensitive', () => {
      expect(isValidOAuthProvider('Google')).toBe(false)
      expect(isValidOAuthProvider('MICROSOFT')).toBe(false)
    })
  })

  describe('VALID_OAUTH_PROVIDERS', () => {
    it('contains expected providers', () => {
      expect(VALID_OAUTH_PROVIDERS).toContain('google')
      expect(VALID_OAUTH_PROVIDERS).toContain('microsoft')
      expect(VALID_OAUTH_PROVIDERS).toHaveLength(2)
    })
  })
})
