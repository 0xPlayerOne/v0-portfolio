// Cache section positions to avoid recalculating on each scroll
const sectionPositionCache = new Map<string, number>()

/**
 * Smoothly scrolls to a section with improved performance
 * @param sectionId The ID of the section to scroll to
 * @param offset Offset from the top of the section (e.g., for fixed headers)
 */
export function smoothScrollToSection(sectionId: string, offset = 0) {
  // Check if we have a cached position and the window width hasn't changed
  // (which would invalidate the position due to responsive layout changes)
  const cacheKey = `${sectionId}-${window.innerWidth}`
  let elementPosition = sectionPositionCache.get(cacheKey)

  // If position is not cached or needs to be recalculated
  if (elementPosition === undefined) {
    const element = document.getElementById(sectionId)
    if (!element) return

    // Calculate and cache the position
    elementPosition = element.offsetTop - offset
    sectionPositionCache.set(cacheKey, elementPosition)

    // Clear cache after 3 seconds to prevent stale positions
    // This is a good balance between performance and accuracy
    setTimeout(() => {
      sectionPositionCache.delete(cacheKey)
    }, 3000)
  }

  // Use requestAnimationFrame for smoother scrolling
  requestAnimationFrame(() => {
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  })
}
