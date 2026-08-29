import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, ref, h, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFocusTrap } from '../../app/composables/useFocusTrap'

// Each active trap adds a document-level keydown listener, so every host a
// test mounts has to be torn down or a stale trap answers the next test's keys.
const mounted: Array<{ unmount: () => void }> = []

// The composable needs an instance/effect scope, so drive it through a host
// component rather than calling it bare.
function mountTrap(active: Ref<boolean>, onEscape?: () => void) {
  const container = ref<HTMLElement | null>(null)

  const wrapper = mount(defineComponent({
    setup() {
      useFocusTrap(container, active, onEscape)
      return () => active.value
        ? h('div', { ref: el => { container.value = el as HTMLElement | null } }, [
            h('button', { id: 'first' }, 'first'),
            h('button', { id: 'middle' }, 'middle'),
            h('button', { id: 'disabled', disabled: true }, 'skipped'),
            h('button', { id: 'last' }, 'last'),
          ])
        : h('div')
    },
  }), { attachTo: document.body })

  mounted.push(wrapper)
  return { wrapper, container }
}

function press(key: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key, shiftKey, cancelable: true })
  document.dispatchEvent(event)
  return event
}

const activeId = () => document.activeElement?.id

describe('useFocusTrap', () => {
  let outside: HTMLButtonElement

  beforeEach(() => {
    document.body.innerHTML = ''
    outside = document.createElement('button')
    outside.id = 'outside'
    document.body.appendChild(outside)
  })

  afterEach(() => {
    while (mounted.length) mounted.pop()!.unmount()
  })

  it('focuses the first focusable element on activation', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)

    active.value = true
    await wrapper.vm.$nextTick()

    expect(activeId()).toBe('first')
  })

  it('returns focus to the previously focused element on deactivation', async () => {
    outside.focus()
    expect(activeId()).toBe('outside')

    const active = ref(false)
    const { wrapper } = mountTrap(active)

    active.value = true
    await wrapper.vm.$nextTick()
    expect(activeId()).toBe('first')

    active.value = false
    await wrapper.vm.$nextTick()
    expect(activeId()).toBe('outside')
  })

  it('cycles Tab from the last element back to the first', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    document.getElementById('last')!.focus()
    const event = press('Tab')

    expect(event.defaultPrevented).toBe(true)
    expect(activeId()).toBe('first')
  })

  it('cycles Shift+Tab from the first element back to the last', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    document.getElementById('first')!.focus()
    const event = press('Tab', true)

    expect(event.defaultPrevented).toBe(true)
    expect(activeId()).toBe('last')
  })

  it('lets Tab fall through between interior elements', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    document.getElementById('first')!.focus()
    const event = press('Tab')

    // Not at an edge: the browser's own tab order handles it.
    expect(event.defaultPrevented).toBe(false)
    expect(activeId()).toBe('first')
  })

  it('pulls focus back inside when it has escaped the container', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    outside.focus()
    press('Tab')

    expect(activeId()).toBe('first')
  })

  it('skips disabled controls when resolving the last focusable element', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    document.getElementById('first')!.focus()
    press('Tab', true)

    // #disabled sits between #middle and #last but must never receive focus.
    expect(activeId()).toBe('last')
  })

  it('invokes the escape callback on Escape', async () => {
    const onEscape = vi.fn()
    const active = ref(false)
    const { wrapper } = mountTrap(active, onEscape)
    active.value = true
    await wrapper.vm.$nextTick()

    press('Escape')
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('tolerates Escape with no callback supplied', async () => {
    const active = ref(false)
    const { wrapper } = mountTrap(active)
    active.value = true
    await wrapper.vm.$nextTick()

    expect(() => press('Escape')).not.toThrow()
  })

  it('ignores unrelated keys', async () => {
    const onEscape = vi.fn()
    const active = ref(false)
    const { wrapper } = mountTrap(active, onEscape)
    active.value = true
    await wrapper.vm.$nextTick()

    document.getElementById('first')!.focus()
    const event = press('a')

    expect(onEscape).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
    expect(activeId()).toBe('first')
  })

  it('stops listening once deactivated', async () => {
    const onEscape = vi.fn()
    const active = ref(false)
    const { wrapper } = mountTrap(active, onEscape)

    active.value = true
    await wrapper.vm.$nextTick()
    active.value = false
    await wrapper.vm.$nextTick()

    press('Escape')
    expect(onEscape).not.toHaveBeenCalled()
  })

  it('stops listening when the consumer unmounts', async () => {
    const onEscape = vi.fn()
    const active = ref(true)
    const { wrapper } = mountTrap(active, onEscape)
    await wrapper.vm.$nextTick()

    wrapper.unmount()
    press('Escape')

    expect(onEscape).not.toHaveBeenCalled()
  })

  it('does nothing when the container holds no focusable elements', async () => {
    const container = ref<HTMLElement | null>(null)
    const active = ref(false)
    const wrapper = mount(defineComponent({
      setup() {
        useFocusTrap(container, active)
        return () => h('div', { ref: el => { container.value = el as HTMLElement | null } })
      },
    }), { attachTo: document.body })
    mounted.push(wrapper)

    outside.focus()
    active.value = true
    await wrapper.vm.$nextTick()

    const event = press('Tab')
    expect(event.defaultPrevented).toBe(false)
    expect(activeId()).toBe('outside')
  })
})
