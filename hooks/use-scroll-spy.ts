'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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

  // Throttle scroll handler for better performance
  const rafIdRef = useRef<number>(0)
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for better performance
    if (!window.requestAnimationFrame) {
      return throttledScrollHandler()
    }

    // Coalesce scroll events: cancel any pending frame so at most one
    // callback runs per animation frame instead of queueing one callback
    // per scroll event (trackpad/rapid scroll can fire several per frame).
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = 0
      throttledScrollHandler()
    })
  }, [throttledScrollHandler])

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check on mount
    handleScroll()

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return activeSection
}
