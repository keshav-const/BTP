# API Integration Guide

This document describes the API integration layer and how to use it in the frontend application.

## Overview

The frontend uses a combination of:
- **Axios**: For direct HTTP requests with automatic JWT attachment
- **SWR**: For efficient data fetching with caching and revalidation
- **Custom Hooks**: For consuming data in components

## Configuration

### Environment Variables

Set up your environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
```

## API Client Setup

### Axios Instance (`lib/axios-instance.ts`)

The Axios instance is configured with:
- Base URL from environment
- Automatic JWT token injection
- 401 error handling (auto-logout)

```typescript
import axiosInstance from '@/lib/axios-instance';

// The token is automatically added to all requests
const response = await axiosInstance.get('/products');
```

### Request Interceptor

Automatically attaches JWT token to all requests:

```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles 401 responses by removing invalid tokens:

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints

### Authentication API

#### Login
```typescript
import { authApi } from '@/api';

const response = await authApi.login('user@example.com', 'password');
// Returns: { token: string, user: User }
```

#### Register
```typescript
const response = await authApi.register('John Doe', 'user@example.com', 'password');
// Returns: { token: string, user: User }
```

#### Get Current User
```typescript
const response = await authApi.getCurrentUser();
// Returns: User
```

#### Refresh Token
```typescript
const response = await authApi.refreshToken();
// Returns: { token: string }
```

#### Logout
```typescript
await authApi.logout();
```

### Products API

#### Get All Products
```typescript
import { productsApi } from '@/api';

const response = await productsApi.getAll(page, limit);
// Returns: PaginatedResponse<Product>
```

#### Get Product by ID
```typescript
const response = await productsApi.getById('product-id');
// Returns: Product
```

#### Search Products
```typescript
const response = await productsApi.search('search-query', page, limit);
// Returns: PaginatedResponse<Product>
```

#### Get Products by Category
```typescript
const response = await productsApi.getByCategory('electronics', page, limit);
// Returns: PaginatedResponse<Product>
```

## Data Fetching Patterns

### Using SWR (Recommended for GET requests)

```typescript
import { useFetch } from '@/hooks';

function ProductsList() {
  const { data, error, isLoading, mutate } = useFetch('/products?page=1&limit=10');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Direct API Calls (For mutations)

```typescript
import { authApi } from '@/api';
import { useToast } from '@/hooks';

function LoginForm() {
  const { error: showError, success: showSuccess } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await authApi.login(email, password);
      showSuccess('Login successful!');
    } catch (error) {
      showError('Login failed');
    }
  };

  return (
    // Form JSX
  );
}
```

## State Management for API Data

### Using Zustand Stores

#### Auth Store
```typescript
import { useAuthStore } from '@/store';

function MyComponent() {
  const { user, isAuthenticated, login } = useAuthStore();

  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };

  return (
    // Component JSX
  );
}
```

#### Using Custom Hooks
```typescript
import { useAuth } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  // Simplified auth access
}
```

## Error Handling

### API Error Handler

```typescript
import { handleApiError } from '@/lib/error-handler';

try {
  const response = await axiosInstance.get('/products');
} catch (error) {
  const apiError = handleApiError(error);
  console.error(`Error ${apiError.status}: ${apiError.message}`);
}
```

### Using Toast Notifications

```typescript
import { useToast } from '@/hooks';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleAction = async () => {
    try {
      await someApiCall();
      success('Action completed!');
    } catch (err) {
      error('Action failed: ' + err.message);
    }
  };

  return (
    // Component JSX
  );
}
```

## Type Definitions

### API Response Types

```typescript
// Generic API response
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API error
interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}
```

### Entity Types

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  quantity?: number;
}
```

## Authentication Flow

### Login Process

1. User submits login form
2. `authApi.login()` called with credentials
3. Backend returns token and user data
4. Token stored in localStorage
5. Auth store updated with user data
6. Axios interceptor automatically attaches token to subsequent requests

### Token Management

```typescript
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from '@/lib/auth';

// Get current token
const token = getAuthToken();

// Store token
setAuthToken('new-token');

// Remove token
removeAuthToken();

// Check if authenticated
if (isAuthenticated()) {
  // User is logged in
}
```

### Automatic Token Refresh

Implement in your API calls:

```typescript
const makeAuthenticatedRequest = async () => {
  try {
    return await axiosInstance.get('/protected-route');
  } catch (error) {
    if (error.response?.status === 401) {
      // Try to refresh token
      const result = await authApi.refreshToken();
      if (result.data?.token) {
        setAuthToken(result.data.token);
        // Retry original request
        return axiosInstance.get('/protected-route');
      }
    }
    throw error;
  }
};
```

## Caching Strategy

### SWR Configuration

The app uses default SWR configuration:
- **revalidateOnFocus**: true (refetch on window focus)
- **revalidateOnReconnect**: true (refetch on reconnect)
- **dedupingInterval**: 60000 (60s deduplication)

### Manual Revalidation

```typescript
import { useFetch } from '@/hooks';

function MyComponent() {
  const { data, mutate } = useFetch('/products');

  const handleRefresh = async () => {
    await mutate(); // Revalidate data
  };

  return (
    <button onClick={handleRefresh}>Refresh</button>
  );
}
```

## Best Practices

1. **Always use type-safe API functions** from `/api` directory
2. **Use SWR for READ operations** (GET requests)
3. **Use direct API calls for WRITE operations** (POST, PUT, DELETE)
4. **Handle errors with toast notifications** for user feedback
5. **Use custom hooks** (`useAuth`, `useCart`, etc.) for state access
6. **Protect routes with AuthGuard** for authenticated pages
7. **Never expose tokens in URLs** - always use headers
8. **Validate data types** with TypeScript interfaces

## Common Patterns

### Product Listing with Filters

```typescript
function ProductsList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const queryString = new URLSearchParams({
    page: String(page),
    ...filters,
  }).toString();

  const { data, isLoading } = useFetch(
    `/products?${queryString}`
  );

  return (
    // Render products and pagination
  );
}
```

### Cart Operations

```typescript
function ProductCard({ product }) {
  const { addItem } = useCart();
  const { success } = useToast();

  const handleAddToCart = () => {
    addItem(product, 1);
    success('Added to cart!');
  };

  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
}
```

### Protected Route

```typescript
function ProtectedPage() {
  return (
    <AuthGuard>
      <h1>Protected Content</h1>
    </AuthGuard>
  );
}

function AdminPage() {
  return (
    <AuthGuard adminOnly>
      <h1>Admin Dashboard</h1>
    </AuthGuard>
  );
}
```

## Troubleshooting

### Token Not Being Sent

Check if token is stored in localStorage:
```typescript
console.log(localStorage.getItem('auth_token'));
```

### 401 Responses

- Token may be expired
- Token format may be incorrect
- Server may not recognize token

### CORS Issues

- Ensure backend is configured to accept requests
- Check headers configuration
- Verify API URL is correct

### Missing Data

- Check API response structure
- Verify data fetching is enabled
- Look for HTTP errors in console
