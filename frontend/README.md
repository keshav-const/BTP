# E-Store Frontend

A modern e-commerce frontend application built with Next.js 16, TypeScript, TailwindCSS, and Zustand for state management.

## Features

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Custom Theme**: E-commerce optimized color palette and components
- **Dark Mode Ready**: Built-in dark mode support with CSS variables
- **Smooth Animations**: Tailored animations for better UX

### 🛍️ E-Commerce Components
- Product cards with quick add-to-cart and wishlist functionality
- Product filters (category, price, rating)
- Pagination for large product lists
- Shopping cart with quantity management
- Wishlist management
- Product rating system
- Breadcrumb navigation

### 🔐 Authentication & Authorization
- User login and registration
- JWT-based authentication with automatic token refresh
- Protected routes with AuthGuard middleware
- Role-based access control (admin-only routes)
- Persistent authentication with localStorage

### 🛒 Cart & Wishlist Management
- Add/remove items from cart
- Update quantities
- Real-time cart total calculation
- Wishlist toggle functionality
- Persistent storage with SSR hydration

### 📡 API Integration
- Axios-based HTTP client with interceptors
- Automatic JWT token attachment to requests
- Error handling and 401 response management
- SWR-based data fetching with caching
- Structured API endpoints for auth and products

### 🎯 State Management (Zustand)
- **Auth Store**: User authentication and session management
- **Cart Store**: Shopping cart state
- **Wishlist Store**: Saved items management
- **UI Store**: Toast notifications, modals, and UI state
- localStorage persistence with SSR-safe hydration

### 🔔 Toast Notifications
- Success, error, warning, and info notifications
- Auto-dismissing toasts with customizable duration
- Floating toast container with animations

### 📱 Fully Responsive
- Mobile navigation with hamburger menu
- Adaptive grid layouts
- Touch-friendly buttons and interactions
- Optimized for all screen sizes

## Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Product detail page
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── api/                          # API client functions
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   └── index.ts
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── badge.tsx
│   │   │   └── index.ts
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── container.tsx
│   │   │   └── index.ts
│   │   ├── product-card.tsx
│   │   ├── rating.tsx
│   │   ├── pagination.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── filter-controls.tsx
│   │   ├── toast-container.tsx
│   │   └── index.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-cart.ts
│   │   ├── use-wishlist.ts
│   │   ├── use-fetch.ts
│   │   ├── use-toast.ts
│   │   └── index.ts
│   ├── lib/                          # Utility libraries
│   │   ├── axios-instance.ts         # Configured Axios client
│   │   ├── auth.ts                   # Auth utilities
│   │   ├── error-handler.ts          # API error handling
│   │   ├── fetcher.ts                # SWR fetcher
│   │   └── index.ts
│   ├── middleware/                   # Route protection
│   │   └── auth-guard.tsx
│   ├── providers/                    # React providers
│   │   ├── hydration-provider.tsx
│   │   └── index.tsx
│   ├── store/                        # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── cart-store.ts
│   │   ├── wishlist-store.ts
│   │   ├── ui-store.ts
│   │   └── index.ts
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                        # Utility functions
│       ├── cn.ts                     # classNames utility
│       ├── format.ts                 # Formatters (price, date, etc)
│       └── index.ts
├── public/                           # Static assets
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── .env.local.example                # Example environment variables
├── eslint.config.mjs                 # ESLint configuration
└── package.json                      # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on configured URL

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

Example `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Run ESLint
```

## Key Technologies

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS 4**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client with interceptors
- **SWR**: Data fetching with caching
- **Lucide React**: Icon library
- **JWT Decode**: JWT parsing

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token automatically attached to API requests via Axios interceptor
5. Invalid/expired tokens trigger automatic logout
6. AuthGuard middleware protects authenticated/admin routes

## State Management

### Auth Store
```typescript
const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Cart Store
```typescript
const { items, total, addItem, removeItem, updateQuantity } = useCartStore();
```

### Wishlist Store
```typescript
const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
```

### UI Store
```typescript
const { toasts, addToast, removeToast } = useUiStore();
```

## API Integration

The frontend communicates with the backend through REST APIs:

- **Auth**: Login, Register, Get Current User, Refresh Token
- **Products**: Get All, Get by ID, Search, Get by Category

All requests include JWT token in Authorization header (when available).

## Styling

The project uses TailwindCSS with custom theme tokens:

```typescript
// Custom colors for e-commerce
- primary: Sky blue (primary actions)
- secondary: Slate (neutral elements)
- success: Green
- warning: Amber
- error: Red
- info: Blue
```

Global styles and animations are defined in `src/app/globals.css`.

## Development Guidelines

1. **Components**: Use functional components with hooks
2. **Styling**: Use TailwindCSS classes, avoid custom CSS where possible
3. **State**: Use Zustand stores for global state, React hooks for local state
4. **API**: Use `useFetch` hook for data fetching
5. **Types**: Define and use TypeScript interfaces for all data
6. **Error Handling**: Use useToast hook for user feedback

## Performance Considerations

- Images lazy-loaded
- Code splitting via Next.js dynamic imports
- SWR for efficient data fetching with automatic revalidation
- Zustand for lightweight state management
- Memoization of expensive components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Search functionality
- [ ] Advanced filtering
- [ ] User reviews
- [ ] Order tracking
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Analytics
- [ ] SEO optimization

## License

Proprietary - E-Store
