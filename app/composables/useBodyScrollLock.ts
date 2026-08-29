import { onScopeDispose, watch, type Ref } from 'vue'

// Module-level reference counting so two simultaneous consumers (the navbar
// drawer and the contact modal) can't clobber each other's restore value.
let lockCount = 0
let previousOverflow = ''

function acquire() {
  if (typeof document === 'undefined') return
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

function release() {
  if (typeof document === 'undefined') return
  // Balanced by the per-consumer `held` flag below, so lockCount is >= 1 here.
  lockCount -= 1
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow
    previousOverflow = ''
  }
}

/**
 * Locks `document.body` scrolling while `active` is true and restores the
 * previous `overflow` value once every consumer has released the lock.
 */
export function useBodyScrollLock(active: Ref<boolean>) {
  let held = false

  function sync(value: boolean) {
    if (value && !held) {
      acquire()
      held = true
    }
    else if (!value && held) {
      release()
      held = false
    }
  }

  watch(active, sync, { immediate: true })

  onScopeDispose(() => sync(false))
}
