import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactModal from '../../app/components/ContactModal.vue'
import { globalStubs } from '../../vitest.setup'

// Every mounted modal holds a body-scroll-lock ticket and a document-level
// keydown listener, so each one has to be unmounted or it answers the next
// test's keys and leaves `overflow: hidden` behind.
const mounted: Array<{ unmount: () => void }> = []

function mountModal(isOpen = false) {
  const wrapper = mount(ContactModal, {
    props: { isOpen },
    // The dialog is teleported to <body>; stubbing the teleport keeps it inside
    // the wrapper, and attachTo puts the wrapper in the document so focus works.
    attachTo: document.body,
    global: { stubs: { ...globalStubs, teleport: true } },
  })
  mounted.push(wrapper)
  return wrapper
}

const dialog = (wrapper: ReturnType<typeof mountModal>) => wrapper.find('[role="dialog"]')
const closeButton = (wrapper: ReturnType<typeof mountModal>) =>
  wrapper.get('[role="dialog"] button[aria-label]')
const submitButton = (wrapper: ReturnType<typeof mountModal>) =>
  wrapper.get('button[type="submit"]')

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
}

async function fillForm(wrapper: ReturnType<typeof mountModal>) {
  await wrapper.get('#name').setValue('Ada Lovelace')
  await wrapper.get('#email').setValue('ada@hermes.test')
  await wrapper.get('#company').setValue('Analytical Engines')
  await wrapper.get('#message').setValue('Twelve trucks, two countries.')
}

