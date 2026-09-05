import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  DEFAULT_LOCALE,
  SITE_URL,
  SUPPORTED_LOCALES,
  alternateLinks,
  hreflangFor,
  isLocale,
  isLocalePinnedPath,
  localeFromPath,
  ogLocaleFor,
  pathForLocale,
  preferredLocale,
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

  describe('isLocalePinnedPath', () => {
    it('pins the locale on the landing routes', () => {
      expect(isLocalePinnedPath('/')).toBe(true)
      expect(isLocalePinnedPath('/es')).toBe(true)
    })

    it('normalises the trailing slash', () => {
      expect(isLocalePinnedPath('/es/')).toBe(true)
      expect(isLocalePinnedPath('')).toBe(true)
    })

    it('does not pin the web app routes, which carry no locale in the URL', () => {
      expect(isLocalePinnedPath('/signin')).toBe(false)
      expect(isLocalePinnedPath('/signup')).toBe(false)
      expect(isLocalePinnedPath('/kyc')).toBe(false)
      expect(isLocalePinnedPath('/kyc/profile')).toBe(false)
    })

    it('does not pin a path that merely starts with the same letters as /es', () => {
      // '/estimates' is a web app route, not the Spanish landing: pinning it
      // would freeze it to Spanish and block the post-hydration preference.
      expect(isLocalePinnedPath('/estimates')).toBe(false)
    })
  })

  describe('preferredLocale', () => {
    // navigator is read by components mounted elsewhere in the suite, so every
    // stub here is undone before the next test file runs.
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('returns the browser locale when we support it', () => {
      vi.stubGlobal('navigator', { language: 'es-ES' })
      expect(preferredLocale()).toBe('es')

      vi.stubGlobal('navigator', { language: 'es' })
      expect(preferredLocale()).toBe('es')

      vi.stubGlobal('navigator', { language: 'en-US' })
      expect(preferredLocale()).toBe('en')
    })

    it('returns null for a language we do not serve', () => {
      vi.stubGlobal('navigator', { language: 'fr-FR' })
      expect(preferredLocale()).toBeNull()
    })

    it('returns null when the browser reports no language', () => {
      vi.stubGlobal('navigator', { language: '' })
      expect(preferredLocale()).toBeNull()
    })

    it('returns null on the server, where there is no navigator', () => {
      vi.stubGlobal('navigator', undefined)
      expect(preferredLocale()).toBeNull()
    })
  })
})
