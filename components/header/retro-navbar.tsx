import { useCallback, memo, type CSSProperties } from 'react'
import { smoothScrollToSection } from '@/lib/smooth-scroll'
import { NAVIGATION_SECTIONS } from '@/constants/navigation'
import { cn } from '@/lib/utils'

interface RetroNavbarProps {
  height: number
  isSticky?: boolean
  activeSection?: string
}

// Memoized NavItem — hover is handled via direct DOM mutation (no React
// state) so hovering any of the 4 items never re-renders the navbar or its
// siblings. This replaces the previous `hoveredItem` useState which tore down
// and recreated handlers on every enter/leave.
const NavItem = memo(function NavItem({
  item,
  isActive,
  height,
}: {
  item: (typeof NAVIGATION_SECTIONS)[number]
  isActive: boolean
  height: number
}) {
  const handleClick = useCallback(() => {
    smoothScrollToSection(item.id, height)
  }, [item.id, height])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--color-nav-hover)'
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--color-nav-text)'
  }, [])

  return (
    <li className="flex-shrink-0">
      <button
        onClick={handleClick}
        className={cn(
          'nav-link font-pixel m-0 block border-b border-solid px-1 py-2.5 align-baseline leading-none whitespace-nowrap transition-colors sm:px-2',
          isActive ? 'border-nav-border' : 'border-transparent'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {item.label}
      </button>
    </li>
  )
})

// Memoize the entire navbar component
export const RetroNavbar = memo(function RetroNavbar({
  height = 100,
  isSticky = false,
  activeSection = '',
}: RetroNavbarProps) {
  return (
    <nav
      className={cn(
        'surface-nav mt-px flex h-(--nav-h) items-center border-0',
        isSticky ? 'nav-blur bg-nav-bg-f8' : 'bg-nav-bg'
      )}
      style={{ '--nav-h': `${height}px` } as CSSProperties}
    >
      <div className="container mx-auto w-full px-2 sm:px-4">
        <ul className="flex justify-evenly space-x-2 font-pixel text-xs sm:justify-center sm:space-x-4 sm:text-sm md:space-x-6 md:text-base lg:space-x-8 lg:text-lg">
          {NAVIGATION_SECTIONS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              height={height}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
})
