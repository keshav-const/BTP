import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="solid">Solid</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-emerald-700')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-2')

    rerender(<Button variant="glass">Glass</Button>)
    expect(screen.getByRole('button')).toHaveClass('glass-medium')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-sm')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-base')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-lg')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders with left icon', () => {
    const TestIcon = () => <span data-testid="left-icon">Icon</span>
    render(<Button leftIcon={<TestIcon />}>With Icon</Button>)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    const TestIcon = () => <span data-testid="right-icon">Icon</span>
    render(<Button rightIcon={<TestIcon />}>With Icon</Button>)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('supports backward compatibility with primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-emerald-700')
  })

  it('has proper WCAG focus outline', () => {
    render(<Button>Focus me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus-visible:ring-2')
    expect(button).toHaveClass('focus-visible:ring-emerald-500')
  })
})
