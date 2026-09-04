/**
 * Smoothly scrolls to a section.
 * Reads offsetTop directly — the DOM read is a single layout query and
 * far cheaper than maintaining a Map + setTimeout cache that can go stale
 * when fonts/images shift layout after load.
 *
 * @param sectionId The ID of the section to scroll to
 * @param offset Offset from the top of the section (e.g., for fixed headers)
 */
export function smoothScrollToSection(sectionId: string, offset = 0) {
  const element = document.getElementById(sectionId)
  if (!element) return

  window.scrollTo({
    top: element.offsetTop - offset,
    behavior: 'smooth',
  })
}
