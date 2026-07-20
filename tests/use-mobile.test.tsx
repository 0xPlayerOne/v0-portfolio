import { afterEach, describe, expect, it, vi } from 'bun:test'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns false when viewport is at desktop width', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    window.matchMedia = mockMatchMedia

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when viewport is below mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true })
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    window.matchMedia = mockMatchMedia

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('registers a media query listener on mount', () => {
    const removeEventListener = vi.fn()
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    })
    window.matchMedia = mockMatchMedia

    const { unmount } = renderHook(() => useIsMobile())
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    unmount()
    expect(removeEventListener).toHaveBeenCalled()
  })
})
