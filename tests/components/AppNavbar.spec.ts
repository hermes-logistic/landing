import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '../../app/components/AppNavbar.vue'
import NavLinks from '../../app/components/Navbar/NavLinks.vue'
import NavMobileMenu from '../../app/components/Navbar/NavMobileMenu.vue'
import { NAV_LINKS } from '../../app/components/Navbar/links'
import { globalStubs } from '../../vitest.setup'

function mountNavbar(props: { isContactModalOpen?: boolean } = {}) {
  return mount(AppNavbar, {
    props: { isContactModalOpen: false, ...props },
    attachTo: document.body,
    global: { stubs: globalStubs },
  })
}

const toggle = (wrapper: ReturnType<typeof mountNavbar>) =>
  wrapper.get('button[aria-controls="mobile-menu"]')

const drawer = (wrapper: ReturnType<typeof mountNavbar>) =>
  wrapper.findComponent(NavMobileMenu)

// The bar's fill/hairline sit on a child of <nav>, not on the <nav> itself:
// an opaque <nav> wraps the drawer too and repaints #001751 behind the panel's
// 2xl bottom corners, cancelling the radius. See AppNavbar's template comment.
const surface = (wrapper: ReturnType<typeof mountNavbar>) =>
  wrapper.get('.nav-surface')

async function openDrawer(wrapper: ReturnType<typeof mountNavbar>) {
  await toggle(wrapper).trigger('click')
}

