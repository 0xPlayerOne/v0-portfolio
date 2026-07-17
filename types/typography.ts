import type * as React from 'react'

export type TypographyVariant =
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline'

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify'

export type TypographyColor = 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'inherit'

export interface TypographyProps {
  variant?: TypographyVariant
  align?: TypographyAlign
  color?: TypographyColor
  component?: React.ElementType
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  gutterBottom?: boolean
  noWrap?: boolean
}
