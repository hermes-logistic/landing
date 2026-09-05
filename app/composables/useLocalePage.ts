import { useHead, useSeoMeta } from '#imports'
import { useI18n } from './useI18n'
import {
  SUPPORTED_LOCALES,
  alternateLinks,
  ogLocaleFor,
  urlForLocale,
  type Locale,
} from './useLocaleRoutes'

/**
 * Wires one landing page to a locale: pins the shared locale state, and emits
 * the per-locale SEO head.
 *
 * Both `/` and `/es` render the same content, so everything that differs
 * between them lives here rather than being duplicated in each page.
 */
export function useLocalePage(locale: Locale) {
  const { t, setLocale } = useI18n()

  // Runs during setup on both server and client, so the SSR'd HTML already
  // carries the right language — the previous fixed `lang="en"` shipped Spanish
  // copy under an English tag, a WCAG 3.1.1 failure.
  setLocale(locale)

  const url = urlForLocale(locale)

  useSeoMeta({
    title: () => t('seo.title'),
    description: () => t('seo.description'),
    keywords: () => t('seo.keywords'),
    ogTitle: () => t('seo.ogTitle'),
    ogDescription: () => t('seo.ogDescription'),
    ogUrl: url,
    ogImage: '/images/og-image.png',
    ogType: 'website',
    ogLocale: ogLocaleFor(locale),
    // Every other supported locale, so each version advertises its siblings.
    ogLocaleAlternate: SUPPORTED_LOCALES
      .filter(other => other !== locale)
      .map(ogLocaleFor),
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('seo.twitterTitle'),
    twitterDescription: () => t('seo.twitterDescription'),
    twitterImage: '/images/og-image.png',
    author: 'Hermes Logistics',
    robots: 'index, follow',
  })

  useHead({
    link: [
      // Self-referencing canonical: each locale is its own indexable URL.
      { rel: 'canonical', href: url },
      // Full hreflang cluster, self-reference included. A cluster missing the
      // self link — or pointing at a 404, as the old `/es/` alternate did — is
      // discarded entirely, taking the English signal down with it.
      ...alternateLinks(),
    ],
  })
}
