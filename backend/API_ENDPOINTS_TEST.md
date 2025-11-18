# API Endpoints Testing Documentation

This document describes the product and cart endpoints that have been verified and enhanced with proper error handling.

## Product Endpoints

### GET /api/products
- **Description**: Retrieve all products with pagination and filtering
- **Auth Required**: No (public endpoint)
- **Query Parameters**: 
  - `page`, `limit`, `sort`, `order`, `category`, `brand`, `minPrice`, `maxPrice`, `search`, `isActive`
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": {
      "data": [...],
      "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10, "hasNext": true, "hasPrev": false }
    }
  }
  ```
- **Error Response**: 
  ```json
  {
    "success": false,
    "message": "Error retrieving products",
    "error": "error details"
  }
  ```

### GET /api/products/:id
- **Description**: Retrieve a single product by ID
- **Auth Required**: No (public endpoint)
- **Path Parameters**: `id` - MongoDB ObjectId
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Product retrieved successfully",
    "data": {
      "id": "...",
      "name": "Product Name",
      "price": 99.99,
      "description": "...",
      "image": "...",
      ...
    }
  }
  ```
- **Error Responses**:
  - **400 Bad Request** (Invalid ID format):
    ```json
    {
      "success": false,
      "message": "Invalid product ID format"
    }
    ```
  - **404 Not Found** (Product doesn't exist):
    ```json
    {
      "success": false,
      "message": "Product not found"
    }
    ```
  - **500 Internal Server Error** (Database error):
    ```json
    {
      "success": false,
      "message": "Error retrieving product",
      "error": "error details"
    }
    ```

### GET /api/products/:id/recommendations
- **Description**: Get product recommendations
- **Auth Required**: No (public endpoint)
- **Path Parameters**: `id` - MongoDB ObjectId
- **Query Parameters**: `limit`, `priceTolerance`
- **Error Responses**: Same as GET /api/products/:id

## Cart Endpoints

All cart endpoints require authentication via Bearer token in Authorization header.

### GET /api/cart
- **Description**: Retrieve user's cart
- **Auth Required**: Yes
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Cart retrieved successfully",
    "data": {
      "items": [
        {
          "id": "cart-item-id",
          "productId": "product-id",
          "qty": 2,
          "product": {
            "id": "...",
            "name": "...",
            "price": 99.99,
            "images": [...],
            "category": "...",
            "brand": "...",
            "stock": 10,
            "description": "..."
          }
        }
      ],
      "subtotal": 199.98,
      "totalQuantity": 2
    }
  }
  ```
- **Error Responses**:
  - **401 Unauthorized** (No token or invalid token):
    ```json
    {
      "success": false,
      "message": "Access token is required"
    }
    ```
    or
    ```json
    {
      "success": false,
      "message": "Invalid or expired token"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Error retrieving cart",
      "error": "error details"
    }
    ```

### POST /api/cart
- **Description**: Add item to cart
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "productId": "mongodb-object-id",
    "qty": 1
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Product added to cart successfully",
    "data": {
      "items": [...],
      "subtotal": 199.98,
      "totalQuantity": 2
    }
  }
  ```
- **Error Responses**:
  - **400 Bad Request** (Invalid product ID):
    ```json
    {
      "success": false,
      "message": "Invalid product ID format"
    }
    ```
  - **400 Bad Request** (Invalid quantity):
    ```json
    {
      "success": false,
      "message": "Quantity must be at least 1"
    }
    ```
  - **404 Not Found** (Product doesn't exist):
    ```json
    {
      "success": false,
      "message": "Product not found"
    }
    ```
  - **401 Unauthorized**: Same as GET /api/cart
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Error adding product to cart",
      "error": "error details"
    }
    ```

### PATCH /api/cart/:itemId
- **Description**: Update cart item quantity
- **Auth Required**: Yes
- **Path Parameters**: `itemId` - Cart item ID (MongoDB ObjectId)
- **Request Body**:
  ```json
  {
    "qty": 3
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Cart updated successfully",
    "data": {
      "items": [...],
      "subtotal": 299.97,
      "totalQuantity": 3
    }
  }
  ```
- **Error Responses**:
  - **400 Bad Request** (Invalid item ID):
    ```json
    {
      "success": false,
      "message": "Invalid cart item ID format"
    }
    ```
  - **400 Bad Request** (Invalid quantity):
    ```json
    {
      "success": false,
      "message": "Quantity must be at least 1"
    }
    ```
  - **404 Not Found** (Cart not found):
    ```json
    {
      "success": false,
      "message": "Cart not found"
    }
    ```
  - **404 Not Found** (Item not found):
    ```json
    {
      "success": false,
      "message": "Cart item not found"
    }
    ```
  - **401 Unauthorized**: Same as GET /api/cart
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Error updating cart",
      "error": "error details"
    }
    ```

### DELETE /api/cart/:itemId
- **Description**: Remove item from cart
- **Auth Required**: Yes
- **Path Parameters**: `itemId` - Cart item ID (MongoDB ObjectId)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Product removed from cart successfully",
    "data": {
      "items": [...],
      "subtotal": 99.99,
      "totalQuantity": 1
    }
  }
  ```
- **Error Responses**: Same as PATCH /api/cart/:itemId

### DELETE /api/cart
- **Description**: Clear all items from cart
- **Auth Required**: Yes
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Cart cleared successfully",
    "data": {
      "items": [],
      "subtotal": 0,
      "totalQuantity": 0
    }
  }
  ```
- **Error Responses**:
  - **401 Unauthorized**: Same as GET /api/cart
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Error clearing cart",
      "error": "error details"
    }
    ```

## Error Handling Improvements

All endpoints have been enhanced with:

1. **Proper ObjectId Validation**: Invalid MongoDB ObjectIds now return 400 (Bad Request) instead of 500
2. **Comprehensive Try-Catch Blocks**: All database operations are wrapped in try-catch
3. **Console Logging**: All errors are logged to console for debugging
4. **Consistent Error Format**: All errors return JSON with `success: false`, `message`, and optionally `error`
5. **No Crashes**: No unhandled exceptions - all errors return proper JSON responses

## Authentication

Cart endpoints use JWT Bearer token authentication:
- Header: `Authorization: Bearer <token>`
- Middleware validates token and attaches user to request
- Invalid/missing tokens return 401 with clear error message