describe('ContactModal', () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
    // Stands in for the navbar CTA: focus has to come back here on close.
    opener = document.createElement('button')
    opener.id = 'opener'
    document.body.appendChild(opener)
    opener.focus()
  })

  afterEach(() => {
    while (mounted.length) mounted.pop()!.unmount()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('open and close', () => {
    it('renders no dialog and no backdrop while isOpen is false', () => {
      const wrapper = mountModal(false)
      expect(dialog(wrapper).exists()).toBe(false)
      expect(wrapper.find('[role="presentation"]').exists()).toBe(false)
    })

    it('renders the dialog labelled by its own title when isOpen turns true', async () => {
      const wrapper = mountModal(false)
      await wrapper.setProps({ isOpen: true })

      const el = dialog(wrapper)
      expect(el.exists()).toBe(true)
      expect(el.attributes('aria-modal')).toBe('true')
      const labelledBy = el.attributes('aria-labelledby')!
      expect(wrapper.get(`#${labelledBy}`).text()).toBe('contact.modal.title')
    })

    it('tears the dialog back down when isOpen returns to false', async () => {
      const wrapper = mountModal(true)
      expect(dialog(wrapper).exists()).toBe(true)

      await wrapper.setProps({ isOpen: false })
      expect(dialog(wrapper).exists()).toBe(false)
    })

    it('emits close from the close button', async () => {
      const wrapper = mountModal(true)
      await closeButton(wrapper).trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('emits close when the backdrop itself is clicked', async () => {
      const wrapper = mountModal(true)
      await wrapper.get('[role="presentation"]').trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('emits close on Escape while open, and ignores Escape once closed', async () => {
      const wrapper = mountModal(false)
      await wrapper.setProps({ isOpen: true })

      pressEscape()
      expect(wrapper.emitted('close')).toHaveLength(1)

      await wrapper.setProps({ isOpen: false })
      pressEscape()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('translates the close button label instead of hardcoding English', async () => {
      const wrapper = mountModal(true)
      // vitest.setup's t() returns the key, so this asserts the key is used.
      expect(closeButton(wrapper).attributes('aria-label')).toBe('contact.modal.aria.close')
    })
  })

  describe('focus and scroll', () => {
    it('locks body scroll while open and restores it on close', async () => {
      const wrapper = mountModal(false)
      expect(document.body.style.overflow).toBe('')

      await wrapper.setProps({ isOpen: true })
      expect(document.body.style.overflow).toBe('hidden')

      await wrapper.setProps({ isOpen: false })
      expect(document.body.style.overflow).toBe('')
    })

    it('moves focus into the dialog on open and back to the opener on close', async () => {
      const wrapper = mountModal(false)
      expect(document.activeElement).toBe(opener)

      await wrapper.setProps({ isOpen: true })
      expect(dialog(wrapper).element.contains(document.activeElement)).toBe(true)
      expect(document.activeElement).toBe(closeButton(wrapper).element)

      await wrapper.setProps({ isOpen: false })
      expect(document.activeElement).toBe(opener)
    })
  })

  describe('form fields', () => {
    it.each([
      ['name', 'INPUT', 'text', true],
      ['email', 'INPUT', 'email', true],
      ['company', 'INPUT', 'text', false],
      ['message', 'TEXTAREA', undefined, true],
    ])('labels %s and points the label at that control', (id, tag, type, required) => {
      const wrapper = mountModal(true)

      const label = wrapper.get(`label[for="${id}"]`)
      expect(label.text()).toBe(`contact.modal.${id}`)

      const control = wrapper.get(`#${id}`)
      expect(control.element.tagName).toBe(tag)
      expect(control.attributes('type')).toBe(type)
      expect(control.attributes('placeholder')).toBe(`contact.modal.${id}Placeholder`)
      expect('required' in control.attributes()).toBe(required)
    })

    it('starts empty and clears what was typed once the modal is closed', async () => {
      const wrapper = mountModal(true)
      expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('')

      await fillForm(wrapper)
      expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('Ada Lovelace')

      await closeButton(wrapper).trigger('click')
      await wrapper.setProps({ isOpen: false })
      await wrapper.setProps({ isOpen: true })

      expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#email').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#company').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('')
    })
  })

  it('styles the submit button as button-primary, not as the marketing CTA', async () => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const wrapper = mountModal(true)
    const classes = submitButton(wrapper).classes()

    // DESIGN.md components.button-primary: blue-sky #61F0FF fill, on-accent
    // #01051D label (14.81:1). The sunset-orange exception is scoped to the
    // landing navbar CTA and names the contact modal as out of scope, and
    // white on #FF734D is 2.69:1 on a 14px label.
    expect(classes).toEqual(expect.arrayContaining(['bg-[#61F0FF]', 'text-[#01051D]']))
    // Hover is a real ramp step, blue-sky-100. #FF6B3D and #50D8E6 are
    // invented steps between ramp entries.
    expect(classes).toContain('hover:bg-[#ACF7FF]')
    expect(classes).not.toContain('text-white')
    // transition-all would animate outline-color and make the focus ring fade
    // in from the UA default instead of appearing as #61F0FF.
    expect(classes).toContain('transition-colors')
    expect(classes).not.toContain('transition-all')

    // The spinner rides the same dark label color.
    await wrapper.get('form').trigger('submit')
    expect(submitButton(wrapper).get('svg').classes()).toContain('text-[#01051D]')
  })

  describe('submission', () => {
    it('shows the pending state, then the success message, then closes itself', async () => {
      vi.useFakeTimers()
      const log = vi.spyOn(console, 'log').mockImplementation(() => {})

      const wrapper = mountModal(true)
      await fillForm(wrapper)

      expect(submitButton(wrapper).text()).toBe('contact.modal.send')
      expect(submitButton(wrapper).attributes('disabled')).toBeUndefined()

      await wrapper.get('form').trigger('submit')
      expect(submitButton(wrapper).text()).toBe('contact.modal.sending')
      expect(submitButton(wrapper).attributes('disabled')).toBeDefined()
      expect(wrapper.text()).not.toContain('contact.modal.successMessage')

      // The mocked request settles after 1.5s.
      await vi.advanceTimersByTimeAsync(1500)
      expect(wrapper.text()).toContain('contact.modal.successMessage')
      expect(wrapper.text()).not.toContain('contact.modal.errorMessage')
      expect(submitButton(wrapper).text()).toBe('contact.modal.send')
      expect(submitButton(wrapper).attributes('disabled')).toBeUndefined()
      expect(log).toHaveBeenCalledWith('Form submitted:', {
        name: 'Ada Lovelace',
        email: 'ada@hermes.test',
        company: 'Analytical Engines',
        message: 'Twelve trucks, two countries.',
      })
      expect(wrapper.emitted('close')).toBeUndefined()

      // ...and the modal dismisses itself 2s after the success message.
      await vi.advanceTimersByTimeAsync(2000)
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(wrapper.text()).not.toContain('contact.modal.successMessage')
      expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('')
    })

    it('shows the error message and re-enables the button when sending throws', async () => {
      vi.useFakeTimers()
      // The only seam in the mocked send path: make it throw to drive the catch.
      vi.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('send failed')
      })
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mountModal(true)
      await fillForm(wrapper)
      await wrapper.get('form').trigger('submit')
      await vi.advanceTimersByTimeAsync(1500)

      expect(wrapper.text()).toContain('contact.modal.errorMessage')
      expect(wrapper.text()).not.toContain('contact.modal.successMessage')
      expect(submitButton(wrapper).attributes('disabled')).toBeUndefined()
      expect(error).toHaveBeenCalled()

      // No self-dismiss on failure: what was typed stays there to retry.
      await vi.advanceTimersByTimeAsync(2000)
      expect(wrapper.emitted('close')).toBeUndefined()
      expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('Ada Lovelace')
    })
  })
})