describe('AppNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollY = 0
    window.location.hash = ''
  })

  it('renders <nav> as its single root and holds no dialog of its own', () => {
    const wrapper = mountNavbar()
    expect(wrapper.element.tagName).toBe('NAV')
    // The ContactModal lives in app.vue now — a second instance here produced
    // duplicate DOM ids.
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders the four desktop links from the single source of truth', () => {
    const wrapper = mountNavbar()
    const links = wrapper.findComponent(NavLinks).findAll('a')
    expect(links.map(a => a.text())).toEqual([
      'nav.who',
      'nav.benefits',
      'nav.features',
      'nav.pricing',
    ])
  })

  it('renders exactly the same hrefs in the drawer as on the desktop row', async () => {
    const wrapper = mountNavbar()
    await openDrawer(wrapper)

    // Scoped to the section anchors: the drawer also carries the language
    // switch, whose links point at the locale routes rather than at a section.
    const desktopHrefs = wrapper.findComponent(NavLinks).findAll('a').map(a => a.attributes('href'))
    const drawerHrefs = drawer(wrapper).findAll('a[href^="#"]').map(a => a.attributes('href'))

    expect(desktopHrefs).toEqual(NAV_LINKS.map(l => l.href))
    expect(drawerHrefs).toEqual(desktopHrefs)
  })

  it('shows the CTA label on desktop and in the drawer', async () => {
    const wrapper = mountNavbar()
    expect(wrapper.text()).toContain('nav.cta')

    await openDrawer(wrapper)
    expect(drawer(wrapper).text()).toContain('nav.cta')
  })

  it('toggles the drawer and its aria-expanded false -> true -> false', async () => {
    const wrapper = mountNavbar()
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)

    await openDrawer(wrapper)
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('true')
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(true)

    await openDrawer(wrapper)
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
  })

  it('emits openContactModal from the desktop CTA', async () => {
    const wrapper = mountNavbar()
    const cta = wrapper.findAll('button').find(b => b.text() === 'nav.cta')
    await cta!.trigger('click')
    expect(wrapper.emitted('openContactModal')).toHaveLength(1)
  })

  it('emits openContactModal from the drawer CTA and closes the drawer', async () => {
    const wrapper = mountNavbar()
    await openDrawer(wrapper)

    const cta = drawer(wrapper).findAll('button').find(b => b.text() === 'nav.cta')
    await cta!.trigger('click')

    expect(wrapper.emitted('openContactModal')).toHaveLength(1)
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
  })

  it('closes the drawer when one of its links is clicked', async () => {
    const wrapper = mountNavbar()
    await openDrawer(wrapper)

    await drawer(wrapper).findAll('a')[0]!.trigger('click')
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
  })

  it('closes the drawer on Escape', async () => {
    const wrapper = mountNavbar()
    await openDrawer(wrapper)
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
  })

  it('resets the drawer when matchMedia reports the desktop breakpoint', async () => {
    const wrapper = mountNavbar()
    await openDrawer(wrapper)
    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(true)

    const mql = vi.mocked(window.matchMedia).mock.results.at(-1)!.value
    mql.dispatchEvent({ matches: true })
    await wrapper.vm.$nextTick()

    expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
  })

  it('marks the matching link as current when the hash changes', async () => {
    const wrapper = mountNavbar()
    const current = () =>
      wrapper.findComponent(NavLinks).findAll('a')
        .filter(a => a.attributes('aria-current') === 'page')
        .map(a => a.attributes('href'))

    expect(current()).toEqual([])

    window.location.hash = '#benefits'
    window.dispatchEvent(new Event('hashchange'))
    await wrapper.vm.$nextTick()

    expect(current()).toEqual(['#benefits'])
  })

  it('marks the clicked link as current', async () => {
    const wrapper = mountNavbar()
    const links = wrapper.findComponent(NavLinks).findAll('a')
    await links[3]!.trigger('click')

    expect(wrapper.findComponent(NavLinks).findAll('a')[3]!.attributes('aria-current')).toBe('page')
  })

  it('swaps nav-transparent for nav-solid past 20px of scroll', async () => {
    const wrapper = mountNavbar()
    expect(surface(wrapper).classes()).toContain('nav-transparent')

    window.scrollY = 100
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(surface(wrapper).classes()).toContain('nav-solid')
    expect(surface(wrapper).classes()).not.toContain('nav-transparent')
  })

  it('keeps the <nav> itself unpainted so the drawer corners can round', () => {
    const wrapper = mountNavbar()
    // The root carries positioning only. Any fill here would sit behind the
    // drawer panel and fill its 16px bottom corners with the same #001751,
    // which is what made them render as a straight edge.
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fixed', 'top-0', 'left-0', 'right-0', 'z-50']),
    )
    for (const c of ['nav-solid', 'nav-transparent', 'nav-surface', 'border-b']) {
      expect(wrapper.classes()).not.toContain(c)
    }
    // ...and the surface below it does carry the fill and the one hairline.
    expect(surface(wrapper).classes()).toContain('border-b')
  })

  it('registers the scroll listener as passive and removes it on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')

    const wrapper = mountNavbar()
    const added = add.mock.calls.find(([type]) => type === 'scroll')
    expect(added?.[2]).toEqual({ passive: true })

    wrapper.unmount()
    expect(remove.mock.calls.some(([type]) => type === 'scroll')).toBe(true)

    add.mockRestore()
    remove.mockRestore()
  })

  it('exposes the language switch as crawlable links, one per locale route', () => {
    const wrapper = mountNavbar()
    const group = wrapper.get('[role="group"]')
    const links = group.findAll('a')

    // Real hrefs, not click handlers: each locale is its own indexable URL, so
    // the switch has to be reachable by a crawler and without JavaScript.
    expect(links.map(a => a.attributes('href'))).toEqual(['/', '/es'])
    expect(links.map(a => a.attributes('hreflang'))).toEqual(['en', 'es-419'])
    expect(links.map(a => a.attributes('lang'))).toEqual(['en', 'es'])
  })

  it('marks only the active locale with aria-current', () => {
    const wrapper = mountNavbar()
    const current = wrapper.get('[role="group"]').findAll('a')
      .filter(a => a.attributes('aria-current') === 'page')
      .map(a => a.attributes('lang'))

    // The stubbed useI18n reports 'en'.
    expect(current).toEqual(['en'])
  })

  it('paints the active locale chip with the deep-blue-100 / on-accent pair', () => {
    const wrapper = mountNavbar()
    const chips = wrapper.get('[role="group"]').findAll('a')
    const active = chips.find(a => a.attributes('aria-current') === 'page')!
    const inactive = chips.find(a => a.attributes('aria-current') !== 'page')!

    // DESIGN.md navbar-lang-chip: activeBackgroundColor deep-blue-100 #6C8AD0,
    // activeTextColor on-accent #01051D. The fill has to clear WCAG 1.4.11's
    // 3:1 against the AT-REST translucent bar, which is why this is neither
    // surface-raised nor deep-blue-200 #4E6DB5 (2.97:1 at rest). Going up the
    // ramp flips the label dark: white on #6C8AD0 is only 3.40:1.
    expect(active.classes()).toEqual(
      expect.arrayContaining(['bg-[#6C8AD0]', 'text-[#01051D]']),
    )
    // Inactive: no fill, foreground-muted label rising to foreground on hover.
    expect(inactive.classes()).toEqual(
      expect.arrayContaining(['text-[#94A4C2]', 'hover:text-[#EBF2FF]']),
    )
    expect(inactive.classes().some(c => c.startsWith('bg-['))).toBe(false)
  })

  it('takes every aria-label from the nav.aria.* keys', async () => {
    const wrapper = mountNavbar()
    expect(wrapper.attributes('aria-label')).toBe('nav.aria.main')
    // By label, not by href: the logo and the EN chip both point at '/'.
    expect(wrapper.get('a[aria-label="nav.aria.home"]').attributes('href')).toBe('/')
    expect(toggle(wrapper).attributes('aria-label')).toBe('nav.aria.toggleMenu')
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('nav.aria.languageSwitch')
    expect(wrapper.get('a[lang="en"]').attributes('aria-label')).toBe('nav.aria.switchToEnglish')
    expect(wrapper.get('a[lang="es"]').attributes('aria-label')).toBe('nav.aria.switchToSpanish')
  })

  it('translates the logo alt text instead of hardcoding English', () => {
    const wrapper = mountNavbar()
    expect(wrapper.get('img[src="/images/hermes-logo.svg"]').attributes('alt')).toBe('nav.aria.logo')
  })

  it('sizes the logo by width at 390 so it lands on navbar.logoWidth[0]', () => {
    const wrapper = mountNavbar()
    // The token is a width (130). Driving it from a height re-derives the width
    // through the aspect ratio and overshoots, which is what h-[30px] did.
    const classes = wrapper.get('img[src="/images/hermes-logo.svg"]').classes()
    expect(classes).toContain('w-[130px]')
    expect(classes).toContain('h-auto')
    expect(classes).not.toContain('h-[30px]')
  })

  it('wires the CTA to the modal state through aria-haspopup/aria-expanded', () => {
    const closed = mountNavbar({ isContactModalOpen: false })
    const ctaClosed = closed.findAll('button').find(b => b.text() === 'nav.cta')!
    expect(ctaClosed.attributes('aria-haspopup')).toBe('dialog')
    expect(ctaClosed.attributes('aria-expanded')).toBe('false')

    const open = mountNavbar({ isContactModalOpen: true })
    const ctaOpen = open.findAll('button').find(b => b.text() === 'nav.cta')!
    expect(ctaOpen.attributes('aria-expanded')).toBe('true')
  })

  // --- DESIGN.md `navbar-drawer` -------------------------------------------
  // jsdom has no layout engine, so the drawer contract is asserted on the
  // classes that carry it. Real geometry is measured in the browser.

  describe('mobile drawer contract', () => {
    const panel = (wrapper: ReturnType<typeof mountNavbar>) =>
      drawer(wrapper).get('#mobile-menu > div:nth-child(2)')

    it('drops a scrim behind the drawer and closes on it', async () => {
      const wrapper = mountNavbar()
      await openDrawer(wrapper)

      const scrim = drawer(wrapper).get('#mobile-menu > div:first-child')
      expect(scrim.attributes('aria-hidden')).toBe('true')
      // scrim #01051DCC, starting at the BAR's bottom edge (`top-0` on the
      // drawer container) so it also dims the field showing through the
      // panel's 2xl corner cutouts. It never paints over the bar, and it is
      // painted behind the opaque panel by being the earlier z-auto sibling.
      expect(scrim.classes()).toEqual(
        expect.arrayContaining(['bg-[#01051DCC]', 'absolute', 'top-0', 'h-screen']),
      )
      // The panel is the later sibling, which is what puts it above the scrim.
      expect(drawer(wrapper).get('#mobile-menu > div:nth-child(2)').classes())
        .toContain('relative')

      await scrim.trigger('click')
      expect(drawer(wrapper).find('#mobile-menu').exists()).toBe(false)
    })

    it('gives the panel surface, one hairline, 2xl bottom-only corners and 20 padding', async () => {
      const wrapper = mountNavbar()
      await openDrawer(wrapper)

      const classes = panel(wrapper).classes()
      expect(classes).toEqual(expect.arrayContaining([
        'bg-[#001751]', // surface, opaque
        // borderWidth 1px. Only top/bottom: the panel is full-bleed, so a side
        // hairline is invisible and only pushes the first link off the 20px
        // left edge it is meant to share with the logo.
        'border-y',
        'border-[#B7CDF51F]', // border-hairline-cool
        'rounded-b-2xl', // rounded 2xl, roundedTop none
        'p-5', // padding {spacing.20}
        // groupGap {spacing.24} is the PANEL'S FLEX GAP, applied between each
        // adjacent pair of children. The canonical drawing (V6Joog -> gWTnC)
        // stacks nav, rule, action, rule, switcher, so two groups end up
        // 24 + 1 + 24 = 49px apart with the rule centred — see `pt-6` below.
        'gap-6',
      ]))
      // roundedTop is {rounded.none}: no all-round or top radius may appear.
      expect(classes.some(c => /^rounded-(2xl|t-|tl-|tr-)/.test(c))).toBe(false)
    })

    it('stacks the three groups with a hairline between them', async () => {
      const wrapper = mountNavbar()
      await openDrawer(wrapper)

      const groups = panel(wrapper).findAll(':scope > div')
      expect(groups).toHaveLength(3)
      // The first group opens the panel; the hairline belongs to the two that
      // follow it. No cards — the rule plus the size step is the separation.
      expect(groups[0]!.classes()).not.toContain('border-t')
      // pt-6, not pt-3: the container's gap-6 puts 24 above the rule and this
      // puts 24 below it, which is what the pen draws (49px content to
      // content). Halving both to 12 spends the token once and lands 48px
      // short of the canonical drawer.
      expect(groups[1]!.classes()).toEqual(expect.arrayContaining(['border-t', 'border-[#B7CDF51F]', 'pt-6']))
      expect(groups[2]!.classes()).toEqual(expect.arrayContaining(['border-t', 'border-[#B7CDF51F]', 'pt-6']))
      for (const g of [groups[1]!, groups[2]!]) expect(g.classes()).not.toContain('pt-3')
    })

    it('runs the descending nav-lg / nav-md / nav-sm scale down the three groups', async () => {
      const wrapper = mountNavbar()
      await openDrawer(wrapper)

      const links = drawer(wrapper).findAll('a[href^="#"]')
      expect(links).toHaveLength(NAV_LINKS.length)
      for (const link of links) {
        // nav-lg — 16/500. Weight never encodes state, so it is 500 either way.
        expect(link.classes()).toEqual(expect.arrayContaining(['text-base', 'font-medium']))
      }

      // nav-md — 14/500.
      const cta = drawer(wrapper).findAll('button').find(b => b.text() === 'nav.cta')!
      expect(cta.classes()).toEqual(expect.arrayContaining(['text-sm', 'font-medium']))

      // nav-sm — 12/500, on the locale chips the drawer inherits unchanged.
      const chip = drawer(wrapper).get('[role="group"] a')
      expect(chip.classes()).toEqual(expect.arrayContaining(['text-xs', 'font-medium']))
    })

    it('holds every row at the 44px touch floor with a 4px gap between links', async () => {
      const wrapper = mountNavbar()
      await openDrawer(wrapper)

      const linkGroup = panel(wrapper).findAll(':scope > div')[0]!
      expect(linkGroup.classes()).toContain('gap-1') // itemGap {spacing.4}

      for (const link of drawer(wrapper).findAll('a[href^="#"]')) {
        expect(link.classes()).toEqual(expect.arrayContaining(['min-h-[44px]', 'items-center']))
      }

      const cta = drawer(wrapper).findAll('button').find(b => b.text() === 'nav.cta')!
      expect(cta.classes()).toContain('min-h-[44px]')
      expect(drawer(wrapper).get('[role="group"]').element.parentElement!.className)
        .toContain('min-h-[44px]')
    })

    it('hands the bar hairline over to the drawer while it is open', async () => {
      const wrapper = mountNavbar()
      expect(surface(wrapper).classes()).not.toContain('nav-drawer-open')

      await openDrawer(wrapper)
      // Otherwise the bar's square border-bottom is drawn again across the
      // drawer's rounded bottom edge — two hairlines where the contract has one.
      expect(surface(wrapper).classes()).toContain('nav-drawer-open')
      // And the bar goes opaque: the drawer sits over content, so a translucent
      // bar above an opaque panel would split the surface in two.
      expect(surface(wrapper).classes()).toContain('nav-solid')
      expect(surface(wrapper).classes()).not.toContain('nav-transparent')

      await openDrawer(wrapper)
      expect(surface(wrapper).classes()).not.toContain('nav-drawer-open')
      expect(surface(wrapper).classes()).toContain('nav-transparent')
    })
  })
})
