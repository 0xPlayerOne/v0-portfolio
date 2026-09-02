import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, spyOn } from 'bun:test'

import { ProjectsSection } from '@/views/projects-section'

describe('ProjectsSection – error handling', () => {
  it('shows fallback error UI when the projects API is unavailable', async () => {
    const errSpy = spyOn(console, 'error').mockImplementation(() => undefined)
    const fetchSpy = spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    render(<ProjectsSection />)

    // loading skeleton first
    expect(document.querySelector('.animate-pulse')).not.toBeNull()

    await waitFor(() => {
      expect(screen.getByText(/Failed to load projects/)).not.toBeNull()
    })
    expect(errSpy).toHaveBeenCalled()
    expect(fetchSpy).toHaveBeenCalledWith('/api/projects', expect.anything())

    errSpy.mockRestore()
    fetchSpy.mockRestore()
  })
})
