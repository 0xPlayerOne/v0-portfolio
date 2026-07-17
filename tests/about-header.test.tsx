import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {beforeEach, describe, expect, it, mock, spyOn} from 'bun:test'

const smoothScrollToSection = mock()
const useScrollSpy = mock(() => 'skills')

mock.module('@/lib/smooth-scroll', () => ({ smoothScrollToSection }))
mock.module('@/hooks/use-scroll-spy', () => ({ useScrollSpy }))
mock.module('@/lib/games/pong', () => ({
  PongGame: ({ navbarHeight, headerText }: { navbarHeight: number; headerText: string[] }) => (
    <div data-testid="pong-game" data-navbar-height={navbarHeight}>
      {headerText.join(' / ')}
    </div>
  ),
}))

import { PongHeader } from '@/components/header'
import { AboutSection } from '@/views/about-section'

beforeEach(() => {
  mock.restore()
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 900,
  })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0)
    return 1
  })
})

describe('AboutSection', () => {
  it('renders overview values and drives their hover styles', () => {
    render(<AboutSection />)

    expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument()
    expect(screen.getByText('Innovation')).toBeInTheDocument()
    expect(screen.getByText('Years Experience')).toBeInTheDocument()
    expect(screen.getByText('10+')).toBeInTheDocument()

    const valueCard = screen.getByText('Innovation').closest('div[class]')?.parentElement
    if (!valueCard) throw new Error('Innovation card was not rendered')
    fireEvent.mouseEnter(valueCard)
    expect(valueCard.style.boxShadow).toContain('20px')
    fireEvent.mouseLeave(valueCard)
    expect(valueCard.style.boxShadow).toContain('10px')

    const statCard = screen.getByText('10+').closest('div[class]')?.parentElement
    if (!statCard) throw new Error('Experience card was not rendered')
    fireEvent.mouseEnter(statCard)
    expect(statCard.style.boxShadow).toContain('25px')
    fireEvent.mouseLeave(statCard)
    expect(statCard.style.boxShadow).toContain('10px')
  })

  it('switches to the journey timeline and back to the overview', () => {
    render(<AboutSection />)

    fireEvent.click(screen.getByRole('button', { name: 'Journey' }))
    expect(screen.getByText('Started Coding')).toBeInTheDocument()
    expect(screen.getByText('Founded Nifty League')).toBeInTheDocument()
    expect(screen.queryByText('Innovation')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Overview' }))
    expect(screen.getByText('Innovation')).toBeInTheDocument()
  })
})

describe('PongHeader', () => {
  it('renders the game and active navigation behavior', () => {
    render(<PongHeader />)

    expect(screen.getByTestId('pong-game')).toHaveAttribute('data-navbar-height', '100')
    expect(screen.getByTestId('pong-game')).toHaveTextContent('ANDREW M-F / CEO OF NIFTY LEAGUE')
    expect(useScrollSpy).toHaveBeenCalledWith({
      sectionIds: ['about', 'skills', 'projects', 'contact'],
      offset: 150,
    })

    const skills = screen.getByRole('button', { name: 'SKILLS' })
    expect(skills.style.borderColor).not.toBe('transparent')
    const about = screen.getByRole('button', { name: 'ABOUT' })
    fireEvent.mouseEnter(about)
    expect(about.style.color).not.toBe('')
    fireEvent.mouseLeave(about)
    fireEvent.click(about)
    expect(smoothScrollToSection).toHaveBeenCalledWith('about', 100)
  })

  it('adds and removes the sticky navigation as the page crosses the header', async () => {
    const { unmount } = render(<PongHeader />)
    expect(screen.getAllByRole('navigation')).toHaveLength(1)

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 801,
    })
    fireEvent.scroll(window)
    await waitFor(() => expect(screen.getAllByRole('navigation')).toHaveLength(2))

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    fireEvent.scroll(window)
    await waitFor(() => expect(screen.getAllByRole('navigation')).toHaveLength(1))
    unmount()
  })

  it('checks sticky state directly when animation frames are unavailable', async () => {
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 900,
    })

    render(<PongHeader />)

    await waitFor(() => expect(screen.getAllByRole('navigation')).toHaveLength(2))
  })
})
