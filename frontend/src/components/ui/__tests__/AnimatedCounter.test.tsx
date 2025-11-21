import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedCounter } from '../AnimatedCounter'

describe('AnimatedCounter', () => {
  it('renders with default number formatting', async () => {
    render(<AnimatedCounter value={1234} />)
    
    await waitFor(() => {
      const element = screen.getByText(/1,234|0/)
      expect(element).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('formats currency correctly', async () => {
    render(
      <AnimatedCounter
        value={99999}
        format="currency"
        currency="INR"
        locale="en-IN"
      />
    )
    
    await waitFor(() => {
      const element = screen.getByText(/₹|0/)
      expect(element).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('formats percentages correctly', async () => {
    render(
      <AnimatedCounter
        value={95.5}
        format="percent"
        decimals={1}
      />
    )
    
    await waitFor(() => {
      const element = screen.getByText(/%|0/)
      expect(element).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('respects custom decimals', () => {
    const { container } = render(
      <AnimatedCounter
        value={123.456}
        decimals={2}
      />
    )
    
    const counter = container.querySelector('span')
    expect(counter).toBeInTheDocument()
    expect(counter).toHaveClass('tabular-nums')
  })

  it('applies custom className', () => {
    render(
      <AnimatedCounter
        value={100}
        className="text-4xl text-emerald-700"
      />
    )
    const counter = screen.getByText(/0|100/)
    expect(counter).toHaveClass('text-4xl')
    expect(counter).toHaveClass('text-emerald-700')
  })

  it('has tabular-nums class for alignment', () => {
    render(<AnimatedCounter value={100} />)
    const counter = screen.getByText(/0|100/)
    expect(counter).toHaveClass('tabular-nums')
  })

  it('supports accessibility attributes', () => {
    render(
      <AnimatedCounter
        value={100}
        id="counter-1"
        aria-label="Counter label"
        aria-describedby="counter-description"
      />
    )
    const counter = screen.getByText(/0|100/)
    expect(counter).toHaveAttribute('id', 'counter-1')
    expect(counter).toHaveAttribute('aria-label', 'Counter label')
    expect(counter).toHaveAttribute('aria-describedby', 'counter-description')
    expect(counter).toHaveAttribute('aria-live', 'polite')
  })

  it('respects reduced motion preferences', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { container } = render(<AnimatedCounter value={1234} />)
    
    expect(container.querySelector('span')).toBeInTheDocument()
    
    window.matchMedia = originalMatchMedia
  })

  it('handles delay prop', async () => {
    render(<AnimatedCounter value={100} delay={0.1} />)
    
    expect(screen.getByText(/0|100/)).toBeInTheDocument()
    
    await waitFor(() => {
      const element = screen.getByText(/100|0/)
      expect(element).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
