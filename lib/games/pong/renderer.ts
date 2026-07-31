import type { GameState, Pixel, Particle, Paddle } from './types'

// Optimized renderer with batched rendering and reduced state changes
export function render(ctx: CanvasRenderingContext2D, game: GameState): void {
  const { width, height, pixels, ball, paddles, particles, colors, score } = game

  // Clear canvas
  ctx.fillStyle = colors.background
  ctx.fillRect(0, 0, width, height)

  // Batch render pixels by hit state to reduce context switches
  renderPixels(ctx, pixels, colors)

  // Batch render particles
  if (particles.length > 0) {
    renderParticles(ctx, particles, colors.pixel)
  }

  // Render ball with optimized shadow
  renderBall(ctx, ball, colors.ball)

  // Batch render paddles
  renderPaddles(ctx, paddles, colors.paddle)

  // Render score
  ctx.fillStyle = colors.pixel // NEON_GREEN for text
  ctx.strokeStyle = colors.hitPixel // DARK_NEON_GREEN for border
  ctx.lineWidth = 1
  ctx.font = '24px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const scoreText = `Score: ${score}`
  ctx.fillText(scoreText, 20, 20)
  ctx.strokeText(scoreText, 20, 20)
}

// Optimized pixel rendering with batching by hit state — two in-place passes
// keep the batched fillStyle/shadowBlur setup without allocating filtered
// arrays on every frame of the animation loop.
function renderPixels(
  ctx: CanvasRenderingContext2D,
  pixels: Pixel[],
  colors: GameState['colors']
): void {
  // First render non-hit pixels
  let nonHitBatchStarted = false
  for (const pixel of pixels) {
    if (pixel.hit) continue

    if (!nonHitBatchStarted) {
      nonHitBatchStarted = true
      ctx.shadowColor = colors.pixel
      ctx.shadowBlur = pixel.size * 0.5
      ctx.fillStyle = colors.pixel
    }
    ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
  }

  // Then render hit pixels
  let hitBatchStarted = false
  for (const pixel of pixels) {
    if (!pixel.hit) continue

    if (!hitBatchStarted) {
      hitBatchStarted = true
      ctx.shadowColor = colors.hitPixel
      ctx.shadowBlur = pixel.size * 0.5
      ctx.fillStyle = colors.hitPixel
    }
    ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
  }
}

// Optimized particle rendering
function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  color: string
): void {
  ctx.fillStyle = color

  for (const particle of particles) {
    ctx.globalAlpha = particle.alpha
    ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2)
  }

  // Reset alpha
  ctx.globalAlpha = 1
}

// Optimized ball rendering
function renderBall(ctx: CanvasRenderingContext2D, ball: GameState['ball'], color: string): void {
  ctx.shadowColor = color
  ctx.shadowBlur = ball.radius * 1.5
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fill()
}

// Optimized paddle rendering
function renderPaddles(ctx: CanvasRenderingContext2D, paddles: Paddle[], color: string): void {
  ctx.shadowColor = color
  ctx.shadowBlur = 8
  ctx.fillStyle = color

  for (const paddle of paddles) {
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
  }

  // Reset shadow
  ctx.shadowBlur = 0
}
