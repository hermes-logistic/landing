import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '../../app/components/AppNavbar.vue'
import { useI18n as realUseI18n } from '../../app/composables/useI18n'
import { globalStubs } from '../../vitest.setup'
import en from '../../locales/en.json'
import es from '../../locales/es.json'

/**
 * The navbar renders its labels in the active locale.
 *
 * This used to drive the locale through `navigator.language`, back when
 * useI18n() sniffed it. It no longer does: the URL owns the locale (`/` is
 * English, `/es` is Spanish) and each page pins it with setLocale() — see
 * app/composables/useLocaleRoutes.ts. Same assertion, supported entry point.
 *
 * The expected labels come from the locale files rather than being hardcoded:
 * what this guards is the wiring (setLocale -> t() -> rendered output), not the
 * marketing copy, which belongs to locales/*.json and moves on its own.
 */
describe('Landing i18n', () => {
  beforeEach(() => {
    // Replace the setup stub (whose t() returns the key) with the real composable.
    // @ts-expect-error: swap the test stub for the real composable
    global.useI18n = realUseI18n
  })

  function renderNavbarIn(locale: string) {
    realUseI18n().setLocale(locale)
    return mount(AppNavbar, {
      props: { isContactModalOpen: false },
      global: { stubs: { ...globalStubs, ContactModal: true } },
    }).text()
  }

  it('renders Spanish nav text when the locale is es', () => {
    const text = renderNavbarIn('es')
    expect(text).toContain(es.nav.who)
    expect(text).toContain(es.nav.pricing)
    expect(text).toContain(es.nav.cta)
  })

  it('renders English nav text when the locale is en', () => {
    const text = renderNavbarIn('en')
    expect(text).toContain(en.nav.who)
    expect(text).toContain(en.nav.pricing)
    expect(text).toContain(en.nav.cta)
  })

  it('renders different text in each locale', () => {
    expect(renderNavbarIn('es')).not.toBe(renderNavbarIn('en'))
  })
})
