import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Section } from '@/components/ui/section'

describe('Section', () => {
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

  it('uses CSS viewport units with a 600px floor without runtime resize state', () => {
    const { container } = render(<Section id="h1">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    expect(section?.className).toContain('min-h-')
    expect(section?.className).toContain('100dvh')
  })

  it('applies static style with site colors', () => {
    const { container } = render(<Section id="styled">x</Section>)
    const section = container.querySelector<HTMLElement>('section')
    expect(section?.className).toContain('bg-site-bg')
    expect(section?.className).toContain('text-site-text')
    expect(section?.className).toContain('surface-section')
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
})
