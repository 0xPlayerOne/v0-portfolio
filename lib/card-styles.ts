import { useCallback } from 'react'
import type { MouseEvent } from 'react'

const DEFAULT_ENTER_SIZE = '20px'
const DEFAULT_ENTER_GLOW = 'var(--color-site-btn-40)'
const DEFAULT_LEAVE_SIZE = '10px'
const DEFAULT_LEAVE_GLOW = 'var(--color-site-border-40)'

export function useCardHover(options?: {
  enterSize?: string
  enterGlow?: string
  leaveSize?: string
  leaveGlow?: string
}) {
  const enterSize = options?.enterSize ?? DEFAULT_ENTER_SIZE
  const enterGlow = options?.enterGlow ?? DEFAULT_ENTER_GLOW
  const leaveSize = options?.leaveSize ?? DEFAULT_LEAVE_SIZE
  const leaveGlow = options?.leaveGlow ?? DEFAULT_LEAVE_GLOW

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px var(--color-site-border), 0 0 ${enterSize} ${enterGlow}`
    },
    [enterSize, enterGlow]
  )

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px var(--color-site-border), 0 0 ${leaveSize} ${leaveGlow}`
    },
    [leaveSize, leaveGlow]
  )

  return { handleMouseEnter, handleMouseLeave }
}
