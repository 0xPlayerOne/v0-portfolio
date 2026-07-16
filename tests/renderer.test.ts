import { describe, expect, it, vi } from "vitest"

import { render } from "@/lib/games/pong/renderer"
import type { GameState } from "@/lib/games/pong/types"

function createContext() {
  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    fillStyle: "",
    font: "",
    globalAlpha: 1,
    lineWidth: 0,
    shadowBlur: 0,
    shadowColor: "",
    strokeStyle: "",
    textAlign: "start",
    textBaseline: "alphabetic",
  } as unknown as CanvasRenderingContext2D
}

describe("pong renderer", () => {
  it("draws the board, pixels, particles, paddles, ball, and score", () => {
    const context = createContext()
    const game: GameState = {
      width: 320,
      height: 200,
      scale: 1,
      score: 7,
      colors: {
        background: "black",
        pixel: "lime",
        hitPixel: "green",
        ball: "white",
        paddle: "pink",
      },
      pixels: [
        { x: 10, y: 20, size: 4, hit: false },
        { x: 20, y: 20, size: 4, hit: true },
      ],
      ball: { x: 100, y: 80, dx: 2, dy: 2, radius: 5 },
      paddles: [
        { x: 0, y: 40, width: 8, height: 60, targetX: 0, targetY: 40, isVertical: true },
      ],
      particles: [{ x: 50, y: 50, dx: 1, dy: 1, alpha: 0.5, life: 2 }],
    }

    render(context, game)

    expect(context.fillRect).toHaveBeenCalledTimes(5)
    expect(context.arc).toHaveBeenCalledWith(100, 80, 5, 0, Math.PI * 2)
    expect(context.fillText).toHaveBeenCalledWith("Score: 7", 20, 20)
    expect(context.strokeText).toHaveBeenCalledWith("Score: 7", 20, 20)
    expect(context.globalAlpha).toBe(1)
    expect(context.shadowBlur).toBe(0)
  })
})
