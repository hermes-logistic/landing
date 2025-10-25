import { I18n } from 'i18n-js'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import { computed } from 'vue'

// Global i18n instance
let globalI18n: I18n | null = null

export function useI18n() {
  if (!globalI18n) {
    globalI18n = new I18n()
    globalI18n.store({ en, es })
  }

  const i18n = globalI18n

  // Shared locale state
  const locale = useState('i18n-locale', () => {
    // Detect language
    let detectedLang: string
    if (typeof window === 'undefined') {
      // Server-side: use Accept-Language header
      const headers = useRequestHeaders()
      const acceptLang: string = headers['accept-language'] || 'en'
      const langParts = acceptLang.split(',')
      detectedLang = (langParts[0]?.split('-')[0]) || 'en'
    } else {
      // Client-side: use navigator.language
      const navLang = navigator.language || 'en'
      detectedLang = navLang.split('-').shift() || 'en'
    }
    return detectedLang in { en: true, es: true } ? detectedLang : 'en'
  })

  // Set initial locale
  i18n.locale = locale.value

  function t(key: string, opts?: Record<string, unknown>) {
    return computed(() => {
      i18n.locale = locale.value
      return i18n.t(key, opts)
    })
  }

  function setLocale(l: string) {
    locale.value = l
    i18n.locale = l
    if (typeof window !== 'undefined') {
      document.documentElement.lang = l
    }
  }

  // Ensure document lang is set on client
  if (typeof window !== 'undefined') {
    document.documentElement.lang = locale.value
  }

  return { t, locale, setLocale }
}
