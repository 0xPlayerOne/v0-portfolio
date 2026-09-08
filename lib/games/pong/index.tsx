'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { GameState, PongColors } from './types'
import { createGame, updateGame } from './game'
import { render } from './renderer'

export type { PongColors } from './types'

interface PongGameProps {
  navbarHeight: number
  colors: PongColors
  headerText: string[]
  className?: string
}

export function PongGame({ navbarHeight, colors, headerText, className }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<GameState | null>(null)
  const animationIdRef = useRef<number>(0)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight - navbarHeight

    // Only resize if dimensions have changed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      canvas.style.height = `${height}px`
      gameRef.current = createGame(width, height, colors, headerText)
    }
  }, [navbarHeight, colors, headerText])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false }) // Optimize by disabling alpha
    if (!ctx) return

    // Initial resize
    resize()

    // Throttled resize handler to improve performance
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        resize()
        if (gameRef.current) render(ctx, gameRef.current)
      }, 100)
    }

    // Render immediately so reduced-motion users and browsers without an
    // IntersectionObserver still receive a complete header.
    if (gameRef.current) render(ctx, gameRef.current)

    // Suspend the animation whenever it cannot be seen. The header otherwise
    // keeps drawing thousands of canvas primitives per second for the entire
    // session, even after the user has scrolled several sections past it.
    let cancelled = false
    let isIntersecting = true
    let isAnimating = false
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')

    const loop = () => {
      if (cancelled || !isAnimating) return

      if (gameRef.current) {
        gameRef.current = updateGame(gameRef.current)
        render(ctx, gameRef.current)
      }
      animationIdRef.current = requestAnimationFrame(loop)
    }

    const shouldAnimate = () =>
      isIntersecting && document.visibilityState !== 'hidden' && !prefersReducedMotion?.matches

    const syncAnimation = () => {
      if (shouldAnimate()) {
        if (!isAnimating) {
          isAnimating = true
          loop()
        }
        return
      }

      if (isAnimating) {
        isAnimating = false
        cancelAnimationFrame(animationIdRef.current)
      }
    }

    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(([entry]) => {
            isIntersecting = entry?.isIntersecting ?? false
            syncAnimation()
          })
        : null

    observer?.observe(canvas)
    document.addEventListener('visibilitychange', syncAnimation)
    prefersReducedMotion?.addEventListener?.('change', syncAnimation)
    syncAnimation()

    window.addEventListener('resize', handleResize)
    return () => {
      cancelled = true
      isAnimating = false
      cancelAnimationFrame(animationIdRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', syncAnimation)
      prefersReducedMotion?.removeEventListener?.('change', syncAnimation)
      observer?.disconnect()
    }
  }, [resize])

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className || ''}`}
      aria-label="Retro pong header with pixel art"
    />
  )
}
