'use client'

import { useState, useCallback, memo, useMemo } from 'react'
import { NAV_BG_COLOR, NAV_BORDER_COLOR, NAV_TEXT_COLOR, NAV_HOVER_COLOR } from '@/constants/colors'
import { smoothScrollToSection } from '@/lib/smooth-scroll'
import { NAVIGATION_SECTIONS } from '@/constants/navigation'
import { cn } from '@/lib/utils'

interface RetroNavbarProps {
  height: number
  isSticky?: boolean
  activeSection?: string
}

// Memoized NavItem component to prevent unnecessary re-renders
const NavItem = memo(function NavItem({
  item,
  isActive,
  height,
  onHover,
  hoveredItem,
}: {
  item: (typeof NAVIGATION_SECTIONS)[number]
  isActive: boolean
  height: number
  onHover: (id: string | null) => void
  hoveredItem: string | null
}) {
  // Memoize the scroll handler to prevent recreation on each render
  const handleClick = useCallback(() => {
    smoothScrollToSection(item.id, height)
  }, [item.id, height])

  // Memoize the mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => onHover(item.id), [onHover, item.id])
  const handleMouseLeave = useCallback(() => onHover(null), [onHover])

  const isHovered = hoveredItem === item.id

  return (
    <li className="flex-shrink-0">
      <button
        onClick={handleClick}
        className={cn(
          'block px-1 whitespace-nowrap transition-colors sm:px-2',
          'font-pixel py-2.5 leading-none'
        )}
        style={{
          color: isHovered ? NAV_HOVER_COLOR : NAV_TEXT_COLOR,
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Memoize the nav style to prevent recreation on each render
  const navStyle = useMemo(
    () => ({
      height: `${height}px`,
      backgroundColor: isSticky ? `${NAV_BG_COLOR}f8` : NAV_BG_COLOR,
      boxShadow: `0 0 0 1px ${NAV_BORDER_COLOR}, 0 0 10px ${NAV_BORDER_COLOR}60`,
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
        <ul className="flex justify-evenly space-x-2 font-['Press_Start_2P'] text-xs sm:justify-center sm:space-x-4 sm:text-sm md:space-x-6 md:text-base lg:space-x-8 lg:text-lg">
          {NAVIGATION_SECTIONS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              height={height}
              onHover={setHoveredItem}
              hoveredItem={hoveredItem}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
})
