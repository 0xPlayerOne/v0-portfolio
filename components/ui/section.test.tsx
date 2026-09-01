import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { getInitialSectionHeight, Section } from '@/components/ui/section'
import { NAVBAR_HEIGHT } from '@/constants/navigation'
import { SITE_BG_COLOR, SITE_TEXT_COLOR, SITE_BORDER_COLOR } from '@/constants/colors'

describe('Section', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 900,
    })
  })

  afterEach(() => {
    mock.restore()
  })

  it('renders the section element with the given id and children', () => {
    render(
      <Section id="about">
        <span>hello world</span>
      </Section>
    )
    const section = document.getElementById('about')
    expect(section).not.toBeNull()
    expect(section?.tagName.toLowerCase()).toBe('section')
    expect(screen.getByText('hello world')).not.toBeNull()
  })

  it('applies layout classes and container wrapper', () => {
    const { container } = render(
      <Section id="skills">
        <span>content</span>
      </Section>
    )
    const section = container.querySelector('section')
    expect(section?.className).toContain('flex')
    expect(section?.className).toContain('items-center')
    expect(section?.className).toContain('justify-center')
    const inner = container.querySelector('div.container')
    expect(inner).not.toBeNull()
    expect(inner?.className).toContain('mx-auto')
  })

  it('sets min-height based on window.innerHeight minus NAVBAR_HEIGHT with 600px floor', async () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 900,
    })
    const { container } = render(<Section id="h1">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    expect(section?.style.minHeight).toBe(`${Math.max(600, 900 - NAVBAR_HEIGHT)}px`)

    // Below floor: innerHeight small should still clamp to 600
    const saved = window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 400,
    })
    const { container: c2 } = render(<Section id="h2">y</Section>)
    const s2 = c2.querySelector<HTMLElement>('section')
    // initial state is computed at render time, before useEffect
    expect(s2?.style.minHeight).toBe('600px')
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: saved,
    })
  })

  it('applies memoised style with site colors', () => {
    const { container } = render(<Section id="styled">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    expect(section?.style.backgroundColor).toBe(SITE_BG_COLOR)
    expect(section?.style.color).toBe(SITE_TEXT_COLOR)
    expect(section?.style.boxShadow).toContain(SITE_BORDER_COLOR)
    expect(section?.style.boxShadow).toContain('20')
  })

  it('registers a single resize listener and throttles with 100ms debounce', async () => {
    const addSpy = spyOn(window, 'addEventListener')
    const removeSpy = spyOn(window, 'removeEventListener')

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 800,
    })
    const { container, unmount } = render(<Section id="debounce">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    expect(addSpy.mock.calls.filter(([e]) => e === 'resize')).toHaveLength(1)

    // initial min-height based on 800
    expect(section?.style.minHeight).toBe(`${Math.max(600, 800 - NAVBAR_HEIGHT)}px`)

    // Change height and fire rapid resizes — only the debounced one should apply
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 1200,
    })
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
      window.dispatchEvent(new Event('resize'))
      window.dispatchEvent(new Event('resize'))
      // still old height before debounce fires
      expect(section?.style.minHeight).toBe(`${Math.max(600, 800 - NAVBAR_HEIGHT)}px`)
      await new Promise((resolve) => setTimeout(resolve, 130))
    })

    // after debounce, height updated
    await waitFor(() => {
      expect(section?.style.minHeight).toBe(`${Math.max(600, 1200 - NAVBAR_HEIGHT)}px`)
    })

    // unmount cleans up listener and pending timeout
    unmount()
    expect(removeSpy.mock.calls.filter(([e]) => e === 'resize')).toHaveLength(1)
  })

  it('calls updateHeight on mount and handles sequential resizes', async () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 700,
    })
    const { container } = render(<Section id="seq">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    await waitFor(() => expect(section?.style.minHeight).toBe('600px')) // max(600,700-100)=600

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 1400,
    })
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
      await new Promise((r) => setTimeout(r, 130))
    })
    expect(section?.style.minHeight).toBe('1300px')
  })

  it('clears the pending resizeTimeout on unmount to avoid leaks', async () => {
    const clearSpy = spyOn(globalThis, 'clearTimeout')
    const { unmount } = render(<Section id="leak">x</Section>)
    // trigger a resize to schedule a timeout
    window.dispatchEvent(new Event('resize'))
    // unmount immediately without waiting for debounce — cleanup must clearTimeout
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })

  it('renders multiple independent sections with distinct ids', () => {
    render(
      <>
        <Section id="a">one</Section>
        <Section id="b">two</Section>
      </>
    )
    expect(document.getElementById('a')).not.toBeNull()
    expect(document.getElementById('b')).not.toBeNull()
    expect(screen.getByText('one')).not.toBeNull()
    expect(screen.getByText('two')).not.toBeNull()
  })

  it('falls back to auto when window is undefined (SSR branch)', async () => {
    // Directly exercise the extracted helper with window deleted — this hits
    // the `return 'auto'` line which is otherwise unreachable in happy-dom.
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
    const savedWindow = (globalThis as any).window
    try {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: undefined,
      })
      // @ts-ignore – deleting window makes typeof window === 'undefined' true
      expect(getInitialSectionHeight()).toBe('auto')

      // Restore and verify the normal px path still works
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: savedWindow,
      })
      Object.defineProperty(savedWindow, 'innerHeight', {
        configurable: true,
        writable: true,
        value: 900,
      })
      expect(getInitialSectionHeight()).toBe(`${Math.max(600, 900 - NAVBAR_HEIGHT)}px`)
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(globalThis, 'window', originalDescriptor)
      } else {
        ;(globalThis as any).window = savedWindow
      }
      // Ensure the happy-dom window still has innerHeight for subsequent tests
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        writable: true,
        value: 900,
      })
    }
  })

  it('exposes passive resize listener for performance', () => {
    const calls: unknown[] = []
    const originalAdd = window.addEventListener
    const spy = spyOn(window, 'addEventListener').mockImplementation(((
      event: string,
      handler: unknown,
      options: unknown
    ) => {
      if (event === 'resize') calls.push(options)
      return originalAdd.call(window, event as never, handler as never, options as never)
    }) as never)
    const { unmount } = render(<Section id="passive">x</Section>)
    expect(calls[0]).toEqual({ passive: true })
    unmount()
    spy.mockRestore()
  })
})
