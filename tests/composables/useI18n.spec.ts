import { describe, it, expect } from 'vitest'
import { useI18n } from '../../app/composables/useI18n'

// Provide minimal global stubs in case not initialized
// useState and useRequestHeaders may already exist from setup, but ensure fallback
// @ts-ignore
if (!globalThis.useState) {
  // @ts-ignore
  globalThis.useState = (key: string, init: () => any) => ({ value: init() })
}
// @ts-ignore
if (!globalThis.useRequestHeaders) {
  // @ts-ignore
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
