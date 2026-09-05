/**
 * Locale routing for the landing site.
 *
 * The URL is the single source of truth for the locale: `/` serves English and
 * `/es` serves Spanish. Before this, the locale was resolved at runtime from
 * `Accept-Language` over one shared URL, which made the Spanish content
 * unreachable for crawlers — Googlebot requests with `Accept-Language: en` and
 * would only ever see the English version.
 *
 * Kept free of Nuxt composables on purpose so it can be unit-tested directly.
 */

export const SUPPORTED_LOCALES = ['en', 'es'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Origin used to build absolute URLs for canonical, hreflang and Open Graph. */
export const SITE_URL = 'https://www.hermesv.io'

/** Route path that serves each locale. English is the root, so it takes no prefix. */
const LOCALE_PATH: Record<Locale, string> = {
  en: '/',
  es: '/es',
}

/**
 * BCP 47 tags for hreflang. Spanish targets Latin America (`es-419`), matching
 * the USD pricing and the vocabulary used across `locales/es.json`.
 */
const LOCALE_HREFLANG: Record<Locale, string> = {
  en: 'en',
  es: 'es-419',
}

/** Open Graph locale tags, which use an underscore rather than a hyphen. */
const LOCALE_OG: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_419',
}

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * Resolves the locale a route path belongs to. Anything under `/es` is Spanish;
 * everything else falls back to the default locale rather than 404ing, so an
 * unknown path still renders in a valid language.
 */
export function localeFromPath(path: string): Locale {
  return /^\/es(\/|$)/.test(path) ? 'es' : DEFAULT_LOCALE
}

/** Route path serving a locale, e.g. `'es'` -> `'/es'`. */
export function pathForLocale(locale: Locale): string {
  return LOCALE_PATH[locale]
}

export function hreflangFor(locale: Locale): string {
  return LOCALE_HREFLANG[locale]
}

export function ogLocaleFor(locale: Locale): string {
  return LOCALE_OG[locale]
}

/** Absolute URL for a locale's landing page. */
export function urlForLocale(locale: Locale): string {
  const path = LOCALE_PATH[locale]
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

/**
 * The full hreflang cluster for a page.
 *
 * Every version links to *all* versions including itself: a cluster without
 * self-referencing links, or one whose target 404s, is discarded wholesale by
 * search engines — which is what happened with the previous `/es/` alternate
 * that pointed at a route that did not exist.
 */
export function alternateLinks(): Array<{ rel: string, hreflang: string, href: string }> {
  const alternates = SUPPORTED_LOCALES.map(locale => ({
    rel: 'alternate',
    hreflang: hreflangFor(locale),
    href: urlForLocale(locale),
  }))

  return [
    ...alternates,
    { rel: 'alternate', hreflang: 'x-default', href: urlForLocale(DEFAULT_LOCALE) },
  ]
}
