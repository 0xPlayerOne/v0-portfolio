'use client'

import { useCallback } from 'react'
import {
  SITE_BORDER_COLOR,
  SITE_CARD_COLOR,
  CARD_SHADOW,
  SITE_BTN_COLOR_40,
  SITE_BORDER_COLOR_40,
} from '@/constants/colors'

export const CARD_BASE_STYLE = {
  backgroundColor: SITE_CARD_COLOR,
  boxShadow: CARD_SHADOW,
} as const

const DEFAULT_ENTER_SIZE = '20px'
const DEFAULT_ENTER_GLOW = SITE_BTN_COLOR_40
const DEFAULT_LEAVE_SIZE = '10px'
const DEFAULT_LEAVE_GLOW = SITE_BORDER_COLOR_40

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
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 ${enterSize} ${enterGlow}`
    },
    [enterSize, enterGlow]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 ${leaveSize} ${leaveGlow}`
    },
    [leaveSize, leaveGlow]
  )

  return { handleMouseEnter, handleMouseLeave }
}
