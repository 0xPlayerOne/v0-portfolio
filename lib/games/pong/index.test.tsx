import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { PongGame } from './index'

// Minimal 2D context stub so the component's render loop executes (happy-dom
// returns null for getContext by default, which would short-circuit the effect).
const stubCtx: any = {
  fillStyle: '',
  strokeStyle: '',
  font: '',
  textAlign: '',
  textBaseline: '',
  globalAlpha: 1,
  lineWidth: 1,
  shadowBlur: 0,
  shadowColor: '',
  fillRect: mock(() => {}),
  clearRect: mock(() => {}),
  beginPath: mock(() => {}),
  arc: mock(() => {}),
  fill: mock(() => {}),
  fillText: mock(() => {}),
  strokeText: mock(() => {}),
  save: mock(() => {}),
  restore: mock(() => {}),
}

beforeEach(() => {
  ;(HTMLCanvasElement.prototype as any).getContext = mock(() => stubCtx)
})

describe('PongGame', () => {
  it('mounts a full-size canvas with the retro pong aria label', () => {
    const { container } = render(
      <PongGame navbarHeight={40} colors={{ background: '#000', pixel: '#0f0', hitPixel: '#0a0', ball: '#fff', paddle: '#fff' }} headerText={['HI','THERE']} />,
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    expect(canvas?.getAttribute('aria-label')).toContain('pong')
    expect(canvas?.className).toContain('block')
  })

  it('initializes a game on the canvas context and starts the loop', () => {
    render(
      <PongGame navbarHeight={40} colors={{ background: '#000', pixel: '#0f0', hitPixel: '#0a0', ball: '#fff', paddle: '#fff' }} headerText={['A', 'B']} />,
    )
    // The stubbed 2d context means the effect reached createGame + render
    expect(stubCtx.fillRect).toHaveBeenCalled()
  })

  it('applies the optional className', () => {
    const { container } = render(
      <PongGame navbarHeight={0} colors={{ background: '#000', pixel: '#0f0', hitPixel: '#0a0', ball: '#0f0', paddle: '#0f0' }} headerText={['X', 'Y']} className="extra" />,
    )
    expect(container.querySelector('canvas')?.className).toContain('extra')
  })
})
