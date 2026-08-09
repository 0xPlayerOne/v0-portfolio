import { describe, expect, it, spyOn } from 'bun:test'
import { createGame, updateGame } from './game'
import { PARTICLE_COUNT, PARTICLE_LIFE } from './constants'
import type { PongColors } from './types'

const colors: PongColors = {
  ball: '#9933FF',
  paddle: '#9933FF',
  pixel: '#33FF33',
  hitPixel: '#226622',
  background: '#18161a',
}

describe('createGame', () => {
  it('builds a valid initial state with 4 paddles and zero score', () => {
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])

    expect(game.score).toBe(0)
    expect(game.width).toBe(1000)
    expect(game.height).toBe(600)
    expect(game.paddles).toHaveLength(4)
    // 2 vertical (left/right) + 2 horizontal (top/bottom)
    expect(game.paddles.filter((p) => p.isVertical)).toHaveLength(2)
    expect(game.paddles.filter((p) => !p.isVertical)).toHaveLength(2)
    // Ball starts at 80% width / 30% height with the scaled diagonal velocity
    expect(game.ball).toMatchObject({ x: 800, y: 180, dx: -8, dy: 8 })
  })

  it('places vertical paddles on the left and right edges', () => {
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])
    const left = game.paddles.find((p) => p.isVertical && p.x === 0)!
    const right = game.paddles.find((p) => p.isVertical && p.x > 0)!
    expect(left).toBeDefined()
    expect(right.x).toBeCloseTo(1000 - right.width, 5)
  })

  it('generates pixel text from the header (non-empty when text is provided)', () => {
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])
    expect(game.pixels.length).toBeGreaterThan(0)
    // no pixel should start already "hit"
    expect(game.pixels.every((p) => p.hit === false)).toBe(true)
  })

  it('scales dimensions with the smaller aspect ratio', () => {
    const small = createGame(500, 300, colors, ['YE', 'WEST'])
    const normal = createGame(2000, 600, colors, ['YE', 'WEST'])
    // scale = min(width/1000, height/600); small -> 0.5, normal -> 1
    expect(small.scale).toBeCloseTo(0.5, 5)
    expect(normal.scale).toBeCloseTo(1, 5)
    expect(small.scale).toBeLessThan(normal.scale)
  })
})

describe('updateGame', () => {
  it('keeps the ball inside the playfield after many ticks', () => {
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])
    for (let i = 0; i < 500; i++) {
      updateGame(game)
    }
    const { ball, width, height } = game
    expect(ball.x).toBeGreaterThanOrEqual(0)
    expect(ball.x).toBeLessThanOrEqual(width)
    expect(ball.y).toBeGreaterThanOrEqual(0)
    expect(ball.y).toBeLessThanOrEqual(height)
  })

  it('moves the ball from its starting position', () => {
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])
    const startX = game.ball.x
    const startY = game.ball.y
    updateGame(game)
    // ball has non-zero velocity, so position must change
    expect(game.ball.x).not.toBe(startX)
    expect(game.ball.y).not.toBe(startY)
  })

  it('increments score when the ball collides with a pixel', () => {
    // The header text ("YE"/"WEST") is rendered as pixels across the center of
    // the field. Over enough ticks the moving ball must strike at least one
    // pixel and raise the score. This asserts the collision -> score path works.
    const game = createGame(1000, 600, colors, ['YE', 'WEST'])
    const before = game.score
    let scored = false
    for (let i = 0; i < 4000; i++) {
      updateGame(game)
      if (game.score > before) {
        scored = true
        break
      }
    }
    expect(scored).toBe(true)
    expect(game.score).toBeGreaterThan(before)
  })

  it('clamps the ball to every boundary on exact-edge collisions', () => {
    const game = createGame(400, 300, colors, ['A', 'B'])
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

  it('marks a pixel hit, updates the score, and expires particles', () => {
    spyOn(Math, 'random').mockReturnValue(0.5)
    const game = createGame(600, 400, colors, ['A', 'B'])
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
