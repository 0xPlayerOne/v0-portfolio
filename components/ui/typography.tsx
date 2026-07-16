import { cn } from '@/lib/utils'
import {
  SITE_HEADER_COLOR,
  SITE_SUBHEADER_COLOR,
  SITE_TEXT_COLOR,
  SITE_SUBTEXT_COLOR,
} from '@/constants/colors'
import type { TypographyProps } from '@/types/typography'

export function Typography({
  variant = 'body1',
  align = 'left',
  color = 'textPrimary',
  className = '',
  children,
  gutterBottom = false,
  component,
  ...props
}: TypographyProps) {
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
  const gutterClass = gutterBottom ? 'mb-4' : ''

  const colorMap = {
    primary: SITE_HEADER_COLOR,
    secondary: SITE_SUBHEADER_COLOR,
    textPrimary: SITE_TEXT_COLOR,
    textSecondary: SITE_SUBTEXT_COLOR,
    inherit: 'inherit',
  }

  const variantMap = {
    h1: {
      element: 'h1',
      classes: 'text-4xl sm:text-5xl font-bold font-pixel uppercase [word-spacing:-0.5em]',
    },
    h2: {
      element: 'h2',
      classes: 'text-3xl sm:text-4xl font-bold font-pixel uppercase [word-spacing:-0.5em]',
    },
    h3: { element: 'h3', classes: 'text-lg sm:text-xl font-semibold' },
    h4: { element: 'h4', classes: 'text-base sm:text-lg font-semibold' },
    h5: { element: 'h5', classes: 'text-sm sm:text-base font-semibold' },
    h6: { element: 'h6', classes: 'text-xs sm:text-sm font-semibold' },
    body1: { element: 'p', classes: 'text-base sm:text-lg' },
    body2: { element: 'p', classes: 'text-sm sm:text-base' },
    caption: { element: 'span', classes: 'text-xs sm:text-sm' },
    overline: { element: 'span', classes: 'text-xs uppercase tracking-wide' },
  }

  const { element: Element, classes } = variantMap[variant]
  const Component = component || Element
  const style = { color: colorMap[color] || SITE_TEXT_COLOR }

  return (
    <Component className={cn(classes, alignClass, gutterClass, className)} style={style} {...props}>
      {children}
    </Component>
  )
}
