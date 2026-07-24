import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Github, Linkedin } from './brand-icons'

describe('Github brand icon', () => {
  it('renders an SVG with aria-hidden for accessibility', () => {
    const { container } = render(<Github />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('defaults to 24×24 when no size prop is given', () => {
    const { container } = render(<Github />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('24')
    expect(svg?.getAttribute('height')).toBe('24')
  })

  it('applies a custom size to width and height', () => {
    const { container } = render(<Github size={32} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('32')
    expect(svg?.getAttribute('height')).toBe('32')
  })

  it('forwards additional HTML props like className', () => {
    const { container } = render(<Github className="icon-large" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).toBe('icon-large')
  })

  it('renders a path element for the icon shape', () => {
    const { container } = render(<Github />)
    expect(container.querySelector('path')).not.toBeNull()
  })
})

describe('Linkedin brand icon', () => {
  it('renders an SVG with aria-hidden', () => {
    const { container } = render(<Linkedin />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('defaults to 24×24 when no size prop is given', () => {
    const { container } = render(<Linkedin />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('24')
    expect(svg?.getAttribute('height')).toBe('24')
  })

  it('applies a custom size to width and height', () => {
    const { container } = render(<Linkedin size={48} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('48')
    expect(svg?.getAttribute('height')).toBe('48')
  })

  it('forwards additional HTML props', () => {
    const { container } = render(<Linkedin id="linkedin-icon" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('id')).toBe('linkedin-icon')
  })

  it('renders a path element for the icon shape', () => {
    const { container } = render(<Linkedin />)
    expect(container.querySelector('path')).not.toBeNull()
  })
})
