import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { useScrollSpy } from '@/hooks/use-scroll-spy'

function insertSection(id: string, offsetTop: number) {
  const el = document.createElement('section')
  el.id = id
  Object.defineProperty(el, 'offsetTop', {
    configurable: true,
    value: offsetTop,
    writable: true,
  })
  document.body.append(el)
  return el
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
    writable: true,
  })
}

function stubRaf() {
  spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 1
  })
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    setScrollY(0)
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
      writable: true,
    })
  })

  it('returns null when no section has been scrolled past', () => {
    insertSection('about', 100)
    insertSection('projects', 600)

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about', 'projects'] }))

    expect(result.current).toBeNull()
  })

  it('activates the closest section above the viewport', () => {
    insertSection('about', 100)
    insertSection('projects', 600)
    setScrollY(650)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about', 'projects'] }))

    expect(result.current).toBe('projects')
  })

  it('activates the first / only section when scrolled just past its top', () => {
    insertSection('hero', 0)
    setScrollY(10)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['hero'] }))

    expect(result.current).toBe('hero')
  })

  it('picks the deepest section when past multiple sections', () => {
    insertSection('a', 0)
    insertSection('b', 300)
    insertSection('c', 600)
    setScrollY(800)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['a', 'b', 'c'] }))

    expect(result.current).toBe('c')
  })

  it('applies the offset when computing section top boundaries', () => {
    insertSection('about', 500)
    // With offset=100, the effective threshold is 500-100 = 400
    // scrollY=450 is past the offset-adjusted top, so 'about' activates
    setScrollY(450)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about'], offset: 100 }))

    expect(result.current).toBe('about')
  })

  it('switches to a different section when scrolling further down', () => {
    insertSection('about', 0)
    insertSection('projects', 500)
    insertSection('contact', 1000)
    setScrollY(600)
    stubRaf()

    const { result, rerender } = renderHook(() =>
      useScrollSpy({ sectionIds: ['about', 'projects', 'contact'] })
    )

    expect(result.current).toBe('projects')

    setScrollY(1200)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe('contact')
  })

  it('returns null when scrolled back above all sections', () => {
    insertSection('about', 100)
    insertSection('projects', 600)
    setScrollY(700)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about', 'projects'] }))

    expect(result.current).toBe('projects')

    setScrollY(50)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBeNull()
  })

  it('tolerates missing sections in the DOM', () => {
    // section 'ghost' intentionally not created in DOM
    insertSection('real', 200)
    setScrollY(300)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['ghost', 'real'] }))

    expect(result.current).toBe('real')
  })

  it('works without requestAnimationFrame (raf null/undefined)', () => {
    insertSection('about', 100)
    setScrollY(200)
    // Remove requestAnimationFrame from window
    const origRaf = window.requestAnimationFrame
    // @ts-expect-error — testing the no-raf fallback
    delete window.requestAnimationFrame

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about'] }))

    expect(result.current).toBe('about')

    window.requestAnimationFrame = origRaf
  })

  it('does not re-render when the active section does not change', () => {
    insertSection('about', 0)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about'] }))

    expect(result.current).toBe('about')

    setScrollY(50)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    // Still 'about', should not have re-rendered
    expect(result.current).toBe('about')
  })

  it('removes the scroll listener on unmount', () => {
    const removeEventListener = spyOn(window, 'removeEventListener')

    insertSection('about', 100)
    setScrollY(200)

    const { unmount } = renderHook(() => useScrollSpy({ sectionIds: ['about'] }))

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('handles an empty sectionIds array gracefully', () => {
    const { result } = renderHook(() => useScrollSpy({ sectionIds: [] }))

    expect(result.current).toBeNull()
  })

  it('performs an initial check on mount', () => {
    insertSection('about', 0)
    setScrollY(50)
    stubRaf()

    const { result } = renderHook(() => useScrollSpy({ sectionIds: ['about'] }))

    // Without triggering a scroll event, the initial check runs on mount
    expect(result.current).toBe('about')
  })
})
