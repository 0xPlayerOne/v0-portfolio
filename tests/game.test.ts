import { describe, expect, it, vi } from "vitest"

import { PARTICLE_COUNT, PARTICLE_LIFE } from "@/lib/games/pong/constants"
import { createGame, updateGame } from "@/lib/games/pong/game"

const colors = {
  background: "#000000",
  pixel: "#00ff00",
  hitPixel: "#006600",
  ball: "#ffffff",
  paddle: "#ff00ff",
}

describe("pong game", () => {
  it("creates a scaled game with centered paddles and text pixels", () => {
    const game = createGame(1_000, 600, colors, ["AB", "CD"])

    expect(game.scale).toBe(1)
    expect(game.paddles).toHaveLength(4)
    expect(game.pixels.length).toBeGreaterThan(20)
    expect(game.ball).toMatchObject({ x: 800, y: 180, dx: -8, dy: 8 })
    expect(game.paddles.filter((paddle) => paddle.isVertical)).toHaveLength(2)
  })

  it("keeps the ball inside every boundary", () => {
    const game = createGame(400, 300, colors, ["A", "B"])
    game.pixels.forEach((pixel) => {
      pixel.hit = true
    })

    game.ball.y = game.ball.radius - 1
    game.ball.dy = -5
    updateGame(game)
    expect(game.ball.y).toBe(game.ball.radius)
    expect(game.ball.dy).toBeGreaterThan(0)

    game.ball.x = game.width - game.ball.radius + 1
    game.ball.dx = 5
    updateGame(game)
    expect(game.ball.x).toBe(game.width - game.ball.radius)
    expect(game.ball.dx).toBeLessThan(0)
  })

  it("marks a pixel hit, updates the score, and expires particles", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    const game = createGame(600, 400, colors, ["A", "B"])
    const target = game.pixels[0]
    target.x = game.width / 2
    target.y = game.height / 2

    game.ball.x = target.x + target.size / 2
    game.ball.y = target.y + target.size / 2
    game.ball.dx = 0
    game.ball.dy = 0

    updateGame(game)

    expect(target.hit).toBe(true)
    expect(game.score).toBe(1)
    expect(game.particles).toHaveLength(PARTICLE_COUNT)

    game.pixels.forEach((pixel) => {
      pixel.hit = true
    })
    game.ball.x = game.width / 2
    game.ball.y = 10
    for (let frame = 1; frame < PARTICLE_LIFE; frame++) {
      updateGame(game)
    }

    expect(game.particles).toHaveLength(0)
  })
})
