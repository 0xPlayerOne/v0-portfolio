/**
 * Smoothly scrolls to a section with improved performance
 * @param sectionId The ID of the section to scroll to
 * @param offset Offset from the top of the section (e.g., for fixed headers)
 */
export function smoothScrollToSection(sectionId: string, offset = 0) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const elementPosition = element.offsetTop - offset

  // Use requestAnimationFrame for smoother scrolling
  requestAnimationFrame(() => {
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  })
}
