'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * Coalesces rapid callbacks (e.g. scroll/resize) to at most one invocation
 * per animation frame. Subsequent calls within the same frame cancel the
 * pending frame and schedule a new one — preventing queue buildup on
 * high-frequency events like trackpad scroll.
 *
 * Returns a stable `schedule` callback and handles cleanup automatically
 * when the consumer unmounts.
 */
export function useRafThrottle(callback: () => void): () => void {
  const callbackRef = useRef(callback)
  const rafIdRef = useRef<number>(0)

  // Keep ref in sync without re-creating the scheduler.
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const schedule = useCallback(() => {
    if (typeof window.requestAnimationFrame !== 'function') {
      callbackRef.current()
      return
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = 0
      callbackRef.current()
    })
  }, [])

  // Cleanup any pending frame on unmount.
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return schedule
}
