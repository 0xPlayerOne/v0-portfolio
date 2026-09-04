import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import { smoothScrollToSection } from './smooth-scroll'

describe('smoothScrollToSection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1_024,
      writable: true,
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('smoothly scrolls to an existing section with offset', () => {
    const section = document.createElement('section')
    section.id = 'projects'
    Object.defineProperty(section, 'offsetTop', {
      configurable: true,
      value: 500,
    })
    document.body.append(section)
    const scrollTo = mock()
    window.scrollTo = scrollTo

    smoothScrollToSection('projects', 80)

    expect(scrollTo).toHaveBeenCalledWith({
      top: 420,
      behavior: 'smooth',
    })
  })

  it('scrolls without offset by default', () => {
    const section = document.createElement('section')
    section.id = 'about'
    Object.defineProperty(section, 'offsetTop', {
      configurable: true,
      value: 300,
    })
    document.body.append(section)
    const scrollTo = mock()
    window.scrollTo = scrollTo

    smoothScrollToSection('about')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 300,
      behavior: 'smooth',
    })
  })

  it('does nothing when the section does not exist', () => {
    const scrollTo = mock()
    window.scrollTo = scrollTo

    smoothScrollToSection('missing-section')

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('reads offsetTop fresh on each call (no stale cache)', () => {
    const section = document.createElement('section')
    section.id = 'skills'
    let offsetTop = 200
    Object.defineProperty(section, 'offsetTop', {
      configurable: true,
      get() {
        return offsetTop
      },
    })
    document.body.append(section)
    const scrollTo = mock()
    window.scrollTo = scrollTo

    smoothScrollToSection('skills', 10)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 190, behavior: 'smooth' })

    // Simulate layout shift (e.g. font load) — second call must see new position
    offsetTop = 350
    smoothScrollToSection('skills', 10)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 340, behavior: 'smooth' })
    expect(scrollTo).toHaveBeenCalledTimes(2)
  })
})
