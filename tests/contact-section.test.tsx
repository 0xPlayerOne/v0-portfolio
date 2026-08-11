import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { SITE_BORDER_COLOR, SITE_BTN_COLOR } from '@/constants/colors'
import { CONTACT_CONTENT, CONTACT_LINKS } from '@/constants/content'
import { ContactSection } from '@/views/contact-section'

// Lock down the exact hrefs produced by the CONTACT_URLS platform builders
// (handles are normalized by stripping the leading '@').
const EXPECTED_URLS: Record<(typeof CONTACT_LINKS)[number]['platform'], string> = {
  Twitter: 'https://twitter.com/0xPlayerOne',
  GitHub: 'https://github.com/0xPlayerOne',
  LinkedIn: 'https://linkedin.com/in/AMahoneyFernandes',
}

describe('ContactSection', () => {
  it('renders the title, description, and every contact card with platform URLs', () => {
    render(<ContactSection />)

    expect(screen.getByRole('heading', { name: CONTACT_CONTENT.title })).not.toBeNull()
    expect(screen.getByText(CONTACT_CONTENT.description)).not.toBeNull()

    for (const link of CONTACT_LINKS) {
      const anchor = screen.getByRole('link', { name: new RegExp(link.platform, 'i') })
      expect(anchor.getAttribute('href')).toBe(EXPECTED_URLS[link.platform])
      expect(anchor.getAttribute('target')).toBe('_blank')
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })

  it('applies the hover box-shadow on mouse enter and restores it on mouse leave', () => {
    const { container } = render(<ContactSection />)

    const card = container.querySelector<HTMLElement>('.cursor-pointer')
    expect(card).not.toBeNull()

    const restShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR}40`
    const hoverShadow = `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 20px ${SITE_BTN_COLOR}40`

    expect(card!.style.boxShadow).toBe(restShadow)

    fireEvent.mouseEnter(card!)
    expect(card!.style.boxShadow).toBe(hoverShadow)

    fireEvent.mouseLeave(card!)
    expect(card!.style.boxShadow).toBe(restShadow)
  })

  it('builds the anti-spam mailto link when the connect button is clicked', () => {
    let assignedHref = ''
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      get: () => assignedHref,
      set: (value: string) => {
        assignedHref = value
      },
    })

    render(<ContactSection />)
    fireEvent.click(screen.getByRole('button', { name: /Let.s Connect/i }))

    // Anti-spam email encoding: address is assembled at click time, never rendered.
    expect(assignedHref).toBe(
      'mailto:contact@andrewmf.com?subject=Hello%20from%20your%20website!' +
        '&body=Hi%20Andrew%2C%0A%0AI%20found%20your%20website%20and%20would%20like' +
        '%20to%20connect.%0A%0ABest%20regards%2C'
    )
  })
})
