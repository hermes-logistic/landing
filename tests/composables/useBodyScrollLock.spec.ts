import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { defineComponent, ref, h, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useBodyScrollLock } from '../../app/composables/useBodyScrollLock'

// The lock is reference-counted at module scope, so every consumer a test
// mounts has to be torn down or its count leaks into the next test.
const mounted: Array<{ unmount: () => void }> = []

// The composable needs an instance/effect scope, so drive it through a host
// component rather than calling it bare.
function mountConsumer(active: Ref<boolean>) {
  const wrapper = mount(defineComponent({
    setup() {
      useBodyScrollLock(active)
      return () => h('div')
    },
  }))
  mounted.push(wrapper)
  return wrapper
}

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    while (mounted.length) mounted.pop()!.unmount()
    document.body.style.overflow = ''
  })

  it('does nothing while inactive', () => {
    const active = ref(false)
    mountConsumer(active)
    expect(document.body.style.overflow).toBe('')
  })

  it('locks the body when active and unlocks when released', async () => {
    const active = ref(false)
    const wrapper = mountConsumer(active)

    active.value = true
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    active.value = false
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('locks immediately when it starts out active', () => {
    mountConsumer(ref(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores the previous overflow value rather than assuming empty', async () => {
    document.body.style.overflow = 'scroll'
    const active = ref(true)
    const wrapper = mountConsumer(active)
    expect(document.body.style.overflow).toBe('hidden')

    active.value = false
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('reference-counts so two consumers do not clobber each other', async () => {
    const first = ref(true)
    const second = ref(true)
    const a = mountConsumer(first)
    const b = mountConsumer(second)
    expect(document.body.style.overflow).toBe('hidden')

    // The first consumer releasing must not unlock while the second holds it.
    first.value = false
    await a.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    second.value = false
    await b.vm.$nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('releases the lock when the consumer unmounts', () => {
    const wrapper = mountConsumer(ref(true))
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('is idempotent when unmounting an already-released consumer', async () => {
    const active = ref(true)
    const wrapper = mountConsumer(active)

    active.value = false
    await wrapper.vm.$nextTick()
    wrapper.unmount()

    // A second, independent consumer must still be able to take the lock.
    const other = mountConsumer(ref(true))
    expect(document.body.style.overflow).toBe('hidden')
    other.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
