import type { GameState, PongColors, Pixel, Particle } from './types'
import {
  BALL_SPEED,
  BALL_SIZE,
  PADDLE_WIDTH,
  PADDLE_LENGTH,
  PADDLE_SPEED,
  LARGE_PIXEL_SIZE,
  SMALL_PIXEL_SIZE,
  LETTER_SPACING,
  TEXT_WIDTH_FACTOR,
  TEXT_SPACING_FACTOR,
  PIXEL_MAP,
  PARTICLE_COUNT,
  PARTICLE_LIFE,
  PARTICLE_DECAY,
} from './constants'

// Create a game state with optimized initialization
export function createGame(
  width: number,
  height: number,
  colors: PongColors,
  headerText: string[]
): GameState {
  const scale = Math.min(width / 1000, height / 600)
  const ballRadius = Math.max(3, BALL_SIZE * scale)
  const paddleWidth = Math.max(4, PADDLE_WIDTH * scale)
  const paddleLength = Math.max(20, PADDLE_LENGTH * scale)

  // Pre-calculate common values
  const halfPaddleLength = paddleLength / 2
  const verticalPaddleY = height / 2 - halfPaddleLength
  const horizontalPaddleX = width / 2 - halfPaddleLength

  return {
    score: 0,
    width,
    height,
    scale,
    pixels: generateText(width, height, scale, headerText),
    ball: {
      x: width * 0.8,
      y: height * 0.3,
      dx: -BALL_SPEED * scale,
      dy: BALL_SPEED * scale,
      radius: ballRadius,
    },
    paddles: [
      // Left paddle
      {
        x: 0,
        y: verticalPaddleY,
        width: paddleWidth,
        height: paddleLength,
        targetX: 0,
        targetY: verticalPaddleY,
        isVertical: true,
      },
      // Right paddle
      {
        x: width - paddleWidth,
        y: verticalPaddleY,
        width: paddleWidth,
        height: paddleLength,
        targetX: width - paddleWidth,
        targetY: verticalPaddleY,
        isVertical: true,
      },
      // Top paddle
      {
        x: horizontalPaddleX,
        y: 0,
        width: paddleLength,
        height: paddleWidth,
        targetX: horizontalPaddleX,
        targetY: 0,
        isVertical: false,
      },
      // Bottom paddle
      {
        x: horizontalPaddleX,
        y: height - paddleWidth,
        width: paddleLength,
        height: paddleWidth,
        targetX: horizontalPaddleX,
        targetY: height - paddleWidth,
        isVertical: false,
      },
    ],
    particles: [],
    colors,
  }
}

// Optimized game update logic
export function updateGame(game: GameState): GameState {
  updateBall(game)
  updatePaddles(game)
  const newParticles = checkPixelCollisions(game)
  updateParticles(game, newParticles)

  return game
}

// Separated ball update logic for better organization and performance
function updateBall(game: GameState): void {
  const { ball, width, height } = game

  // Update ball position
  ball.x += ball.dx
  ball.y += ball.dy

  // Boundary collisions with optimized checks
  if (ball.y <= ball.radius) {
    ball.y = ball.radius
    ball.dy = Math.abs(ball.dy)
  } else if (ball.y >= height - ball.radius) {
    ball.y = height - ball.radius
    ball.dy = -Math.abs(ball.dy)
  }

  if (ball.x <= ball.radius) {
    ball.x = ball.radius
    ball.dx = Math.abs(ball.dx)
  } else if (ball.x >= width - ball.radius) {
    ball.x = width - ball.radius
    ball.dx = -Math.abs(ball.dx)
  }
}

// Separated paddle update logic
function updatePaddles(game: GameState): void {
  const { ball, paddles, width, height } = game

  for (const paddle of paddles) {
    // Update paddle target position
    if (paddle.isVertical) {
      const paddleCenter = paddle.height / 2
      const offset = paddleCenter * 0.33 * (ball.dy > 0 ? 1 : -1)
      paddle.targetY = Math.max(0, Math.min(height - paddle.height, ball.y - paddleCenter - offset))
      paddle.y += (paddle.targetY - paddle.y) * PADDLE_SPEED
    } else {
      const paddleCenter = paddle.width / 2
      const offset = paddleCenter * 0.33 * (ball.dx > 0 ? 1 : -1)
      paddle.targetX = Math.max(0, Math.min(width - paddle.width, ball.x - paddleCenter - offset))
      paddle.x += (paddle.targetX - paddle.x) * PADDLE_SPEED
    }

    // Check for paddle collision
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height
    ) {
      handlePaddleCollision(ball, paddle)
    }
  }
}

