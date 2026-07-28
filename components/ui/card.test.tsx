import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

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
    const { container } = render(<Card className="my-card">merged</Card>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('my-card')
    expect(el?.className).toContain('rounded-lg')
  })

  it('forwards additional HTML props', () => {
    render(<Card data-testid="card-root">props</Card>)
    const el = screen.getByTestId('card-root')
    expect(el).not.toBeNull()
    expect(el.textContent).toBe('props')
  })
})

describe('CardHeader', () => {
  it('renders as a <div> with header layout classes', () => {
    const { container } = render(<CardHeader>header</CardHeader>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('header')
    expect(el?.className).toContain('flex')
    expect(el?.className).toContain('flex-col')
    expect(el?.className).toContain('p-6')
  })

  it('merges additional className', () => {
    const { container } = render(<CardHeader className="custom-header">merged</CardHeader>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('custom-header')
    expect(el?.className).toContain('flex')
  })
})

describe('CardTitle', () => {
  it('renders as a <div> with title typography classes', () => {
    const { container } = render(<CardTitle>My Title</CardTitle>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('My Title')
    expect(el?.className).toContain('text-2xl')
    expect(el?.className).toContain('font-semibold')
    expect(el?.className).toContain('tracking-tight')
  })

  it('merges additional className', () => {
    const { container } = render(<CardTitle className="custom-title">Title</CardTitle>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('custom-title')
    expect(el?.className).toContain('font-semibold')
  })
})

describe('CardDescription', () => {
  it('renders as a <div> with description styles', () => {
    const { container } = render(<CardDescription>description text</CardDescription>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('description text')
    expect(el?.className).toContain('text-sm')
    expect(el?.className).toContain('text-muted-foreground')
  })

  it('merges additional className', () => {
    const { container } = render(<CardDescription className="custom-desc">desc</CardDescription>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('custom-desc')
    expect(el?.className).toContain('text-muted-foreground')
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
    const { container } = render(<CardContent className="custom-body">body</CardContent>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('custom-body')
    expect(el?.className).toContain('p-6')
  })
})

describe('CardFooter', () => {
  it('renders as a <div> with footer layout classes', () => {
    const { container } = render(<CardFooter>footer</CardFooter>)
    const el = container.querySelector('div')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('footer')
    expect(el?.className).toContain('flex')
    expect(el?.className).toContain('items-center')
    expect(el?.className).toContain('p-6')
    expect(el?.className).toContain('pt-0')
  })

  it('merges additional className', () => {
    const { container } = render(<CardFooter className="custom-footer">footer</CardFooter>)
    const el = container.querySelector('div')
    expect(el?.className).toContain('custom-footer')
    expect(el?.className).toContain('flex')
  })
})

describe('Card composition', () => {
  it('renders a composed card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Title')).not.toBeNull()
    expect(screen.getByText('Description')).not.toBeNull()
    expect(screen.getByText('Content')).not.toBeNull()
    expect(screen.getByText('Footer')).not.toBeNull()
  })
})
