import 'server-only'
import type { Locale } from './i18n.config'

const dictionaries = {
  en: () => import('./src/locales/en.json').then(module => module.default),
  es: () => import('./src/locales/es.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) => {
  try {
    // Validate locale before attempting to load
    if (!locale || !(locale in dictionaries)) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid locale: ${locale}, falling back to 'en'`)
      return await dictionaries.en()
    }
    return await dictionaries[locale]()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error loading dictionary for locale ${locale}:`, error)
    // Fallback to English if the requested locale fails
    try {
      return await dictionaries.en()
    } catch (fallbackError) {
      // eslint-disable-next-line no-console
      console.error('Error loading fallback dictionary:', fallbackError)
      // Return minimal fallback object to prevent crashes
      return {
        mainSection: { title: 'Welcome' },
        menu: {},
        whoWeAre: {},
        purposeAchieve: {},
        benefits: {},
        features: {},
        pricing: {},
        contact: {},
      }
    }
  }
}
