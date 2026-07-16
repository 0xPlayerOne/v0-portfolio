<<<<<<< HEAD
'use client'

import { memo, useMemo } from 'react'
import { PongGame } from '@/lib/games/pong'
import { CANVAS_COLOR, BALL_COLOR, PIXEL_COLOR, HIT_COLOR, PADDLE_COLOR } from '@/constants/colors'
import { HEADER_TEXT } from '@/constants/content'
=======
"use client";

import { memo, useMemo } from "react";
import { PongGame } from "@/lib/games/pong";
import {
  CANVAS_COLOR,
  BALL_COLOR,
  PIXEL_COLOR,
  HIT_COLOR,
  PADDLE_COLOR,
} from "@/constants/colors";
import { HEADER_TEXT } from "@/constants/content";
>>>>>>> origin/staging

interface RetroCanvasProps {
  navbarHeight: number;
}

// Use React.memo to prevent unnecessary re-renders
export const RetroCanvas = memo(function RetroCanvas({
  navbarHeight,
}: RetroCanvasProps) {
  // Memoize the colors object to prevent unnecessary re-creation
  const pongColors = useMemo(
    () => ({
      background: CANVAS_COLOR,
      ball: BALL_COLOR,
      paddle: PADDLE_COLOR,
      pixel: PIXEL_COLOR,
      hitPixel: HIT_COLOR,
    }),
<<<<<<< HEAD
    []
  )
=======
    [],
  );
>>>>>>> origin/staging

  return (
    <div className="h-full w-full">
      <PongGame navbarHeight={navbarHeight} headerText={HEADER_TEXT} colors={pongColors} />
    </div>
  );
});
