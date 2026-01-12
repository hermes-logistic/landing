import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import KycDriversForm from '../../app/components/Kyc/KycDriversForm.vue'

describe('KycDriversForm', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(KycDriversForm)
  })

  describe('Form rendering', () => {
    it('renders the form title', () => {
      expect(wrapper.text()).toContain('kyc.drivers.title')
    })

    it('renders the form subtitle', () => {
      expect(wrapper.text()).toContain('kyc.drivers.subtitle')
    })

    it('renders the form description', () => {
      expect(wrapper.text()).toContain('kyc.drivers.description')
    })

    it('renders the number input', () => {
      const input = wrapper.find('#numberOfDrivers')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('number')
    })

    it('renders the decrease button', () => {
      const decreaseButton = wrapper.findAll('button').at(0)
      expect(decreaseButton?.exists()).toBe(true)
      expect(decreaseButton?.text()).toBe('-')
    })

    it('renders the increase button', () => {
      const increaseButton = wrapper.findAll('button').at(1)
      expect(increaseButton?.exists()).toBe(true)
      expect(increaseButton?.text()).toBe('+')
    })

    it('renders the save button', () => {
      const saveButton = wrapper.findAll('button').at(2)
      expect(saveButton?.exists()).toBe(true)
      expect(saveButton?.text()).toBe('kyc.drivers.save')
    })

    it('initializes with 1 driver', () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      expect((input.element as HTMLInputElement).value).toBe('1')
    })
  })

  describe('Number control interactions', () => {
    it('increases number of drivers when increase button is clicked', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await increaseButton?.trigger('click')

      expect((input.element as HTMLInputElement).value).toBe('2')
    })

    it('decreases number of drivers when decrease button is clicked', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const decreaseButton = wrapper.findAll('button').at(0)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await increaseButton?.trigger('click')
      await increaseButton?.trigger('click')
      await decreaseButton?.trigger('click')

      expect((input.element as HTMLInputElement).value).toBe('2')
    })

    it('does not decrease below 1', async () => {
      const decreaseButton = wrapper.findAll('button').at(0)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await decreaseButton?.trigger('click')
      await decreaseButton?.trigger('click')

      expect((input.element as HTMLInputElement).value).toBe('1')
    })

    it('disables decrease button when at minimum (1)', () => {
      const decreaseButton = wrapper.findAll('button').at(0)
      expect(decreaseButton?.attributes('disabled')).toBeDefined()
    })

    it('enables decrease button when above minimum', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const decreaseButton = wrapper.findAll('button').at(0)

      await increaseButton?.trigger('click')

      expect(decreaseButton?.attributes('disabled')).toBeUndefined()
    })

    it('does not increase above 100', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      // Set to 99
      await input.setValue(99)

      await increaseButton?.trigger('click')
      expect((input.element as HTMLInputElement).value).toBe('100')

      await increaseButton?.trigger('click')
      expect((input.element as HTMLInputElement).value).toBe('100')
    })

    it('disables increase button when at maximum (100)', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(100)

      expect(increaseButton?.attributes('disabled')).toBeDefined()
    })

    it('allows direct input of valid number', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(25)

      expect((input.element as HTMLInputElement).value).toBe('25')
    })

    it('clamps input below minimum to 1', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(-5)
      await input.trigger('input')

      expect((input.element as HTMLInputElement).value).toBe('1')
    })

    it('clamps input above maximum to 100', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(150)
      await input.trigger('input')

      expect((input.element as HTMLInputElement).value).toBe('100')
    })

    it('handles empty input on blur by resetting to 1', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue('')
      await input.trigger('blur')

      expect((input.element as HTMLInputElement).value).toBe('1')
    })
  })

  describe('Form submission', () => {
    it('emits submit event with correct data when save button is clicked', async () => {
      const saveButton = wrapper.findAll('button').at(2)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(5)
      await saveButton?.trigger('click')

      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')![0]).toEqual([{ numberOfDrivers: 5 }])
    })

    it('does not show error for valid input', async () => {
      const saveButton = wrapper.findAll('button').at(2)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(10)
      await saveButton?.trigger('click')

      expect(wrapper.find('p.text-red-500').exists()).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('handles exactly 1 driver (minimum edge case)', async () => {
      const saveButton = wrapper.findAll('button').at(2)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      expect((input.element as HTMLInputElement).value).toBe('1')
      await saveButton?.trigger('click')

      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')![0]).toEqual([{ numberOfDrivers: 1 }])
    })

    it('handles exactly 100 drivers (maximum edge case)', async () => {
      const saveButton = wrapper.findAll('button').at(2)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await input.setValue(100)
      await saveButton?.trigger('click')

      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')![0]).toEqual([{ numberOfDrivers: 100 }])
    })

    it('handles rapid button clicks', async () => {
      const increaseButton = wrapper.findAll('button').at(1)
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')

      await increaseButton?.trigger('click')
      await increaseButton?.trigger('click')
      await increaseButton?.trigger('click')
      await increaseButton?.trigger('click')

      expect((input.element as HTMLInputElement).value).toBe('5')
    })
  })

  describe('Saved/Edit state management', () => {
    it('starts in edit mode (not saved)', () => {
      const input = wrapper.find('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      expect(input.exists()).toBe(true)
      expect(saveButton?.text()).toBe('kyc.drivers.save')
    })

    it('transitions to saved mode after clicking save', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      await input.setValue(5)
      await saveButton?.trigger('click')

      // Should show saved value
      expect(wrapper.text()).toContain('5')
      // Should show Edit button
      expect(wrapper.text()).toContain('kyc.drivers.edit')
      // Input should not be visible
      expect(wrapper.find('#numberOfDrivers').exists()).toBe(false)
    })

    it('shows edit button in saved mode', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      await input.setValue(10)
      await saveButton?.trigger('click')

      const editButton = wrapper.findAll('button').find(btn => btn.text() === 'kyc.drivers.edit')
      expect(editButton?.exists()).toBe(true)
    })

    it('returns to edit mode when edit button is clicked', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      // Save first
      await input.setValue(7)
      await saveButton?.trigger('click')

      // Click edit
      const editButton = wrapper.findAll('button').find(btn => btn.text() === 'kyc.drivers.edit')
      await editButton?.trigger('click')

      // Should show input again
      expect(wrapper.find('#numberOfDrivers').exists()).toBe(true)
      // Should show Save button again
      const newSaveButton = wrapper.findAll('button').find(btn => btn.text() === 'kyc.drivers.save')
      expect(newSaveButton?.exists()).toBe(true)
    })

    it('hides increase/decrease buttons in saved mode', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      await input.setValue(5)
      await saveButton?.trigger('click')

      // Buttons with - and + should not exist
      const decreaseButton = wrapper.findAll('button').find(btn => btn.text() === '-')
      const increaseButton = wrapper.findAll('button').find(btn => btn.text() === '+')

      expect(decreaseButton).toBeUndefined()
      expect(increaseButton).toBeUndefined()
    })

    it('preserves the saved value when returning to edit mode', async () => {
      const input = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      const saveButton = wrapper.findAll('button').at(2)

      // Save with value 15
      await input.setValue(15)
      await saveButton?.trigger('click')

      // Click edit
      const editButton = wrapper.findAll('button').find(btn => btn.text() === 'kyc.drivers.edit')
      await editButton?.trigger('click')

      // Input should still have value 15
      const inputAfterEdit = wrapper.find<HTMLInputElement>('#numberOfDrivers')
      expect((inputAfterEdit.element as HTMLInputElement).value).toBe('15')
    })
  })
})
