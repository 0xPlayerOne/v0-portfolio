import type React from 'react'
import { NAVBAR_HEIGHT } from '@/constants/navigation'
import { SITE_BG_COLOR, SITE_TEXT_COLOR, SECTION_SHADOW } from '@/constants/colors'

interface SectionProps {
  id: string
  children: React.ReactNode
}

const MIN_SECTION_HEIGHT = 600

const SECTION_STYLE = {
  minHeight: `max(${MIN_SECTION_HEIGHT}px, calc(100dvh - ${NAVBAR_HEIGHT}px))`,
  backgroundColor: SITE_BG_COLOR,
  color: SITE_TEXT_COLOR,
  boxShadow: SECTION_SHADOW,
} as const

export function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className="flex items-center justify-center border-0 py-8 sm:py-12 md:py-16"
      style={SECTION_STYLE}
    >
      <div className="container mx-auto w-full px-4">{children}</div>
    </section>
  )
}
