import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlassCard } from '../GlassCard'

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <div>Card Content</div>
      </GlassCard>
    )
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender, container } = render(
      <GlassCard variant="default">Default</GlassCard>
    )
    expect(container.firstChild).toHaveClass('glass-medium')

    rerender(<GlassCard variant="accent">Accent</GlassCard>)
    expect(container.firstChild).toHaveClass('frosted-border')

    rerender(<GlassCard variant="bordered">Bordered</GlassCard>)
    expect(container.firstChild).toHaveClass('glass-heavy')
    expect(container.firstChild).toHaveClass('border-2')
  })

  it('renders with different blur intensities', () => {
    const { rerender, container } = render(
      <GlassCard blurIntensity="light">Content</GlassCard>
    )
    expect(container.firstChild).toHaveClass('backdrop-blur-glass-sm')

    rerender(<GlassCard blurIntensity="medium">Content</GlassCard>)
    expect(container.firstChild).toHaveClass('backdrop-blur-glass-md')

    rerender(<GlassCard blurIntensity="heavy">Content</GlassCard>)
    expect(container.firstChild).toHaveClass('backdrop-blur-glass-heavy')
  })

  it('applies custom className', () => {
    const { container } = render(
      <GlassCard className="custom-class">Content</GlassCard>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with custom element tag', () => {
    render(
      <GlassCard as="article">
        <p>Article content</p>
      </GlassCard>
    )
    const article = screen.getByText('Article content').parentElement
    expect(article?.tagName).toBe('ARTICLE')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(
      <GlassCard onClick={handleClick}>
        Clickable Card
      </GlassCard>
    )
    
    await user.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports accessibility attributes', () => {
    const { container } = render(
      <GlassCard
        id="test-card"
        aria-label="Test card"
        aria-describedby="card-description"
      >
        Content
      </GlassCard>
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveAttribute('id', 'test-card')
    expect(card).toHaveAttribute('aria-label', 'Test card')
    expect(card).toHaveAttribute('aria-describedby', 'card-description')
  })

  it('respects reduced motion preferences', () => {
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

    const { container } = render(
      <GlassCard enableTilt>
        Content
      </GlassCard>
    )
    
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
