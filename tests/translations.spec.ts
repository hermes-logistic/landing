import { describe, it, expect } from 'vitest'
import en from '../locales/en.json'
import es from '../locales/es.json'
import { NAV_LINKS } from '../app/components/Navbar/links'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

interface Leaf {
  kind: 'scalar' | 'array'
  value?: Json
  length?: number
}

/**
 * Flattens a locale object to dot-separated paths, indexing arrays as `path[i]`.
 * Arrays are also recorded in their own right so their length can be compared.
 */
function flatten(value: Json, prefix = '', out: Record<string, Leaf> = {}): Record<string, Leaf> {
  if (Array.isArray(value)) {
    out[prefix] = { kind: 'array', length: value.length }
    value.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out))
  }
  else if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out)
    }
  }
  else {
    out[prefix] = { kind: 'scalar', value }
  }
  return out
}

function resolve(source: Json, path: string): Json | undefined {
  return path.split('.').reduce<Json | undefined>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && !Array.isArray(acc)) return acc[key]
    return undefined
  }, source)
}

const flatEn = flatten(en as Json)
const flatEs = flatten(es as Json)
const pathsEn = Object.keys(flatEn)
const pathsEs = Object.keys(flatEs)
const sharedPaths = pathsEn.filter(p => p in flatEs)

const scalarEntries = (flat: Record<string, Leaf>) =>
  Object.entries(flat).filter(([, leaf]) => leaf.kind === 'scalar')

/**
 * Strings that are legitimately identical in both locales: brand names, plan
 * names kept as-is, currency figures and unit-range notation.
 */
const IDENTICAL_BY_DESIGN = new Set([
  'whoWeAre.title', // "Hermes Logistics" — brand name
  'pricing.plans[2].name', // "Premium" — plan name kept in both locales
  'pricing.plans[0].price', // "$40.00" — currency figure
  'pricing.plans[1].price', // "$35.00"
  'pricing.plans[2].price', // "$30.00"
  'pricing.plans[0].units', // "U: 1-5" — unit-range notation
  'pricing.plans[1].units', // "U: 6-24"
  'pricing.plans[2].units', // "U: 25-60"
  'pricing.plans[3].units', // "U: +60"
])

/**
 * NOT legitimate — a real untranslated string, quarantined so the suite stays
 * green while it is on brand-guardian's plate. `pricing.plans[3].price` is the
 * English word "Custom" in es.json, while the same plan's `name` *is* translated
 * ("Enterprise" -> "A medida"). Remove this entry once es.json is fixed; do not
 * add anything else here.
 */
const KNOWN_UNTRANSLATED = new Set([
  'pricing.plans[3].price',
])

describe('locale files', () => {
  it('exposes exactly the same key paths in both locales', () => {
    const missingInEs = pathsEn.filter(p => !(p in flatEs)).sort()
    const missingInEn = pathsEs.filter(p => !(p in flatEn)).sort()

    // Asserting the object (not two separate arrays) so a failure names which
    // side diverged and on which paths.
    expect({ missingInEs, missingInEn }).toEqual({ missingInEs: [], missingInEn: [] })
  })

  it('is not empty and covers a comparable number of keys', () => {
    expect(pathsEn.length).toBeGreaterThan(0)
    expect(pathsEn.length).toBe(pathsEs.length)
  })

  it('uses the same type at every shared path', () => {
    const mismatches = sharedPaths
      .filter(p => flatEn[p]!.kind !== flatEs[p]!.kind)
      .map(p => ({ path: p, en: flatEn[p]!.kind, es: flatEs[p]!.kind }))

    expect(mismatches).toEqual([])
  })

  it('keeps every array the same length in both locales', () => {
    const mismatches = sharedPaths
      .filter(p => flatEn[p]!.kind === 'array' && flatEn[p]!.length !== flatEs[p]!.length)
      .map(p => ({ path: p, en: flatEn[p]!.length, es: flatEs[p]!.length }))

    expect(mismatches).toEqual([])
  })

  it('holds only non-empty strings as leaf values', () => {
    const bad: Array<{ locale: string, path: string, value: Json | undefined }> = []

    for (const [locale, flat] of [['en', flatEn], ['es', flatEs]] as const) {
      for (const [path, leaf] of scalarEntries(flat)) {
        if (typeof leaf.value !== 'string' || leaf.value.trim() === '') {
          bad.push({ locale, path, value: leaf.value })
        }
      }
    }

    expect(bad).toEqual([])
  })

  it('has no Spanish string left identical to its English source', () => {
    const untranslated = sharedPaths
      .filter(p => flatEn[p]!.kind === 'scalar')
      .filter(p => flatEn[p]!.value === flatEs[p]!.value)
      .filter(p => !IDENTICAL_BY_DESIGN.has(p) && !KNOWN_UNTRANSLATED.has(p))
      .map(p => ({ path: p, value: flatEn[p]!.value }))

    expect(untranslated).toEqual([])
  })

  it('keeps the identical-by-design lists honest', () => {
    // An entry that is no longer identical is stale and must be removed, so the
    // whitelist can never quietly mask a future regression.
    const stale = [...IDENTICAL_BY_DESIGN, ...KNOWN_UNTRANSLATED]
      .filter(p => !(p in flatEn) || flatEn[p]!.value !== flatEs[p]!.value)

    expect(stale).toEqual([])
  })
})

describe('navbar i18n contract', () => {
  const REQUIRED_NAV_KEYS = [
    'nav.who',
    'nav.benefits',
    'nav.features',
    'nav.pricing',
    'nav.cta',
    'nav.aria.main',
    'nav.aria.home',
    'nav.aria.toggleMenu',
    'nav.aria.languageSwitch',
    'nav.aria.switchToEnglish',
    'nav.aria.switchToSpanish',
  ]

  // Renamed to nav.cta / removed outright — the navbar must never reference them again.
  const REMOVED_NAV_KEYS = ['nav.contact', 'nav.products']

  it.each(REQUIRED_NAV_KEYS)('defines %s as a non-empty string in both locales', (path) => {
    for (const [locale, source] of [['en', en], ['es', es]] as const) {
      const value = resolve(source as Json, path)
      expect(typeof value, `${path} missing in ${locale}.json`).toBe('string')
      expect((value as string).trim(), `${path} empty in ${locale}.json`).not.toBe('')
    }
  })

  it.each(REMOVED_NAV_KEYS)('no longer defines %s in either locale', (path) => {
    expect(resolve(en as Json, path)).toBeUndefined()
    expect(resolve(es as Json, path)).toBeUndefined()
  })

  it('resolves every labelKey declared in NAV_LINKS', () => {
    expect(NAV_LINKS.length).toBeGreaterThan(0)

    const unresolved: Array<{ locale: string, id: string, labelKey: string }> = []
    for (const [locale, source] of [['en', en], ['es', es]] as const) {
      for (const link of NAV_LINKS) {
        const value = resolve(source as Json, link.labelKey)
        if (typeof value !== 'string' || value.trim() === '') {
          unresolved.push({ locale, id: link.id, labelKey: link.labelKey })
        }
      }
    }

    expect(unresolved).toEqual([])
  })
})
