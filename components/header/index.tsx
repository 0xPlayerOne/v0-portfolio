import { useState, useCallback, useMemo } from 'react'
import { RetroCanvas } from './retro-canvas'
import { RetroNavbar } from './retro-navbar'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { NAVBAR_HEIGHT, NAVIGATION_SECTIONS } from '@/constants/navigation'

export function PongHeader() {
  const [isSticky, setIsSticky] = useState(false)

  // Memoize section IDs to prevent unnecessary recalculations
  const sectionIds = useMemo(() => NAVIGATION_SECTIONS.map((section) => section.id), [])

  // Share one throttled scroll listener between navigation spy and sticky state.
  const checkStickyState = useCallback(() => {
    const scrollPosition = window.scrollY
    // The navbar should stick when we scroll past the header minus the navbar height.
    // This keeps it at the bottom of the header until that threshold is crossed.
    const headerHeight = window.innerHeight - NAVBAR_HEIGHT
    const shouldBeSticky = scrollPosition > headerHeight

    // React bails out when the state is unchanged.
    setIsSticky((prev) => (prev === shouldBeSticky ? prev : shouldBeSticky))
  }, [])

  const activeSection = useScrollSpy({
    sectionIds,
    offset: NAVBAR_HEIGHT + 50,
    onScroll: checkStickyState,
  })
  const activeSectionString = activeSection || ''

  return (
    <>
      <header className="flex h-dvh w-full flex-col">
        <div className="flex-grow">
          <RetroCanvas navbarHeight={NAVBAR_HEIGHT} />
        </div>
        {/* Use opacity to manage default navbar visibility to maintain layout space */}
        <div style={{ opacity: isSticky ? 0 : 1, height: NAVBAR_HEIGHT }}>
          <RetroNavbar
            height={NAVBAR_HEIGHT}
            isSticky={false}
            activeSection={activeSectionString}
          />
        </div>
      </header>

      {/* When sticky, show a fixed navbar at the top */}
      {isSticky && (
        <div className="fixed top-0 right-0 left-0 z-50">
          <RetroNavbar height={NAVBAR_HEIGHT} isSticky={true} activeSection={activeSectionString} />
        </div>
      )}
    </>
  )
}
