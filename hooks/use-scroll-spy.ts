<<<<<<< HEAD
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
=======
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
>>>>>>> origin/staging

interface UseScrollSpyProps {
  sectionIds: readonly string[];
  offset?: number;
}

export const useScrollSpy = ({ sectionIds, offset = 0 }: UseScrollSpyProps) => {
<<<<<<< HEAD
  const [activeSection, setActiveSection] = useState<string | null>(null)
=======
  const [activeSection, setActiveSection] = useState<string | null>(null);
>>>>>>> origin/staging

  // Memoize section IDs array to prevent unnecessary recalculations
  const sectionIdsArray = useMemo(() => [...sectionIds], [sectionIds]);

  // Optimized scroll handler with throttling
  const throttledScrollHandler = useCallback(() => {
<<<<<<< HEAD
    let currentSection: string | null = null
    const scrollY = window.scrollY
=======
    let currentSection: string | null = null;
    const scrollY = window.scrollY;
>>>>>>> origin/staging

    // Iterate in reverse order to find the closest section above current scroll position
    // This is more efficient as we can break early once we find a match
    for (let i = sectionIdsArray.length - 1; i >= 0; i--) {
<<<<<<< HEAD
      const sectionId = sectionIdsArray[i]
      const section = document.getElementById(sectionId)

      if (section) {
        const sectionTop = section.offsetTop - offset
=======
      const sectionId = sectionIdsArray[i];
      const section = document.getElementById(sectionId);

      if (section) {
        const sectionTop = section.offsetTop - offset;
>>>>>>> origin/staging

        if (scrollY >= sectionTop) {
          currentSection = sectionId;
          break; // Exit loop once we find the first section above scroll position
        }
      }
    }

    // Only update state if the active section has changed
    if (currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [sectionIdsArray, offset, activeSection]);

  // Throttle scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame for better performance
    if (!window.requestAnimationFrame) {
      return throttledScrollHandler();
    }

<<<<<<< HEAD
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
=======
    window.requestAnimationFrame(throttledScrollHandler);
  }, [throttledScrollHandler]);

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
>>>>>>> origin/staging

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return activeSection;
};
