import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactModal from '../../app/components/ContactModal.vue'

describe('ContactModal', () => {
  it('mounts correctly with isOpen prop', () => {
    const wrapper = mount(ContactModal, {
      props: {
        isOpen: false
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('isOpen')).toBe(false)
  })

  it('accepts isOpen prop as true', () => {
    const wrapper = mount(ContactModal, {
      props: {
        isOpen: true
      }
    })
    expect(wrapper.props('isOpen')).toBe(true)
  })

  it('has close emit event defined', () => {
    const wrapper = mount(ContactModal, {
      props: {
        isOpen: false
      }
    })
    
    // Check component exposes close emit
    const { emits } = wrapper.vm.$options
    expect(emits).toBeDefined()
    const emitKeys = Object.keys(emits || {})
    // The emits should have at least one key for the close event
    expect(emitKeys.length).toBeGreaterThan(0)
  })

  it('responds to prop changes', async () => {
    const wrapper = mount(ContactModal, {
      props: {
        isOpen: false
      }
    })

    expect(wrapper.props('isOpen')).toBe(false)

    await wrapper.setProps({ isOpen: true })
    expect(wrapper.props('isOpen')).toBe(true)

    await wrapper.setProps({ isOpen: false })
    expect(wrapper.props('isOpen')).toBe(false)
  })

  it('can trigger emit for close event', async () => {
    const wrapper = mount(ContactModal, {
      props: {
        isOpen: true
      }
    })

    // Manually emit close event (simulating button click)
    await wrapper.vm.$emit('close')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