// Handle paddle collision with optimized calculations
function handlePaddleCollision(ball: GameState['ball'], paddle: GameState['paddles'][0]): void {
  if (paddle.isVertical) {
    const isLeftSide = ball.x < paddle.x + paddle.width / 2
    ball.dx = isLeftSide ? -Math.abs(ball.dx) : Math.abs(ball.dx)
    ball.x = isLeftSide ? paddle.x - ball.radius - 1 : paddle.x + paddle.width + ball.radius + 1
  } else {
    const isTopSide = ball.y < paddle.y + paddle.height / 2
    ball.dy = isTopSide ? -Math.abs(ball.dy) : Math.abs(ball.dy)
    ball.y = isTopSide ? paddle.y - ball.radius - 1 : paddle.y + paddle.height + ball.radius + 1
  }
}

// Check for pixel collisions and return new particles
function checkPixelCollisions(game: GameState): Particle[] {
  const { ball, pixels } = game
  const newParticles: Particle[] = []

  // Only check non-hit pixels for collision
  const activePixels = pixels.filter((pixel) => !pixel.hit)

  for (const pixel of activePixels) {
    if (
      ball.x + ball.radius > pixel.x &&
      ball.x - ball.radius < pixel.x + pixel.size &&
      ball.y + ball.radius > pixel.y &&
      ball.y - ball.radius < pixel.y + pixel.size
    ) {
      pixel.hit = true
      game.score++

      // Create particles
      createParticles(pixel, newParticles)

      // Handle ball bounce
      const centerX = pixel.x + pixel.size / 2
      const centerY = pixel.y + pixel.size / 2
      if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
        ball.dx = -ball.dx
      } else {
        ball.dy = -ball.dy
      }
    }
  }

  return newParticles
}

// Create particles for pixel collision
function createParticles(pixel: Pixel, particles: Particle[]): void {
  const centerX = pixel.x + pixel.size / 2
  const centerY = pixel.y + pixel.size / 2

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.5 + Math.random() * 1.5
    particles.push({
      x: centerX,
      y: centerY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      alpha: 1,
      life: 0,
    })
  }
}

// Update existing particles and add new ones
function updateParticles(game: GameState, newParticles: Particle[]): void {
  // Update existing particles
  game.particles = [...game.particles, ...newParticles].filter((p) => {
    p.x += p.dx
    p.y += p.dy
    p.life++
    p.alpha = 1 - p.life / PARTICLE_LIFE
    p.dx *= PARTICLE_DECAY
    p.dy *= PARTICLE_DECAY
    return p.life < PARTICLE_LIFE
  })
}

// Optimized text generation with memoization for character maps
const charMapCache = new Map<string, number[][]>()

function generateText(width: number, height: number, scale: number, headerText: string[]): Pixel[] {
  const pixels: Pixel[] = []
  const [largeText, smallText] = headerText

  const largePx = LARGE_PIXEL_SIZE * scale
  const smallPx = SMALL_PIXEL_SIZE * scale

  // Calculate text dimensions
  const largeWidth = getTextWidth(largeText, largePx)
  const smallWidth = getTextWidth(smallText, smallPx)
  const maxWidth = Math.max(largeWidth, smallWidth)

  // Scale to fit
  const scaleFactor = (width * TEXT_WIDTH_FACTOR) / maxWidth
  const adjustedLargePx = largePx * scaleFactor
  const adjustedSmallPx = smallPx * scaleFactor

  // Position text
  const largeHeight = TEXT_SPACING_FACTOR * adjustedLargePx * 5
  const spacing = TEXT_SPACING_FACTOR * adjustedLargePx
  const smallHeight = TEXT_SPACING_FACTOR * adjustedSmallPx * 5
  const totalHeight = largeHeight + spacing + smallHeight
  let y = (height - totalHeight) / 2

  // Add large text
  addText(largeText, width, y, adjustedLargePx, pixels)
  y += largeHeight + spacing

  // Add small text
  addText(smallText, width, y, adjustedSmallPx, pixels)

  return pixels
}

function addText(
  text: string,
  canvasWidth: number,
  startY: number,
  pixelSize: number,
  pixels: Pixel[]
): void {
  const textWidth = getTextWidth(text, pixelSize)
  let x = (canvasWidth - textWidth) / 2

  for (const char of text) {
    // Get character map from cache or create new one
    let map = charMapCache.get(char)
    if (!map) {
      map = PIXEL_MAP[char as keyof typeof PIXEL_MAP]
      if (map) {
        charMapCache.set(char, map)
      }
    }

    if (map) {
      map.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell) {
            pixels.push({
              x: x + j * pixelSize,
              y: startY + i * pixelSize,
              size: pixelSize,
              hit: false,
            })
          }
        })
      })
      x += (map[0].length + LETTER_SPACING) * pixelSize
    }
  }
}

// Optimized text width calculation with caching
const textWidthCache = new Map<string, number>()

function getTextWidth(text: string, pixelSize: number): number {
  const cacheKey = `${text}-${pixelSize}`
  if (textWidthCache.has(cacheKey)) {
    return textWidthCache.get(cacheKey)!
  }

  let width = 0
  for (const char of text) {
    const charWidth = PIXEL_MAP[char as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
    width += (charWidth + LETTER_SPACING) * pixelSize
  }

  const result = width - LETTER_SPACING * pixelSize
  textWidthCache.set(cacheKey, result)
  return result
}
