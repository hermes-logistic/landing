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

    const desktopHrefs = wrapper.findComponent(NavLinks).findAll('a').map(a => a.attributes('href'))
    const drawerHrefs = drawer(wrapper).findAll('a').map(a => a.attributes('href'))

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
    expect(wrapper.classes()).toContain('nav-transparent')

    window.scrollY = 100
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('nav-solid')
    expect(wrapper.classes()).not.toContain('nav-transparent')
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

  it('moves aria-pressed from EN to ES when the locale is switched', async () => {
    const wrapper = mountNavbar()
    const pressed = () =>
      wrapper.findAll('button[aria-pressed]')
        .filter(b => b.attributes('aria-pressed') === 'true')
        .map(b => b.attributes('lang'))

    expect(pressed()).toContain('en')
    expect(pressed()).not.toContain('es')

    const es = wrapper.findAll('button[lang="es"]')[0]!
    await es.trigger('click')

    expect(pressed()).toContain('es')
    expect(pressed()).not.toContain('en')
  })

  it('takes every aria-label from the nav.aria.* keys', async () => {
    const wrapper = mountNavbar()
    expect(wrapper.attributes('aria-label')).toBe('nav.aria.main')
    expect(wrapper.get('a[href="/"]').attributes('aria-label')).toBe('nav.aria.home')
    expect(toggle(wrapper).attributes('aria-label')).toBe('nav.aria.toggleMenu')
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('nav.aria.languageSwitch')
    expect(wrapper.get('button[lang="en"]').attributes('aria-label')).toBe('nav.aria.switchToEnglish')
    expect(wrapper.get('button[lang="es"]').attributes('aria-label')).toBe('nav.aria.switchToSpanish')
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
})
