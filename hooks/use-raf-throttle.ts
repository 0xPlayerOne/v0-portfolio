import { useCallback, useEffect, useRef } from 'react'

/**
 * Coalesces rapid callbacks (e.g. scroll/resize) to at most one invocation
 * per animation frame. Calls while a frame is pending are ignored, which
 * prevents both queue buildup and callback starvation on high-frequency
 * events like trackpad scroll.
 *
 * Returns a stable `schedule` callback and handles cleanup automatically
 * when the consumer unmounts.
 */
export function useRafThrottle(callback: () => void): () => void {
  const callbackRef = useRef(callback)
  const rafIdRef = useRef<number | null>(null)

  // Keep ref in sync without re-creating the scheduler.
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const schedule = useCallback(() => {
    if (typeof window.requestAnimationFrame !== 'function') {
      callbackRef.current()
      return
    }
    if (rafIdRef.current !== null) return

    // Track whether the RAF callback fires before this line executes
    // (e.g. when requestAnimationFrame is stubbed to run synchronously in tests).
    // If it fires synchronously, the callback already cleared the ref and we
    // must not overwrite it with the new frame ID.
    let synced = false
    const frameId = window.requestAnimationFrame(() => {
      synced = true
      rafIdRef.current = null
      callbackRef.current()
    })
    if (!synced) {
      rafIdRef.current = frameId
    }
  }, [])

  // Cleanup any pending frame on unmount.
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return schedule
}
