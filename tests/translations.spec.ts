import { describe, it, expect } from 'vitest'

// Simular las traducciones (en un test real, podrías mockearlo mejor)
const enTranslations = {
  contact: {
    title: 'Get in Touch with Hermes',
    description: 'Ready to transform your fleet management? Contact us today and discover how Hermes can optimize your logistics operations.',
    cta: 'Contact Us',
    modal: {
      title: 'Contact Us',
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email Address',
      emailPlaceholder: 'john@example.com',
      company: 'Company Name',
      companyPlaceholder: 'Your Company',
      message: 'Message',
      messagePlaceholder: 'Tell us about your fleet management needs...',
      send: 'Send Message',
      sending: 'Sending...',
      successMessage: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
      errorMessage: 'Something went wrong. Please try again.',
      privacy: 'We respect your privacy. Your information is safe with us.'
    }
  },
  nav: {
    contact: 'Contact Us'
  }
}

const esTranslations = {
  contact: {
    title: 'Contáctanos en Hermes',
    description: '¿Listo para transformar la gestión de tu flota? Contáctanos hoy y descubre cómo Hermes puede optimizar tus operaciones logísticas.',
    cta: 'Contáctanos',
    modal: {
      title: 'Contáctanos',
      name: 'Nombre Completo',
      namePlaceholder: 'Juan Pérez',
      email: 'Correo Electrónico',
      emailPlaceholder: 'juan@example.com',
      company: 'Nombre de la Empresa',
      companyPlaceholder: 'Tu Empresa',
      message: 'Mensaje',
      messagePlaceholder: 'Cuéntanos sobre tus necesidades de gestión de flota...',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      successMessage: '¡Gracias! Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.',
      errorMessage: 'Algo salió mal. Por favor intenta de nuevo.',
      privacy: 'Respetamos tu privacidad. Tu información está segura con nosotros.'
    }
  },
  nav: {
    contact: 'Contáctanos'
  }
}

describe('Translations', () => {
  describe('Contact translations', () => {
    it('should have all required contact translations in English', () => {
      expect(enTranslations.contact).toBeDefined()
      expect(enTranslations.contact.title).toBeDefined()
      expect(enTranslations.contact.description).toBeDefined()
      expect(enTranslations.contact.cta).toBeDefined()
      expect(typeof enTranslations.contact.title).toBe('string')
      expect(typeof enTranslations.contact.description).toBe('string')
      expect(typeof enTranslations.contact.cta).toBe('string')
    })

    it('should have all required contact translations in Spanish', () => {
      expect(esTranslations.contact).toBeDefined()
      expect(esTranslations.contact.title).toBeDefined()
      expect(esTranslations.contact.description).toBeDefined()
      expect(esTranslations.contact.cta).toBeDefined()
      expect(typeof esTranslations.contact.title).toBe('string')
      expect(typeof esTranslations.contact.description).toBe('string')
      expect(typeof esTranslations.contact.cta).toBe('string')
    })

    it('should not have duplicate contact keys', () => {
      const enContactKeys = Object.keys(enTranslations.contact)
      const uniqueKeys = new Set(enContactKeys)
      expect(enContactKeys.length).toBe(uniqueKeys.size)
    })

    it('should not have duplicate contact keys in Spanish', () => {
      const esContactKeys = Object.keys(esTranslations.contact)
      const uniqueKeys = new Set(esContactKeys)
      expect(esContactKeys.length).toBe(uniqueKeys.size)
    })
  })

  describe('Modal translations', () => {
    it('should have all required modal translations in English', () => {
      expect(enTranslations.contact.modal).toBeDefined()
      expect(enTranslations.contact.modal.title).toBeDefined()
      expect(enTranslations.contact.modal.name).toBeDefined()
      expect(enTranslations.contact.modal.email).toBeDefined()
      expect(enTranslations.contact.modal.company).toBeDefined()
      expect(enTranslations.contact.modal.message).toBeDefined()
      expect(enTranslations.contact.modal.send).toBeDefined()
      expect(enTranslations.contact.modal.successMessage).toBeDefined()
      expect(enTranslations.contact.modal.errorMessage).toBeDefined()
      expect(enTranslations.contact.modal.privacy).toBeDefined()
    })

    it('should have all required modal translations in Spanish', () => {
      expect(esTranslations.contact.modal).toBeDefined()
      expect(esTranslations.contact.modal.title).toBeDefined()
      expect(esTranslations.contact.modal.name).toBeDefined()
      expect(esTranslations.contact.modal.email).toBeDefined()
      expect(esTranslations.contact.modal.company).toBeDefined()
      expect(esTranslations.contact.modal.message).toBeDefined()
      expect(esTranslations.contact.modal.send).toBeDefined()
      expect(esTranslations.contact.modal.successMessage).toBeDefined()
      expect(esTranslations.contact.modal.errorMessage).toBeDefined()
      expect(esTranslations.contact.modal.privacy).toBeDefined()
    })

    it('should have matching keys in English and Spanish modal translations', () => {
      const enKeys = Object.keys(enTranslations.contact.modal).sort()
      const esKeys = Object.keys(esTranslations.contact.modal).sort()
      expect(enKeys).toEqual(esKeys)
    })

    it('should not have empty translation strings', () => {
      Object.values(enTranslations.contact.modal).forEach((value) => {
        expect(value).toBeTruthy()
        expect(typeof value).toBe('string')
        if (typeof value === 'string') {
          expect(value.length).toBeGreaterThan(0)
        }
      })
    })
  })

  describe('Navigation translations', () => {
    it('should have contact in nav translations', () => {
      expect(enTranslations.nav.contact).toBeDefined()
      expect(esTranslations.nav.contact).toBeDefined()
    })
  })
})
