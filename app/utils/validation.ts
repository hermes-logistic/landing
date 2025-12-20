/**
 * Validation utility functions for forms
 */

/**
 * Valid OAuth providers supported by the application
 */
export const VALID_OAUTH_PROVIDERS = ['google', 'microsoft'] as const
export type OAuthProvider = typeof VALID_OAUTH_PROVIDERS[number]

/**
 * Validates if a string is a valid email address
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^(?!.*\.\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

/**
 * Validates if a password meets minimum length requirement
 * @param password - The password string to validate
 * @param minLength - Minimum required length (default: 8)
 * @returns true if the password meets the requirement, false otherwise
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  return password.length >= minLength
}

/**
 * Validates if a provider is in the allowlist of valid OAuth providers
 * @param provider - The provider string to validate
 * @returns true if the provider is valid, false otherwise
 */
export function isValidOAuthProvider(provider: string): provider is OAuthProvider {
  return VALID_OAUTH_PROVIDERS.includes(provider as OAuthProvider)
}
