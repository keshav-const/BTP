import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../page'
import productsApi from '@/api/products'
import type { Product } from '@/types/product'

vi.mock('@/api/products', () => ({
  default: {
    list: vi.fn(),
  },
}))

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    price: 1299.99,
    category: 'Electronics',
    images: ['https://example.com/laptop.jpg'],
    description: 'High-end laptop',
    stock: 10,
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 299.99,
    category: 'Audio',
    images: ['https://example.com/headphones.jpg'],
    description: 'Premium headphones',
    stock: 20,
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 399.99,
    category: 'Wearables',
    images: ['https://example.com/watch.jpg'],
    description: 'Premium smartwatch',
    stock: 15,
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    price: 199.99,
    category: 'Audio',
    images: ['https://example.com/speaker.jpg'],
    description: 'Portable speaker',
    stock: 25,
  },
]

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(productsApi.list).mockResolvedValue({
      items: mockProducts,
      pagination: {
        page: 1,
        limit: 4,
        total: 4,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    })
  })

  it('renders the hero section with main heading', () => {
    render(<HomePage />)
    
    expect(screen.getByRole('heading', { level: 1, name: /welcome to premium/i })).toBeInTheDocument()
  })

  it('displays hero badge with sparkles icon', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/handcrafted excellence/i)).toBeInTheDocument()
  })

  it('renders hero CTAs with correct links', () => {
    render(<HomePage />)
    
    const shopNowLink = screen.getByRole('link', { name: /shop now/i })
    const learnMoreLink = screen.getByRole('link', { name: /learn more/i })
    
    expect(shopNowLink).toHaveAttribute('href', '/products')
    expect(learnMoreLink).toHaveAttribute('href', '/about')
  })

  it('renders features section with all features', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/the elevated experience/i)).toBeInTheDocument()
    expect(screen.getByText(/quality guaranteed/i)).toBeInTheDocument()
    expect(screen.getByText(/fast shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/premium support/i)).toBeInTheDocument()
    expect(screen.getByText(/customer first/i)).toBeInTheDocument()
    expect(screen.getByText(/instant updates/i)).toBeInTheDocument()
    expect(screen.getByText(/best in class/i)).toBeInTheDocument()
  })

  it('fetches and displays featured products', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(productsApi.list).toHaveBeenCalledWith({ limit: 4 })
    })
    
    await waitFor(() => {
      expect(screen.getByText('Premium Laptop')).toBeInTheDocument()
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
      expect(screen.getByText('Smart Watch')).toBeInTheDocument()
      expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument()
    })
  })

  it('handles products API error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(productsApi.list).mockRejectedValue(new Error('API Error'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to fetch featured products:',
        expect.any(Error)
      )
    })
    
    consoleError.mockRestore()
  })

  it('renders stats section with animated counters', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/by the numbers/i)).toBeInTheDocument()
    expect(screen.getByText(/happy customers/i)).toBeInTheDocument()
    expect(screen.getAllByText(/products/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/countries/i)).toBeInTheDocument()
    expect(screen.getByText(/customer rating/i)).toBeInTheDocument()
  })

  it('renders testimonials section', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/what our customers say/i)).toBeInTheDocument()
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument()
  })

  it('allows testimonial navigation', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    const buttons = screen.getAllByRole('button', { name: /view testimonial/i })
    expect(buttons).toHaveLength(3)
    
    await user.click(buttons[1])
    
    await waitFor(() => {
      expect(screen.getByText(/michael chen/i)).toBeInTheDocument()
    })
  })

  it('renders newsletter section with email form', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/stay connected/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('has proper semantic HTML structure', () => {
    const { container } = render(<HomePage />)
    
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
    
    const heading1 = container.querySelector('h1')
    expect(heading1).toBeInTheDocument()
    
    const heading2s = container.querySelectorAll('h2')
    expect(heading2s.length).toBeGreaterThan(0)
  })

  it('renders view all products link', () => {
    render(<HomePage />)
    
    const viewAllLink = screen.getByRole('link', { name: /view all products/i })
    expect(viewAllLink).toHaveAttribute('href', '/products')
  })
})
