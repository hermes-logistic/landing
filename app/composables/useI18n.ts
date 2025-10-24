import { I18n } from 'i18n-js'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import { ref } from 'vue'

export function useI18n() {
  // create new I18n instance
  const i18n = new I18n()
  
  // load locales under their locale codes
  i18n.store({ en, es })

  // detect browser language
  const browserLang = (typeof window === 'undefined') ? 'en' : (navigator.language || (navigator as any).userLanguage || 'en')
  const initial = browserLang.split('-')[0]

  i18n.locale = initial in { en: true, es: true } ? initial : 'en'

  const locale = ref(i18n.locale)

  function t(key: string, opts?: Record<string, any>) {
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
