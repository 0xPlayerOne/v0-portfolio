'use client'

import type React from 'react'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { NAVBAR_HEIGHT } from '@/constants/navigation'
import { SITE_BG_COLOR, SITE_TEXT_COLOR, SITE_BORDER_COLOR } from '@/constants/colors'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  children: React.ReactNode
}

// Memoize the Section component to prevent unnecessary re-renders
export const Section = memo(function Section({ id, children }: SectionProps) {
  const [sectionHeight, setSectionHeight] = useState('auto')

  // Optimize the height update function with useCallback
  const updateHeight = useCallback(() => {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Use min-height instead of fixed height for better mobile experience
      const minHeight = Math.max(600, window.innerHeight - NAVBAR_HEIGHT)
      setSectionHeight(`${minHeight}px`)
    })
  }, [])

  useEffect(() => {
    updateHeight()

    // Throttle resize events for better performance
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateHeight, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateHeight])

  // Memoize the style object to prevent recreation on each render
  const sectionStyle = useMemo(
    () => ({
      minHeight: sectionHeight,
      backgroundColor: SITE_BG_COLOR,
      color: SITE_TEXT_COLOR,
      boxShadow: `0 0 0 1px ${SITE_BORDER_COLOR}20, 0 0 5px ${SITE_BORDER_COLOR}30`,
    }),
    [sectionHeight]
  )

  return (
    <section
      id={id}
      className={cn('flex items-center justify-center border-0 py-8 sm:py-12 md:py-16')}
      style={sectionStyle}
    >
      <div className="container mx-auto w-full px-4">{children}</div>
    </section>
  )
})
