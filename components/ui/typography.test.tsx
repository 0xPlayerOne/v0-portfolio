import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import {
  SITE_HEADER_COLOR,
  SITE_SUBHEADER_COLOR,
  SITE_TEXT_COLOR,
  SITE_SUBTEXT_COLOR,
} from '@/constants/colors'
import { Typography } from '@/components/ui/typography'

describe('Typography', () => {
  describe('variant', () => {
    const cases: [string, string, RegExp][] = [
      ['h1', 'h1', /font-pixel/],
      ['h2', 'h2', /font-pixel/],
      ['h3', 'h3', /font-semibold/],
      ['h4', 'h4', /font-semibold/],
      ['h5', 'h5', /font-semibold/],
      ['h6', 'h6', /font-semibold/],
      ['body1', 'p', /text-base/],
      ['body2', 'p', /text-sm/],
      ['caption', 'span', /text-xs/],
      ['overline', 'span', /uppercase/],
    ]

    for (const [variant, expectedElement, classPattern] of cases) {
      it(`renders as <${expectedElement}> with matching classes for variant="${variant}"`, () => {
        const { container } = render(<Typography variant={variant as any}>{variant}</Typography>)

        const el = container.querySelector(expectedElement)
        expect(el).not.toBeNull()
        expect(el?.textContent).toBe(variant)
        expect(el?.className).toMatch(classPattern)
      })
    }

    it('defaults to body1 when variant is omitted', () => {
      const { container } = render(<Typography>default</Typography>)
      const el = container.querySelector('p')
      expect(el).not.toBeNull()
      expect(el?.textContent).toBe('default')
    })

    it('gracefully handles an unknown variant by falling back to body1', () => {
      const { container } = render(<Typography variant={'unknown' as any}>fallback</Typography>)
      const el = container.querySelector('p')
      expect(el).not.toBeNull()
      expect(el?.textContent).toBe('fallback')
    })
  })

  describe('color', () => {
    const colorCases: [string, string][] = [
      ['primary', SITE_HEADER_COLOR],
      ['secondary', SITE_SUBHEADER_COLOR],
      ['textPrimary', SITE_TEXT_COLOR],
      ['textSecondary', SITE_SUBTEXT_COLOR],
      ['inherit', 'inherit'],
    ]

    for (const [color, expectedCss] of colorCases) {
      it(`applies color="${color}" as inline style "${expectedCss}"`, () => {
        render(
          <Typography color={color as any} variant="body1">
            colored
          </Typography>
        )
        const el = screen.getByText('colored')
        expect(el.style.color).toBe(expectedCss)
      })
    }

    it('falls back to SITE_TEXT_COLOR for an unknown color value', () => {
      render(
        <Typography color={'nonexistent' as any} variant="body1">
          unknown
        </Typography>
      )
      const el = screen.getByText('unknown')
      expect(el.style.color).toBe(SITE_TEXT_COLOR)
    })
  })

  describe('align', () => {
    const alignCases: [string, RegExp][] = [
      ['left', /text-left/],
      ['center', /text-center/],
      ['right', /text-right/],
    ]

    for (const [align, classPattern] of alignCases) {
      it(`applies align="${align}" class`, () => {
        const { container } = render(
          <Typography align={align as any} variant="body1">
            aligned
          </Typography>
        )
        const el = container.querySelector('p')
        expect(el?.className).toMatch(classPattern)
      })
    }

    it('defaults to text-left when align is omitted', () => {
      const { container } = render(<Typography variant="body1">default</Typography>)
      const el = container.querySelector('p')
      expect(el?.className).toMatch(/text-left/)
    })
  })

  describe('gutterBottom', () => {
    it('adds mb-4 when gutterBottom is true', () => {
      const { container } = render(
        <Typography variant="body1" gutterBottom>
          gutter
        </Typography>
      )
      const el = container.querySelector('p')
      expect(el?.className).toContain('mb-4')
    })

    it('omits mb-4 when gutterBottom is false', () => {
      const { container } = render(
        <Typography variant="body1" gutterBottom={false}>
          no-gutter
        </Typography>
      )
      const el = container.querySelector('p')
      expect(el?.className).not.toContain('mb-4')
    })

    it('omits mb-4 when gutterBottom is not set', () => {
      const { container } = render(<Typography variant="body1">default</Typography>)
      const el = container.querySelector('p')
      expect(el?.className).not.toContain('mb-4')
    })
  })

  describe('component override', () => {
    it('renders the custom component instead of the variant default', () => {
      render(
        <Typography variant="h1" component="div">
          override
        </Typography>
      )
      const el = screen.getByText('override')
      expect(el.tagName).toBe('DIV')
      // Classes should still match the h1 variant
      expect(el.className).toMatch(/font-pixel/)
    })

    it('accepts a custom component via component prop even for body variants', () => {
      render(
        <Typography variant="body1" component="article">
          article-body
        </Typography>
      )
      const el = screen.getByText('article-body')
      expect(el.tagName).toBe('ARTICLE')
    })
  })

  describe('className passthrough', () => {
    it('merges additional className via cn()', () => {
      const { container } = render(
        <Typography variant="body1" className="my-custom-class">
          custom
        </Typography>
      )
      const el = container.querySelector('p')
      expect(el?.className).toContain('my-custom-class')
    })

    it('preserves variant classes when className is added', () => {
      const { container } = render(
        <Typography variant="h1" className="extra-class">
          extra
        </Typography>
      )
      const el = container.querySelector('h1')
      expect(el?.className).toContain('font-pixel')
      expect(el?.className).toContain('extra-class')
    })
  })
})
