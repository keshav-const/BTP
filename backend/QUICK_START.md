# Backend Quick Start Guide

## Prerequisites
- Docker (for MongoDB)
- Node.js v20+ with npm

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo:latest
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Ensure these variables are set in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

Server will start at: http://localhost:5000

## API Endpoints

### Products
- `GET /api/products` - List all products (with pagination)
- `GET /api/products/:id` - Get single product

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
  ```json
  { "productId": "...", "qty": 1 }
  ```
- `PATCH /api/cart/:itemId` - Update cart item
  ```json
  { "qty": 2 }
  ```
- `DELETE /api/cart/:itemId` - Remove cart item

### Auth
- `POST /api/auth/login` - Login
  ```json
  { "email": "john@example.com", "password": "password123" }
  ```

## Test Accounts

- Admin: `admin@example.com` / `admin123`
- User 1: `john@example.com` / `password123`
- User 2: `jane@example.com` / `password123`

## Testing

Run manual tests:
```bash
# Get products
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/[product-id]

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Add to cart (with token)
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"productId":"[product-id]","qty":1}'
```

## Development

The server runs with hot-reload enabled. Any changes to TypeScript files will automatically restart the server.

## Troubleshooting

**MongoDB connection error:**
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start MongoDB if not running
docker start mongodb
```

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 [PID]
```

**Empty products:**
```bash
# Re-seed database
npm run seed
```
