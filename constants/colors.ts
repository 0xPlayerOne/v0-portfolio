// The site palette lives in src/styles/globals.css as @theme tokens; reference
// colors from JS via var(--color-*) when a style value is needed. Canvas 2D
// APIs cannot resolve CSS variables, so the pong palette keeps literal hex.
const BG = '#18161a' // Modern black with grey undertone
const NEON_GREEN = '#33FF33' // Bright, vivid green
const DARK_NEON_GREEN = '#226622' // Darker green with glow
const NEON_PURPLE = '#9933FF' // Bright, vivid purple

// ===== PONG GAME COLORS =====
export const CANVAS_COLOR = BG
export const BALL_COLOR = NEON_PURPLE
export const PADDLE_COLOR = NEON_PURPLE
export const PIXEL_COLOR = NEON_GREEN
export const HIT_COLOR = DARK_NEON_GREEN
