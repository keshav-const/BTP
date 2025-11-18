# Database Seeding Documentation

This document describes how to seed the database with initial product data.

## Overview

The backend provides multiple ways to populate the database with sample luxury product data:

1. **Admin API Endpoint** (Recommended for production/deployed environments)
2. **Command Line Script** (For local development)

## Product Seed Data

The seed data includes 12 premium luxury e-commerce products across various categories:
- Luxury Watches
- Designer Fashion Items
- Premium Electronics
- High-End Beauty Products
- Luxury Accessories
- Premium Home Goods

All products include:
- Realistic luxury pricing ($245 - $3,499)
- Detailed descriptions
- Multiple product images (placeholder URLs)
- Category and brand information
- Stock quantities
- Relevant tags

## Method 1: Admin API Endpoint (Recommended)

### Seed Products

**Endpoint**: `POST /api/admin/seed/products`

**Authentication**: Required (Admin role)

**Description**: Seeds the database with 12 luxury products

**Headers**:
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Successfully seeded 12 products",
  "data": {
    "count": 12,
    "products": [
      {
        "id": "...",
        "name": "Swiss Luxury Chronograph Watch",
        "price": 3499.99,
        "category": "Watches"
      },
      ...
    ]
  }
}
```

**Error Responses**:

- **400 Bad Request** (Products already exist):
```json
{
  "success": false,
  "message": "Database already contains 12 product(s). Clear products first or use force=true query parameter."
}
```

- **401 Unauthorized** (Not logged in or invalid token):
```json
{
  "success": false,
  "message": "Access token is required"
}
```

- **403 Forbidden** (Not an admin):
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Clear Products

**Endpoint**: `DELETE /api/admin/seed/products`

**Authentication**: Required (Admin role)

**Description**: Removes all products from the database

**Success Response** (200):
```json
{
  "success": true,
  "message": "Successfully deleted 12 product(s)",
  "data": {
    "deletedCount": 12
  }
}
```

## Method 2: Command Line Script

### Prerequisites

1. MongoDB connection configured in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. Node modules installed:
   ```bash
   npm install
   ```

### Run Seed Script

```bash
npm run seed
```

This will:
1. Connect to the database
2. Clear existing data (users, products, orders, carts, wishlists)
3. Create admin and test users
4. Create 12 luxury products
5. Create sample orders, carts, and wishlists

**Output**:
```
Starting database seeding...
Database connected successfully
Clearing existing data...
Creating admin user...
Creating regular users...
Creating products...
Creating sample orders...
Creating carts...
Creating wishlists...
Database seeding completed successfully!

Created users:
Admin: admin@example.com / admin123
User: john@example.com / password123
User: jane@example.com / password123

Created 12 products
Created 2 sample orders
Created 2 carts
Created 2 wishlists
```

## Seed Data Location

Product seed data is maintained in: `backend/src/seeds/products.seed.ts`

This allows easy updates and modifications to the seed data without changing the seeding logic.

## Usage Workflow

### For Initial Setup

1. Deploy backend to server
2. Login as admin (create admin user first if needed)
3. Call `POST /api/admin/seed/products` to populate products
4. Products are now available at `GET /api/products`

### For Local Development

1. Configure `.env` with MongoDB URI
2. Run `npm run seed` to populate full database
3. Use test credentials to login and test features

### To Reset Data

1. Call `DELETE /api/admin/seed/products` to clear products
2. Call `POST /api/admin/seed/products` to re-seed

## Testing the Seed

After seeding, verify products are available:

```bash
curl http://localhost:3000/api/products
```

Expected response:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "data": [
      {
        "id": "...",
        "name": "Swiss Luxury Chronograph Watch",
        "price": 3499.99,
        "category": "Watches",
        "brand": "Chronos Elite",
        "stock": 15,
        "images": ["..."],
        "tags": ["luxury", "watches", ...],
        ...
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "pages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Troubleshooting

### "Database already contains N products"

If you see this error, you need to clear existing products first:
- Call `DELETE /api/admin/seed/products` endpoint
- Or manually delete products from MongoDB

### Connection Timeout

If the seed script times out:
- Check your MongoDB URI is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Check network connectivity

### Permission Denied

- Ensure you're authenticated with an admin account
- Check the Authorization header includes a valid JWT token
- Verify the user has the 'admin' role

## Notes

- The admin seed endpoint will NOT overwrite existing products (safe operation)
- Use the clear endpoint to remove all products before re-seeding
- Product images use placeholder URLs - replace with real images in production
- All seed data uses the same schema as the Product model
