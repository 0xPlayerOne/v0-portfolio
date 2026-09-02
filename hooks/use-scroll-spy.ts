'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRafThrottle } from '@/hooks/use-raf-throttle'

interface UseScrollSpyProps {
  sectionIds: readonly string[]
  offset?: number
}

export const useScrollSpy = ({ sectionIds, offset = 0 }: UseScrollSpyProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const activeSectionRef = useRef<string | null>(null)

  // Optimized scroll handler with throttling — uses ref to avoid
  // re-creating the handler when activeSection changes, which would
  // otherwise re-register the scroll event listener on every section transition.
  const throttledScrollHandler = useCallback(() => {
    let currentSection: string | null = null
    const scrollY = window.scrollY

    // Iterate in reverse order to find the closest section above current scroll position
    // This is more efficient as we can break early once we find a match
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sectionId = sectionIds[i]
      const section = document.getElementById(sectionId)

      if (section) {
        const sectionTop = section.offsetTop - offset

        if (scrollY >= sectionTop) {
          currentSection = sectionId
          break // Exit loop once we find the first section above scroll position
        }
      }
    }

    // Only update state if the active section has changed
    if (currentSection !== activeSectionRef.current) {
      activeSectionRef.current = currentSection
      setActiveSection(currentSection)
    }
  }, [sectionIds, offset])

  const handleScroll = useRafThrottle(throttledScrollHandler)

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check on mount
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return activeSection
}
