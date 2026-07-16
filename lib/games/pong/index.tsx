<<<<<<< HEAD
'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { GameState, PongColors } from './types'
import { createGame, updateGame } from './game'
import { render } from './renderer'

export type { PongColors } from './types'
=======
"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GameState, PongColors } from "./types";
import { createGame, updateGame } from "./game";
import { render } from "./renderer";

export type { PongColors } from "./types";
>>>>>>> origin/staging

interface PongGameProps {
  navbarHeight: number;
  colors: PongColors;
  headerText: string[];
  className?: string;
}

export function PongGame({
  navbarHeight,
  colors,
  headerText,
  className,
}: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const animationIdRef = useRef<number>(0);

  // Memoize the resize function to avoid recreating it on each render
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight - navbarHeight;

    // Only resize if dimensions have changed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.height = `${height}px`;
      gameRef.current = createGame(width, height, colors, headerText);
    }
  }, [navbarHeight, colors, headerText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

<<<<<<< HEAD
    const ctx = canvas.getContext('2d', { alpha: false }) // Optimize by disabling alpha
    if (!ctx) return
=======
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize by disabling alpha
    if (!ctx) return;
>>>>>>> origin/staging

    // Initial resize
    resize();

    // Throttled resize handler to improve performance
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    // Optimized animation loop
    const loop = () => {
      if (gameRef.current) {
        gameRef.current = updateGame(gameRef.current);
        render(ctx, gameRef.current);
      }
      animationIdRef.current = requestAnimationFrame(loop);
    };
    loop();

<<<<<<< HEAD
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationIdRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [resize])
=======
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [resize]);
>>>>>>> origin/staging

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className || ''}`}
      aria-label="Retro pong header with pixel art"
    />
  );
}
