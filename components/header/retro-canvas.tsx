'use client'

import { PongGame } from '@/lib/games/pong'
import { CANVAS_COLOR, BALL_COLOR, PIXEL_COLOR, HIT_COLOR, PADDLE_COLOR } from '@/constants/colors'
import { HEADER_TEXT } from '@/constants/content'

interface RetroCanvasProps {
  navbarHeight: number
}

const PONG_COLORS = {
  background: CANVAS_COLOR,
  ball: BALL_COLOR,
  paddle: PADDLE_COLOR,
  pixel: PIXEL_COLOR,
  hitPixel: HIT_COLOR,
} as const

export function RetroCanvas({ navbarHeight }: RetroCanvasProps) {
  return (
    <div className="h-full w-full">
      <PongGame navbarHeight={navbarHeight} headerText={HEADER_TEXT} colors={PONG_COLORS} />
    </div>
  )
}
