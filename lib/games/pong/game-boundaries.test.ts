import { describe, expect, it } from 'bun:test'
import { createGame, updateGame } from './game'
import type { PongColors } from './types'

const colors: PongColors = {
  ball: '#9933FF',
  paddle: '#9933FF',
  pixel: '#33FF33',
  hitPixel: '#226622',
  background: '#18161a',
}

describe('pong game – boundary coverage (lower walls)', () => {
  it('clamps to the bottom boundary and inverts dy', () => {
    const game = createGame(400, 300, colors, ['A', 'B'])
    // prevent pixel collisions from interfering
    game.pixels.forEach((p) => (p.hit = true))

    // place ball just beyond bottom wall moving downwards, but outside
    // the bottom paddle's x-range (paddle is centered at 178-222 for this size)
    game.ball.y = game.height - game.ball.radius + 2
    game.ball.dy = 7
    game.ball.x = 10
    game.ball.dx = 0

    updateGame(game)

    expect(game.ball.y).toBe(game.height - game.ball.radius)
    expect(game.ball.dy).toBeLessThan(0)
    expect(game.ball.dy).toBe(-7)
  })

  it('clamps to the left boundary and inverts dx', () => {
    const game = createGame(400, 300, colors, ['A', 'B'])
    game.pixels.forEach((p) => (p.hit = true))

    // place outside vertical paddle's y-range (paddle at ~128-172)
    game.ball.x = game.ball.radius - 1
    game.ball.dx = -9
    game.ball.y = 10
    game.ball.dy = 0

    updateGame(game)

    expect(game.ball.x).toBe(game.ball.radius)
    expect(game.ball.dx).toBeGreaterThan(0)
    expect(game.ball.dx).toBe(9)
  })

  it('handles simultaneous bottom-right corner collision', () => {
    const game = createGame(500, 500, colors, ['A', 'B'])
    game.pixels.forEach((p) => (p.hit = true))

    game.ball.x = game.width - game.ball.radius + 1
    game.ball.y = game.height - game.ball.radius + 1
    game.ball.dx = 5
    game.ball.dy = 6

    updateGame(game)

    expect(game.ball.x).toBe(game.width - game.ball.radius)
    expect(game.ball.y).toBe(game.height - game.ball.radius)
    expect(game.ball.dx).toBeLessThan(0)
    expect(game.ball.dy).toBeLessThan(0)
  })

  it('handles simultaneous top-left corner collision', () => {
    const game = createGame(500, 500, colors, ['A', 'B'])
    game.pixels.forEach((p) => (p.hit = true))

    game.ball.x = game.ball.radius - 2
    game.ball.y = game.ball.radius - 2
    game.ball.dx = -4
    game.ball.dy = -4

    updateGame(game)

    expect(game.ball.x).toBe(game.ball.radius)
    expect(game.ball.y).toBe(game.ball.radius)
    expect(game.ball.dx).toBeGreaterThan(0)
    expect(game.ball.dy).toBeGreaterThan(0)
  })
})
