# Backend API

A comprehensive REST API built with Express, TypeScript, and MongoDB, featuring authentication, product management, order processing, and wishlist functionality.

## Features

- **Authentication**: JWT-based auth with refresh tokens, role-based access control
- **Product Management**: CRUD operations with filtering, sorting, and pagination
- **Order Processing**: Complete order lifecycle with stock management
- **Wishlist**: User wishlist management
- **AI Integration**: Google Gemini-powered search intent parsing, description generation, and image enhancement
- **Image Upload**: Cloudinary integration with Multer for multipart file uploads
- **Recommendations**: Rule-based product recommendations based on category, tags, and price range
- **Validation**: Comprehensive input validation using Joi
- **Error Handling**: Centralized error handling with consistent API responses
- **TypeScript**: Full type safety throughout the application
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: Joi
- **Development**: ts-node-dev for hot reloading

## Project Structure

```
src/
├── config/           # Database and app configuration
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware (auth, validation, error handling)
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
├── services/        # Business logic and utilities
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── scripts/         # Database seeding and utility scripts
└── index.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=products

# Upload limits (optional overrides)
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
MAX_FILES=5
```

### Database Setup

1. Make sure MongoDB is running on your system or update the `MONGODB_URI` in your `.env` file.

2. Seed the database with sample data:
```bash
npm run seed
```

This will create:
- 1 admin user (admin@example.com / admin123)
- 2 regular users (john@example.com / password123, jane@example.com / password123)
- 8 sample products
- 2 sample orders
- 2 sample wishlists

### Running the Application

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user and get tokens
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/refresh
Refresh access token
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication)

### Product Endpoints

#### GET /api/products
Get all products with filtering and pagination
Query params: `page`, `limit`, `sort`, `order`, `category`, `brand`, `minPrice`, `maxPrice`, `search`, `isActive`

#### GET /api/products/:id
Get product by ID

#### POST /api/products
Create new product (admin only)

#### PUT /api/products/:id
Update product (admin only)

#### DELETE /api/products/:id
Delete product (admin only)

#### GET /api/products/:id/recommendations
Get product recommendations ("You may also like")
Query params: `limit` (default: 10), `priceTolerance` (default: 0.3)

#### POST /api/products/upload-images
Upload product images (admin only)
Multipart form data with `images` field (max 5 files)

### AI Endpoints

#### POST /api/ai/search
Parse search query intent and extract filters
```json
{
  "query": "wireless headphones under $200"
}
```

Response:
```json
{
  "success": true,
  "message": "Search intent parsed successfully",
  "data": {
    "category": "Electronics",
    "maxPrice": 200,
    "tags": ["wireless", "audio"],
    "searchTerms": "headphones",
    "intent": "price_range"
  }
}
```

#### POST /api/ai/generate-description
Generate SEO-optimized product descriptions (admin only)
```json
{
  "productName": "Wireless Noise-Cancelling Headphones",
  "productInfo": {
    "brand": "TechBrand",
    "price": 199.99,
    "features": ["Bluetooth 5.0", "20h battery", "Active noise cancellation"]
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Description generated successfully",
  "data": {
    "shortDescription": "Premium wireless headphones with active noise cancellation...",
    "longDescription": "Full detailed description...",
    "seoKeywords": ["wireless headphones", "noise cancelling", ...],
    "highlights": ["20-hour battery life", "Bluetooth 5.0", ...]
  }
}
```

#### POST /api/ai/enhance-image
Analyze product image and get enhancement suggestions (admin only)
```json
{
  "imageUrl": "https://example.com/product.jpg",
  "imageData": {
    "productName": "Smart Watch",
    "category": "Electronics"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Image enhancement analysis completed",
  "data": {
    "metadata": {
      "altText": "Smart watch with fitness tracking features",
      "title": "Smart Watch Product Image",
      "caption": "Premium smartwatch with health monitoring"
    },
    "suggestions": [
      "Consider using better lighting",
      "Show product from multiple angles",
      "Add lifestyle context to the image"
    ]
  }
}
```

### Order Endpoints

#### GET /api/orders
Get user orders (or all orders for admin)
Query params: `page`, `limit`, `sort`, `order`, `status`

#### GET /api/orders/:id
Get order by ID

#### POST /api/orders
Create new order
```json
{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Credit Card"
}
```

#### PUT /api/orders/:id/status
Update order status (admin only)

#### DELETE /api/orders/:id/cancel
Cancel order

### Wishlist Endpoints

#### GET /api/wishlist
Get user wishlist

#### POST /api/wishlist/add
Add product to wishlist
```json
{
  "productId": "product-id"
}
```

#### DELETE /api/wishlist/:productId
Remove product from wishlist

#### DELETE /api/wishlist/clear
Clear entire wishlist

### Health Check

#### GET /health
Server health check

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

Access tokens expire after 15 minutes. Use the refresh token endpoint to get a new access token.

## Roles

- **user**: Can manage their own orders and wishlist
- **admin**: Full access to all resources including product management

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## License

This project is licensed under the MIT License.