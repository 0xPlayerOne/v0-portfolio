import { useCallback, memo, useMemo } from 'react'
import {
  NAV_BG_COLOR,
  NAV_BG_COLOR_F8,
  NAV_BORDER_COLOR,
  NAVBAR_SHADOW,
  NAV_TEXT_COLOR,
  NAV_HOVER_COLOR,
} from '@/constants/colors'
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
    e.currentTarget.style.color = NAV_HOVER_COLOR
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = NAV_TEXT_COLOR
  }, [])

  return (
    <li className="flex-shrink-0">
      <button
        onClick={handleClick}
        className={cn(
          'block px-1 whitespace-nowrap transition-colors sm:px-2',
          'font-pixel py-2.5 leading-none'
        )}
        style={{
          color: NAV_TEXT_COLOR,
          borderColor: isActive ? NAV_BORDER_COLOR : 'transparent',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          padding: '10px 0',
          margin: '0',
          verticalAlign: 'baseline',
          textRendering: 'optimizeSpeed',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'unset',
        }}
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
  const navStyle = useMemo(
    () => ({
      height: `${height}px`,
      backgroundColor: isSticky ? NAV_BG_COLOR_F8 : NAV_BG_COLOR,
      boxShadow: NAVBAR_SHADOW,
      backdropFilter: isSticky ? 'blur(4px)' : 'none',
      WebkitBackdropFilter: isSticky ? 'blur(4px)' : 'none',
      display: 'flex',
      marginTop: '1px',
    }),
    [height, isSticky]
  )

  return (
    <nav className="flex items-center border-0" style={navStyle}>
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
