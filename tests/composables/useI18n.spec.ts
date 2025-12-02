import { describe, it, expect } from 'vitest'
import { useI18n } from '../../app/composables/useI18n'

// Provide minimal global stubs in case not initialized
// useState and useRequestHeaders may already exist from setup, but ensure fallback
// @ts-expect-error - Stubbing useState for tests
if (!globalThis.useState) {
  // @ts-expect-error - Stubbing useState for tests
  globalThis.useState = (key: string, init: () => unknown) => ({ value: init() })
}
// @ts-expect-error - Stubbing useRequestHeaders for tests
if (!globalThis.useRequestHeaders) {
  // @ts-expect-error - Stubbing useRequestHeaders for tests
  globalThis.useRequestHeaders = () => ({ 'accept-language': 'en' })
}

describe('useI18n composable', () => {
  it('returns actual translation for hero title', () => {
    const { t } = useI18n()
    expect(t('hero.title')).toContain('Transform')
  })

  it('allows locale change and updates translation', () => {
    const { locale, setLocale, t } = useI18n()
    setLocale('es')
    expect(locale.value).toBe('es')
    // Spanish translation should differ
    expect(t('hero.title')).not.toContain('Transform your fleet')
  })
})
