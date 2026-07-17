export interface PongColors {
  background: string
  pixel: string
  hitPixel: string
  ball: string
  paddle: string
}

export interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

export interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetX: number
  targetY: number
  isVertical: boolean
}

export interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  alpha: number
  life: number
}

export interface GameState {
  width: number
  height: number
  scale: number
  pixels: Pixel[]
  ball: Ball
  paddles: Paddle[]
  particles: Particle[]
  colors: PongColors
  score: number
}
