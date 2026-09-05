import { I18n } from 'i18n-js'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import { DEFAULT_LOCALE, isLocale, type Locale } from './useLocaleRoutes'

// Global i18n instance
let globalI18n: I18n | null = null

export function useI18n() {
  if (!globalI18n) {
    globalI18n = new I18n()
    globalI18n.store({ en, es })
    globalI18n.defaultLocale = DEFAULT_LOCALE
    globalI18n.enableFallback = true
  }

  const i18n = globalI18n

  // Shared locale state. The route is what decides the locale — `/` is English
  // and `/es` is Spanish — and each page calls setLocale() during setup, so this
  // only needs a stable default. It deliberately no longer sniffs
  // `Accept-Language`: serving both languages from one URL is what made the
  // Spanish content unreachable for crawlers.
  const locale = useState<Locale>('i18n-locale', () => DEFAULT_LOCALE)

  // Set initial locale
  i18n.locale = locale.value

  function t(key: string, opts?: Record<string, unknown>) {
    i18n.locale = locale.value
    return i18n.t(key, opts)
  }

  function setLocale(value: string) {
    const next: Locale = isLocale(value) ? value : DEFAULT_LOCALE
    locale.value = next
    i18n.locale = next
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
  }

  return { t, locale, setLocale }
}
