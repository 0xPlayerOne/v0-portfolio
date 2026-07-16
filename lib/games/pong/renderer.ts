<<<<<<< HEAD
import type { GameState, Pixel, Particle, Paddle } from './types'

// Cache for pixel rendering to avoid redundant state changes
let lastPixelHit = false
let lastPixelColor = ''
=======
import type { GameState, Pixel, Particle, Paddle } from "./types";
>>>>>>> origin/staging

// Optimized renderer with batched rendering and reduced state changes
export function render(ctx: CanvasRenderingContext2D, game: GameState): void {
  const { width, height, pixels, ball, paddles, particles, colors, score } =
    game;

  // Clear canvas
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  // Batch render pixels by hit state to reduce context switches
  renderPixels(ctx, pixels, colors);

  // Batch render particles
  if (particles.length > 0) {
    renderParticles(ctx, particles, colors.pixel);
  }

  // Render ball with optimized shadow
  renderBall(ctx, ball, colors.ball);

  // Batch render paddles
  renderPaddles(ctx, paddles, colors.paddle);

  // Render score
<<<<<<< HEAD
  ctx.fillStyle = colors.pixel // NEON_GREEN for text
  ctx.strokeStyle = colors.hitPixel // DARK_NEON_GREEN for border
  ctx.lineWidth = 1
  ctx.font = '24px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const scoreText = `Score: ${score}`
  ctx.fillText(scoreText, 20, 20)
  ctx.strokeText(scoreText, 20, 20)
=======
  ctx.fillStyle = colors.pixel; // NEON_GREEN for text
  ctx.strokeStyle = colors.hitPixel; // DARK_NEON_GREEN for border
  ctx.lineWidth = 1;
  ctx.font = "24px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const scoreText = `Score: ${score}`;
  ctx.fillText(scoreText, 20, 20);
  ctx.strokeText(scoreText, 20, 20);
>>>>>>> origin/staging
}

// Optimized pixel rendering with batching by hit state
function renderPixels(
  ctx: CanvasRenderingContext2D,
  pixels: Pixel[],
<<<<<<< HEAD
  colors: GameState['colors']
): void {
  // First render non-hit pixels
  const nonHitPixels = pixels.filter((p) => !p.hit)
  const hitPixels = pixels.filter((p) => p.hit)

  if (nonHitPixels.length > 0) {
    ctx.shadowColor = colors.pixel
    ctx.shadowBlur = nonHitPixels[0].size * 0.5
    ctx.fillStyle = colors.pixel
=======
  colors: GameState["colors"],
): void {
  // First render non-hit pixels
  const nonHitPixels = pixels.filter((p) => !p.hit);
  const hitPixels = pixels.filter((p) => p.hit);

  if (nonHitPixels.length > 0) {
    ctx.shadowColor = colors.pixel;
    ctx.shadowBlur = nonHitPixels[0].size * 0.5;
    ctx.fillStyle = colors.pixel;
>>>>>>> origin/staging

    for (const pixel of nonHitPixels) {
      ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    }
  }

  if (hitPixels.length > 0) {
<<<<<<< HEAD
    ctx.shadowColor = colors.hitPixel
    ctx.shadowBlur = hitPixels[0].size * 0.5
    ctx.fillStyle = colors.hitPixel
=======
    ctx.shadowColor = colors.hitPixel;
    ctx.shadowBlur = hitPixels[0].size * 0.5;
    ctx.fillStyle = colors.hitPixel;
>>>>>>> origin/staging

    for (const pixel of hitPixels) {
      ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    }
  }
}

// Optimized particle rendering
function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
<<<<<<< HEAD
  color: string
): void {
  ctx.fillStyle = color
=======
  color: string,
): void {
  ctx.fillStyle = color;
>>>>>>> origin/staging

  for (const particle of particles) {
    ctx.globalAlpha = particle.alpha;
    ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
  }

  // Reset alpha
  ctx.globalAlpha = 1;
}

// Optimized ball rendering
function renderBall(
  ctx: CanvasRenderingContext2D,
  ball: GameState["ball"],
  color: string,
): void {
  ctx.shadowColor = color;
  ctx.shadowBlur = ball.radius * 1.5;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Optimized paddle rendering
<<<<<<< HEAD
function renderPaddles(ctx: CanvasRenderingContext2D, paddles: Paddle[], color: string): void {
  ctx.shadowColor = color
  ctx.shadowBlur = 8
  ctx.fillStyle = color
=======
function renderPaddles(
  ctx: CanvasRenderingContext2D,
  paddles: Paddle[],
  color: string,
): void {
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fillStyle = color;
>>>>>>> origin/staging

  for (const paddle of paddles) {
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  // Reset shadow
  ctx.shadowBlur = 0;
}
