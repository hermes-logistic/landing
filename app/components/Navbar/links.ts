export interface NavLink { readonly id: string, readonly href: string, readonly labelKey: string }

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'who-we-are', href: '#who-we-are', labelKey: 'nav.who' },
  { id: 'benefits', href: '#benefits', labelKey: 'nav.benefits' },
  { id: 'features', href: '#features', labelKey: 'nav.features' },
  { id: 'pricing', href: '#pricing', labelKey: 'nav.pricing' },
] as const
