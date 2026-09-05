import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalePage } from '../../app/composables/useLocalePage'
import { useI18n } from '../../app/composables/useI18n'
import { headCalls, seoCalls, resetHeadStubs } from '../stubs/nuxt-imports'
import en from '../../locales/en.json'
import es from '../../locales/es.json'

/** Flattens every `link` entry the composable pushed into useHead(). */
function links() {
  return headCalls.flatMap(call => call.link ?? [])
}

function alternates() {
  return links().filter(l => l.rel === 'alternate')
}

function canonical() {
  return links().find(l => l.rel === 'canonical')
}

/** useSeoMeta accepts getters; resolve them so values can be asserted. */
function seo(key: string) {
  const value = seoCalls.at(-1)?.[key]
  return typeof value === 'function' ? (value as () => unknown)() : value
}

describe('useLocalePage', () => {
  beforeEach(() => {
    resetHeadStubs()
  })

  it('pins the shared locale so SSR renders in the right language', () => {
    useLocalePage('es')
    expect(useI18n().locale.value).toBe('es')
  })

  it('emits a self-referencing canonical per locale', () => {
    useLocalePage('es')
    expect(canonical()?.href).toBe('https://www.hermesv.io/es')

    resetHeadStubs()
    useLocalePage('en')
    expect(canonical()?.href).toBe('https://www.hermesv.io/')
  })

  it('emits the full hreflang cluster on both locales', () => {
    for (const locale of ['en', 'es'] as const) {
      resetHeadStubs()
      useLocalePage(locale)
      // Same cluster either way: each version must advertise every version,
      // itself included, or search engines discard the whole set.
      expect(alternates().map(l => l.hreflang)).toEqual(['en', 'es-419', 'x-default'])
    }
  })

  it('never points an alternate at a URL outside the site', () => {
    useLocalePage('en')
    for (const link of alternates()) {
      expect(String(link.href).startsWith('https://www.hermesv.io/')).toBe(true)
    }
  })

  it('declares the locale and its siblings for Open Graph', () => {
    useLocalePage('es')
    expect(seo('ogLocale')).toBe('es_419')
    expect(seo('ogLocaleAlternate')).toEqual(['en_US'])
    expect(seo('ogUrl')).toBe('https://www.hermesv.io/es')

    resetHeadStubs()
    useLocalePage('en')
    expect(seo('ogLocale')).toBe('en_US')
    expect(seo('ogLocaleAlternate')).toEqual(['es_419'])
  })

  it('takes title and description from the locale files, not from hardcoded copy', () => {
    useLocalePage('es')
    expect(seo('title')).toBe(es.seo.title)
    expect(seo('description')).toBe(es.seo.description)

    resetHeadStubs()
    useLocalePage('en')
    expect(seo('title')).toBe(en.seo.title)
    expect(seo('description')).toBe(en.seo.description)
  })

  it('resolves every SEO getter from the locale files', () => {
    // useSeoMeta is handed getters, not strings: the values only prove they come
    // from i18n once each getter is actually invoked.
    const keys = [
      'title',
      'description',
      'keywords',
      'ogTitle',
      'ogDescription',
      'twitterTitle',
      'twitterDescription',
    ] as const
    const messages: Record<string, Record<string, string>> = { en: en.seo, es: es.seo }

    for (const locale of ['en', 'es'] as const) {
      resetHeadStubs()
      useLocalePage(locale)
      for (const key of keys) {
        expect(seo(key)).toBe(messages[locale]?.[key])
      }
    }
  })

  it('keeps the page indexable', () => {
    useLocalePage('en')
    expect(seo('robots')).toBe('index, follow')
  })
})
