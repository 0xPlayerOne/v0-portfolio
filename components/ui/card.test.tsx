import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Card, CardContent, cardVariants } from '@/components/ui/card'

describe('Card', () => {
  it('renders as a <div> with card classes', () => {
    const { container } = render(<Card>content</Card>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('content')
    expect(el?.className).toContain('rounded-lg')
    expect(el?.className).toContain('border')
    expect(el?.className).toContain('shadow-sm')
  })

  it('merges additional className', () => {
    const { container } = render(<Card className="mt-2">merged</Card>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('mt-2')
    expect(el?.className).toContain('rounded-lg')
  })

  it('forwards additional HTML props', () => {
    render(<Card data-testid="card-root">props</Card>)
    const el = screen.getByTestId('card-root')
    expect(el).not.toBeNull()
    expect(el.textContent).toBe('props')
  })
})

describe('CardContent', () => {
  it('renders as a <div> with content padding', () => {
    const { container } = render(<CardContent>body</CardContent>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('body')
    expect(el?.className).toContain('p-6')
    expect(el?.className).toContain('pt-0')
  })

  it('merges additional className', () => {
    const { container } = render(<CardContent className="pb-2">body</CardContent>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('pb-2')
    expect(el?.className).toContain('p-6')
  })
})

describe('Card composition', () => {
  it('renders a composed card with content', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Content')).not.toBeNull()
  })
})

describe('cardVariants', () => {
  it('applies the site variant styles', () => {
    const className = cardVariants({ variant: 'site' })
    expect(className).toContain('surface-card')
    expect(className).toContain('bg-site-card')
    expect(className).toContain('transition-all')
  })

  it('returns an empty variant string for the default variant', () => {
    expect(cardVariants({ variant: 'default' })).not.toContain('surface-card')
  })
})