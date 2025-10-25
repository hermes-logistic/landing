import { I18n } from 'i18n-js'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import { ref } from 'vue'

export function useI18n() {
  // create new I18n instance
  const i18n = new I18n()
  
  // load locales under their locale codes
  i18n.store({ en, es })

  // detect language
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

  i18n.locale = detectedLang in { en: true, es: true } ? detectedLang : 'en'

  const locale = ref(i18n.locale)

  function t(key: string, opts?: Record<string, unknown>) {
    return i18n.t(key, opts)
  }

  function setLocale(l: string) {
    i18n.locale = l
    locale.value = l
    if (typeof window !== 'undefined') {
      document.documentElement.lang = l
    }
  }

  // ensure document lang is set on client
  if (typeof window !== 'undefined') {
    document.documentElement.lang = locale.value
  }

  return { t, locale, setLocale }
}
