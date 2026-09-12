import { describe, expect, it, mock, spyOn } from 'bun:test'

import { useRafThrottle } from './use-raf-throttle'
import { renderHook } from '@testing-library/react'

interface RafStub {
  tick: () => void
}

function stubRaf(): RafStub {
  const pending = new Map<number, FrameRequestCallback>()
  let nextId = 1

  spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    const id = nextId++
    pending.set(id, cb)
    return id
  })

  spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
    pending.delete(id)
  })

  return {
    tick: () => {
      for (const cb of pending.values()) {
        cb(0)
      }
      pending.clear()
    },
  }
}

describe('useRafThrottle', () => {
  it('coalesces rapid calls into one per frame', () => {
    const callback = mock()
    const { result } = renderHook(() => useRafThrottle(callback))
    const raf = stubRaf()

    result.current()
    result.current()
    result.current()

    // Nothing has fired yet — all three calls went through RAF
    expect(callback).toHaveBeenCalledTimes(0)

    raf.tick()

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('calls the callback immediately when requestAnimationFrame is unavailable', () => {
    const callback = mock()
    const { result } = renderHook(() => useRafThrottle(callback))
    const origRaf = window.requestAnimationFrame
    // @ts-expect-error — testing the no-raf fallback
    delete window.requestAnimationFrame

    result.current()

    expect(callback).toHaveBeenCalledTimes(1)
    window.requestAnimationFrame = origRaf
  })

  it('allows a new call in the next frame', () => {
    const callback = mock()
    const { result } = renderHook(() => useRafThrottle(callback))
    const raf = stubRaf()

    result.current()
    raf.tick()
    expect(callback).toHaveBeenCalledTimes(1)

    // New frame — schedule again
    result.current()
    expect(callback).toHaveBeenCalledTimes(1) // not yet fired
    raf.tick()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('cancels pending frame on unmount', () => {
    const callback = mock()
    const cancelSpy = spyOn(window, 'cancelAnimationFrame')

    const { unmount, result } = renderHook(() => useRafThrottle(callback))
    result.current() // schedules a frame
    expect(callback).toHaveBeenCalledTimes(0)

    unmount()

    // Cleanup should have cancelled the pending frame
    expect(cancelSpy).toHaveBeenCalled()
  })
})
