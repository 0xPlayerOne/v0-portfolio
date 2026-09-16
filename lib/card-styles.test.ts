import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { useCardHover } from './card-styles'

describe('useCardHover', () => {
  it('returns mouse enter and leave handlers', () => {
    const { result } = renderHook(() => useCardHover())
    expect(result.current.handleMouseEnter).toBeInstanceOf(Function)
    expect(result.current.handleMouseLeave).toBeInstanceOf(Function)
  })

  it('applies enter box-shadow on mouseenter', () => {
    const { result } = renderHook(() => useCardHover())
    const element = document.createElement('div')

    result.current.handleMouseEnter({
      currentTarget: element,
    } as unknown as React.MouseEvent<HTMLDivElement>)

    expect(element.style.boxShadow).toContain('0 0 0 1px')
    expect(element.style.boxShadow).toContain('var(--color-site-border)')
    expect(element.style.boxShadow).toContain('20px')
    expect(element.style.boxShadow).toContain('var(--color-site-btn-40)')
  })

  it('applies leave box-shadow on mouseleave', () => {
    const { result } = renderHook(() => useCardHover())
    const element = document.createElement('div')

    result.current.handleMouseLeave({
      currentTarget: element,
    } as unknown as React.MouseEvent<HTMLDivElement>)

    expect(element.style.boxShadow).toContain('0 0 0 1px')
    expect(element.style.boxShadow).toContain('10px')
    expect(element.style.boxShadow).toContain('var(--color-site-border-40)')
  })

  it('uses custom enter and leave sizes/glow', () => {
    const { result } = renderHook(() =>
      useCardHover({
        enterSize: '35px',
        enterGlow: 'var(--color-site-btn-60)',
        leaveSize: '15px',
        leaveGlow: 'var(--color-site-border-60)',
      })
    )
    const enterElement = document.createElement('div')
    const leaveElement = document.createElement('div')

    result.current.handleMouseEnter({
      currentTarget: enterElement,
    } as unknown as React.MouseEvent<HTMLDivElement>)
    result.current.handleMouseLeave({
      currentTarget: leaveElement,
    } as unknown as React.MouseEvent<HTMLDivElement>)

    expect(enterElement.style.boxShadow).toContain('35px')
    expect(enterElement.style.boxShadow).toContain('var(--color-site-btn-60)')
    expect(leaveElement.style.boxShadow).toContain('15px')
    expect(leaveElement.style.boxShadow).toContain('var(--color-site-border-60)')
  })

  it('applies enter shadow before leave shadow on the same element', () => {
    const { result } = renderHook(() => useCardHover())
    const element = document.createElement('div')

    result.current.handleMouseEnter({
      currentTarget: element,
    } as unknown as React.MouseEvent<HTMLDivElement>)
    const enterShadow = element.style.boxShadow

    result.current.handleMouseLeave({
      currentTarget: element,
    } as unknown as React.MouseEvent<HTMLDivElement>)
    const leaveShadow = element.style.boxShadow

    expect(enterShadow).not.toBe(leaveShadow)
    expect(enterShadow).toContain('20px')
    expect(leaveShadow).toContain('10px')
  })
})
