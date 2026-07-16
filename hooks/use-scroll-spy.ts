'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseScrollSpyProps {
  sectionIds: readonly string[]
  offset?: number
}

export const useScrollSpy = ({ sectionIds, offset = 0 }: UseScrollSpyProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Memoize section IDs array to prevent unnecessary recalculations
  const sectionIdsArray = useMemo(() => [...sectionIds], [sectionIds])

  // Optimized scroll handler with throttling
  const throttledScrollHandler = useCallback(() => {
    let currentSection: string | null = null
    const scrollY = window.scrollY

    // Iterate in reverse order to find the closest section above current scroll position
    // This is more efficient as we can break early once we find a match
    for (let i = sectionIdsArray.length - 1; i >= 0; i--) {
      const sectionId = sectionIdsArray[i]
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
    if (currentSection !== activeSection) {
      setActiveSection(currentSection)
    }
  }, [sectionIdsArray, offset, activeSection])

  // Throttle scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for better performance
    if (!window.requestAnimationFrame) {
      return throttledScrollHandler()
    }

    window.requestAnimationFrame(throttledScrollHandler)
  }, [throttledScrollHandler])

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
