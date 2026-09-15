import { cn } from '@/lib/utils'
import type { TypographyProps, TypographyVariant } from '@/types/typography'

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const

const COLOR_CLASSES = {
  primary: 'text-site-header',
  secondary: 'text-site-subheader',
  textPrimary: 'text-site-text',
  textSecondary: 'text-site-subtext',
  inherit: 'text-inherit',
  destructive: 'text-destructive',
} as const

const VARIANT_CLASSES = {
  h1: 'text-4xl sm:text-5xl font-bold font-pixel uppercase [word-spacing:-0.5em]',
  h2: 'text-3xl sm:text-4xl font-bold font-pixel uppercase [word-spacing:-0.5em]',
  h3: 'text-lg sm:text-xl font-semibold',
  h4: 'text-base sm:text-lg font-semibold',
  h5: 'text-sm sm:text-base font-semibold',
  h6: 'text-xs sm:text-sm font-semibold',
  body1: 'text-base sm:text-lg',
  body2: 'text-sm sm:text-base',
  caption: 'text-xs sm:text-sm',
  overline: 'text-xs uppercase tracking-wide',
} as const

function defaultElement(variant: TypographyVariant) {
  switch (variant) {
    case 'body1':
    case 'body2':
      return 'p'
    case 'caption':
    case 'overline':
      return 'span'
    default:
      return variant
  }
}

export function Typography({
  variant = 'body1',
  align = 'left',
  color = 'textPrimary',
  className = '',
  children,
  gutterBottom = false,
  component,
  style,
  ...props
}: TypographyProps) {
  const alignClass = ALIGN_CLASSES[align as keyof typeof ALIGN_CLASSES] ?? ALIGN_CLASSES.left
  const gutterClass = gutterBottom ? 'mb-4' : ''
  const resolvedVariant = variant in VARIANT_CLASSES ? variant : 'body1'
  const Component = component || defaultElement(resolvedVariant)
  const colorClass = COLOR_CLASSES[color] ?? COLOR_CLASSES.textPrimary

  return (
    <Component
      className={cn(
        VARIANT_CLASSES[resolvedVariant],
        colorClass,
        alignClass,
        gutterClass,
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}
