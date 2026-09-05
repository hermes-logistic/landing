import { onScopeDispose, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps keyboard focus inside `container` while `active` is true: focuses the
 * first focusable element, cycles Tab / Shift+Tab within the container, routes
 * Escape to `onEscape`, and restores focus to the previously focused element
 * on deactivation.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape?: () => void,
) {
  let previouslyFocused: HTMLElement | null = null
  let listening = false

  function focusable(): HTMLElement[] {
    const el = container.value
    if (!el) return []
    return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onEscape?.()
      return
    }
    if (event.key !== 'Tab') return

    const items = focusable()
    if (items.length === 0) return

    const first = items[0] as HTMLElement
    const last = items[items.length - 1] as HTMLElement
    const current = document.activeElement as HTMLElement | null
    const inside = !!current && !!container.value?.contains(current)

    if (event.shiftKey) {
      if (!inside || current === first) {
        event.preventDefault()
        last.focus()
      }
    }
    else if (!inside || current === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function activate() {
    if (typeof document === 'undefined' || listening) return
    previouslyFocused = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    listening = true
    focusable()[0]?.focus()
  }

  function deactivate() {
    if (typeof document === 'undefined' || !listening) return
    document.removeEventListener('keydown', onKeydown)
    listening = false
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  watch(active, (value) => {
    if (value) activate()
    else deactivate()
  }, { immediate: true, flush: 'post' })

  onScopeDispose(deactivate)
}
