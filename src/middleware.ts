import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

import { i18n } from '../i18n.config'

const PUBLIC_FILE = /\.(.*)$/

function getLocale(request: NextRequest): string {
  try {
    const negotiatorHeaders: Record<string, string> = {}
    // eslint-disable-next-line no-return-assign
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    const { locales } = i18n

    // Safely get languages from negotiator
    let languages: string[] = []
    try {
      languages = new Negotiator({ headers: negotiatorHeaders }).languages()
      // Filter out invalid locales and ensure they are strings
      languages = languages.filter(lang => typeof lang === 'string' && lang.length > 0).map(lang => lang.toLowerCase())
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error parsing Accept-Language header:', error)
      languages = [i18n.defaultLocale]
    }

    // Validate languages array is not empty
    if (!languages || languages.length === 0) {
      return i18n.defaultLocale
    }

    try {
      const locale = matchLocale(languages, locales, i18n.defaultLocale)
      return locale || i18n.defaultLocale
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error matching locale:', error)
      return i18n.defaultLocale
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error in getLocale function:', error)
    return i18n.defaultLocale
  }
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Skip middleware for public files
    if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
      return NextResponse.next()
    }

    const pathnameIsMissingLocale = i18n.locales.every(
      locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request)

      // Ensure locale is valid
      if (!locale || !i18n.locales.includes(locale)) {
        const safeLocale = i18n.defaultLocale
        return NextResponse.redirect(
          new URL(`/${safeLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        )
      }

      if (locale === i18n.defaultLocale) {
        return NextResponse.rewrite(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
      }
      return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error in middleware:', error)
    // Fallback to default locale on any error
    const { pathname } = request.nextUrl
    return NextResponse.redirect(
      new URL(`/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
