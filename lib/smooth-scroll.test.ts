import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test'

import { smoothScrollToSection } from './smooth-scroll'

describe('smoothScrollToSection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
      writable: true,
    })
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1_024,
      writable: true,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    document.body.innerHTML = ''
  })

  it('smoothly scrolls to an existing section and reuses its cached position', () => {
    jest.useFakeTimers()
    const section = document.createElement('section')
    section.id = 'projects'
    Object.defineProperty(section, 'offsetTop', {
      configurable: true,
      value: 500,
    })
    document.body.append(section)
    const scrollTo = mock()
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    }) as any
    window.scrollTo = scrollTo

    smoothScrollToSection('projects', 80)
    smoothScrollToSection('projects', 80)

    expect(scrollTo).toHaveBeenNthCalledWith(1, {
      top: 420,
      behavior: 'smooth',
    })
    expect(scrollTo).toHaveBeenNthCalledWith(2, {
      top: 420,
      behavior: 'smooth',
    })

    jest.advanceTimersByTime(3_000)
  })

  it('does nothing when the section does not exist', () => {
    const scrollTo = mock()
    window.scrollTo = scrollTo

    smoothScrollToSection('missing-section')

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
