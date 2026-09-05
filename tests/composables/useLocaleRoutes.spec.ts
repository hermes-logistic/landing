import { describe, it, expect } from 'vitest'
import {
  DEFAULT_LOCALE,
  SITE_URL,
  SUPPORTED_LOCALES,
  alternateLinks,
  hreflangFor,
  isLocale,
  localeFromPath,
  ogLocaleFor,
  pathForLocale,
  urlForLocale,
} from '../../app/composables/useLocaleRoutes'

describe('useLocaleRoutes', () => {
  it('supports exactly en and es, defaulting to en', () => {
    expect([...SUPPORTED_LOCALES]).toEqual(['en', 'es'])
    expect(DEFAULT_LOCALE).toBe('en')
  })

  it('recognises supported locales and rejects anything else', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('es')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale('')).toBe(false)
  })

  it('maps route paths to their locale', () => {
    expect(localeFromPath('/es')).toBe('es')
    expect(localeFromPath('/es/')).toBe('es')
    expect(localeFromPath('/es/anything')).toBe('es')
    expect(localeFromPath('/')).toBe('en')
    expect(localeFromPath('/pricing')).toBe('en')
  })

  it('does not treat a path that merely starts with "es" as Spanish', () => {
    // '/estimates' is an English path, not the Spanish home.
    expect(localeFromPath('/estimates')).toBe('en')
  })

  it('falls back to the default locale for unknown paths instead of failing', () => {
    expect(localeFromPath('/de')).toBe('en')
  })

  it('serves English from the root and Spanish from /es', () => {
    expect(pathForLocale('en')).toBe('/')
    expect(pathForLocale('es')).toBe('/es')
  })

  it('builds absolute URLs, keeping the trailing slash only on the root', () => {
    expect(urlForLocale('en')).toBe(`${SITE_URL}/`)
    expect(urlForLocale('es')).toBe(`${SITE_URL}/es`)
  })

  it('targets Latin American Spanish in hreflang and Open Graph', () => {
    expect(hreflangFor('en')).toBe('en')
    expect(hreflangFor('es')).toBe('es-419')
    expect(ogLocaleFor('en')).toBe('en_US')
    expect(ogLocaleFor('es')).toBe('es_419')
  })

  describe('alternateLinks', () => {
    const links = alternateLinks()

    it('lists every locale plus x-default', () => {
      expect(links.map(l => l.hreflang)).toEqual(['en', 'es-419', 'x-default'])
    })

    it('points x-default at the default locale', () => {
      const xDefault = links.find(l => l.hreflang === 'x-default')
      expect(xDefault?.href).toBe(urlForLocale(DEFAULT_LOCALE))
    })

    it('is self-referencing, so the cluster validates', () => {
      // A cluster whose members do not link back to themselves is discarded
      // wholesale, which is what happened while /es/ was a 404.
      for (const locale of SUPPORTED_LOCALES) {
        const self = links.find(l => l.hreflang === hreflangFor(locale))
        expect(self?.href).toBe(urlForLocale(locale))
      }
    })

    it('only emits absolute URLs', () => {
      for (const link of links) {
        expect(link.href.startsWith('https://')).toBe(true)
      }
    })
  })
})
