# Quick Setup Guide

This guide covers the actual working setup for the e-commerce platform.

## Prerequisites

- Node.js v18.17 or higher
- Docker (for MongoDB)
- npm v9 or higher

## Backend Setup (Port 5000)

### 1. Start MongoDB with Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Configure Backend

```bash
cd backend
npm install
cp .env.example .env
```

### 3. Update `.env` File

Edit `backend/.env` to match these settings:

```env
NODE_ENV=development
PORT=5000  # Frontend expects backend on port 5000

# MongoDB - Local Docker instance
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Google Gemini AI (for AI features)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=products

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
MAX_FILES=5
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- 12 sample products
- 3 users:
  - Admin: `admin@example.com` / `admin123`
  - User 1: `john@example.com` / `password123`
  - User 2: `jane@example.com` / `password123`
- Sample orders, carts, and wishlists

### 5. Start Backend Server

```bash
npm run dev
```

Server will be running at `http://localhost:5000`

### 6. Verify Backend

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test products endpoint
curl http://localhost:5000/api/products

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Frontend Setup (Port 3000)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Frontend (Optional)

The frontend is pre-configured to use `http://localhost:5000/api` by default.

If you need to change the API URL, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_TOKEN_KEY=ecommerce_auth_token
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend will be running at `http://localhost:3000`

## Testing the Complete Setup

Run the provided test script:

```bash
cd /home/engine/project
./test_backend_endpoints.sh
```

Expected output:
- ✅ Health check: `{"success":true,"message":"Server is running"}`
- ✅ Products: `{"success":true,...,"productCount":12}`
- ✅ Login: `{"success":true,"message":"Login successful","hasToken":true}`
- ✅ Profile: `{"success":true,...,"email":"john@example.com"}`
- ✅ Cart: `{"success":true,...,"totalItems":3}`
- ✅ Error handling: All return proper JSON

## Common Issues

### MongoDB Connection Timeout
- **Symptom**: `Operation 'products.find()' buffering timed out`
- **Solution**: Ensure MongoDB Docker container is running: `docker ps | grep mongo`
- **Fix**: Start MongoDB: `docker start mongodb` or create new container (see step 1)

### Port Already in Use
- **Symptom**: `EADDRINUSE: address already in use :::5000`
- **Solution**: Kill existing process: `pkill -f "ts-node-dev.*src/index.ts"` then restart

### Empty Products List
- **Symptom**: Products endpoint returns empty array
- **Solution**: Run seed script: `cd backend && npm run seed`

### Frontend Can't Connect to Backend
- **Symptom**: Network errors in frontend console
- **Solution**: Verify backend is running on port 5000: `curl http://localhost:5000/health`

## Port Configuration Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

**Note**: The frontend defaults to `http://localhost:5000/api` for API calls. This is different from the README.md which mentions port 3001. The actual implementation uses port 5000.

## API Endpoints

All backend endpoints return JSON with this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (in development mode)"
}
```

### Available Endpoints

#### Public Endpoints
- `GET /health` - Health check
- `GET /api/products` - List products (with pagination, filters)
- `GET /api/products/:id` - Get product details
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Protected Endpoints (Require Authentication)
- `GET /api/auth/profile` - Get user profile
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

## Development Workflow

1. Start MongoDB: `docker start mongodb` (if not already running)
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `cd frontend && npm run dev`
4. Access app at: `http://localhost:3000`

## Stopping Services

```bash
# Stop backend
pkill -f "ts-node-dev"

# Stop frontend
# Press Ctrl+C in the terminal running frontend

# Stop MongoDB
docker stop mongodb

# Remove MongoDB container (data will be lost)
docker rm mongodb
```

## Additional Documentation

- Backend API details: `backend/README.md`
- Frontend setup: `frontend/README.md`
- API Integration: `frontend/docs/API_INTEGRATION.md`
- Seeding details: `backend/SEEDING.md`
