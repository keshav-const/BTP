# Backend API

A TypeScript + Express REST API for the e-commerce platform. It powers authentication, catalog and order management, wishlists, AI-assisted content, and image uploads.

## Table of Contents

1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [External Services](#external-services)
7. [Running the Server](#running-the-server)
8. [Database Seeding & Admin Accounts](#database-seeding--admin-accounts)
9. [Build & Deployment](#build--deployment)
10. [API Reference](#api-reference)
11. [AI Feature Usage](#ai-feature-usage)
12. [Testing & Manual QA](#testing--manual-qa)
13. [Troubleshooting](#troubleshooting)
14. [Useful Scripts](#useful-scripts)

---

## Key Features

- **JWT Authentication** with refresh tokens, role-based authorization, and secure password hashing.
- **Product Management** including filtering, sorting, pagination, and AI-generated highlights.
- **Order Lifecycle** handling checkout, status updates, and stock checks.
- **Wishlist** endpoints for shoppers to curate products.
- **Google Gemini AI Integration** for natural-language search intent parsing, product copy generation, highlight extraction, and image enhancement suggestions.
- **Cloudinary Media Uploads** via Multer with size/type validation and secure URL responses.
- **Recommendation Engine** that scores related products by category, brand, tags, and price tolerance.
- **Consistent API Responses** with centralized error handling and validation powered by Joi.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (TypeScript) |
| Framework | Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| Validation | Joi |
| AI | Google Gemini SDK |
| Media | Cloudinary + Multer |

---

## Architecture Overview

The backend exposes REST endpoints at `/api/*`, persists data in MongoDB, stores images in Cloudinary, and calls Google Gemini for AI-assisted tasks. It is consumed by the Next.js frontend located in `../frontend`.

```
Client (Next.js) ──► Express Controllers ──► Services ──► MongoDB / Cloudinary / Gemini
                       │
                       ├── Validation (Joi)
                       └── Middleware (Auth, Upload, Error Handling)
```

Refer to the root [`README.md`](../README.md) for a monorepo quick start and high-level deployment guidance.

---

## Getting Started

### Prerequisites

- Node.js **v18.17+** (aligns with the frontend requirement)
- npm **v9+**
- MongoDB running locally or via a hosted cluster
- Cloudinary account for storing product imagery
- Google Gemini API key

### Installation

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your configuration (see [Environment Variables](#environment-variables)).

---

## Environment Variables

All configuration is sourced from `.env`. Below is the full list with descriptions and defaults.

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `PORT` | HTTP port for the API. Use `3001` locally to avoid clashing with Next.js. | `3000` |
| `MONGODB_URI` | Connection string to MongoDB | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret for signing access tokens | _required_ |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | _required_ |
| `JWT_EXPIRE` | Access token lifespan (ms string or seconds) | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token lifespan | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `GEMINI_API_KEY` | Google Generative AI key | _required for AI routes_ |
| `GEMINI_MODEL` | Gemini model identifier | `gemini-1.5-flash` |
| `GEMINI_MAX_TOKENS` | Max tokens returned in AI responses | `2048` |
| `GEMINI_TEMPERATURE` | Creativity vs determinism (0–1) | `0.7` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | _required for uploads_ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | _required_ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | _required_ |
| `CLOUDINARY_FOLDER` | Folder to store product assets | `products` |
| `MAX_FILE_SIZE` | Upload size cap in bytes | `5242880` (5 MB) |
| `ALLOWED_MIME_TYPES` | Comma-separated allowed MIME types | `image/jpeg,image/png,image/webp,image/gif` |
| `MAX_FILES` | Max files per upload request | `5` |

> After editing `.env`, restart `npm run dev` to apply the new configuration.

---

## External Services

### MongoDB
- Run locally (`mongod`) or provision a MongoDB Atlas cluster.
- If using Atlas, update `MONGODB_URI` with the SRV string and ensure your IP is allow-listed.

### Cloudinary
1. Create an account at [cloudinary.com](https://cloudinary.com/).
2. Copy the `cloud name`, `API key`, and `API secret` into your `.env`.
3. Optionally create a folder (e.g., `products`) to keep uploads organised.

### Google Gemini
1. Generate an API key via Google AI Studio.
2. Enable the desired model (e.g., `gemini-1.5-flash`).
3. Store the key in `GEMINI_API_KEY` and configure model/token settings as needed.
4. Monitor quota/usage in Google Cloud to avoid throttling.

---

## Running the Server

### Development

```bash
npm run dev
```

- Starts the server with `ts-node-dev` and hot reload.
- Default URL: `http://localhost:3001` (if `PORT=3001`).
- Health check: `GET http://localhost:3001/health`.
- API base: `http://localhost:3001/api`.

### Production

```bash
npm run build
npm start
```

- `npm run build` compiles TypeScript into `dist/`.
- `npm start` serves the compiled code with Node.js.
- Use a process manager (PM2/systemd/Docker) for resiliency.

---

## Database Seeding & Admin Accounts

Seed the database with demo data via command line or API endpoint:

### Option 1: Command Line Script

```bash
npm run seed
```

Creates:
- **Admin**: `admin@example.com` / `admin123`
- **Shoppers**: `john@example.com`, `jane@example.com` (password: `password123`)
- 12 luxury products (watches, fashion, electronics, beauty, accessories, home goods)
- Sample orders, carts, and wishlists.

### Option 2: Admin API Endpoint

For production/deployed environments, use the admin seed endpoint:

```bash
# Seed products (requires admin authentication)
POST /api/admin/seed/products

# Clear all products
DELETE /api/admin/seed/products
```

See [SEEDING.md](SEEDING.md) for detailed documentation on both seeding methods.

### Managing Admin Users

- To promote an existing user, run a MongoDB update:
  ```js
  db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
  ```
- New admins must re-authenticate to receive tokens containing the `admin` role.
- Consider rotating passwords and secrets after seeding in shared environments.

---

## Build & Deployment

1. **Set environment variables** in your hosting platform or container secrets.
2. **Build the project**: `npm run build`.
3. **Serve** with `npm start` or `node dist/index.js` behind a reverse proxy (NGINX, Apache) with HTTPS.
4. **Database & media**: Ensure network access from the host/container to MongoDB and Cloudinary.
5. **Monitoring**: Surface `/health` to your monitoring system and enable structured logging as needed.
6. **Scaling**: Horizontal scaling requires a shared MongoDB deployment and Cloudinary handles asset scaling automatically.

---

## API Reference

**Base URL:** `http://<host>:<port>/api`

Authentication is via bearer tokens in the `Authorization` header unless otherwise stated.

### Endpoint Summary

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/signup` | Register shopper | Public |
| POST | `/auth/login` | Login and receive tokens | Public |
| POST | `/auth/refresh` | Refresh access token | Refresh token |
| GET  | `/auth/profile` | Current user profile | Access token |
| GET  | `/products` | List products (filters) | Public |
| GET  | `/products/:id` | Product detail | Public |
| POST | `/products` | Create product | Admin |
| PUT  | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| GET  | `/products/:id/recommendations` | Recommended products | Public |
| POST | `/products/upload-images` | Upload product images | Admin |
| GET  | `/orders` | List current user orders (admin sees all) | Auth (admin optional) |
| GET  | `/orders/:id` | Order detail | Auth (owner or admin) |
| POST | `/orders` | Create order | Auth |
| PUT  | `/orders/:id/status` | Update order status | Admin |
| DELETE | `/orders/:id/cancel` | Cancel order | Auth (owner) |
| GET  | `/wishlist` | Current wishlist | Auth |
| POST | `/wishlist/add` | Add product to wishlist | Auth |
| DELETE | `/wishlist/:productId` | Remove product | Auth |
| DELETE | `/wishlist/clear` | Clear wishlist | Auth |
| POST | `/ai/search` | Parse natural language query | Public |
| POST | `/ai/generate-description` | Generate SEO copy | Admin |
| POST | `/ai/enhance-image` | Get image enhancement tips | Admin |
| POST | `/admin/seed/products` | Seed database with products | Admin |
| DELETE | `/admin/seed/products` | Clear all products | Admin |
| GET  | `/health` | Server health check | Public |

> Full request/response contracts use the standard success/error envelope:
> ```json
> // Success
> {
>   "success": true,
>   "message": "...",
>   "data": { }
> }
> // Error
> {
>   "success": false,
>   "message": "...",
>   "error": "Detailed cause"
> }
> ```

#### Authentication

- **POST `/auth/login`**
  ```bash
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}'
  ```
  Response includes `accessToken`, `refreshToken`, and user profile. Access tokens expire after `JWT_EXPIRE`.

- **POST `/auth/refresh`**
  ```json
  { "refreshToken": "<token>" }
  ```
  Returns a new access token.

- **GET `/auth/profile`**
  Include `Authorization: Bearer <accessToken>` to retrieve the current user.

#### Products

- **GET `/products`** supports `page`, `limit`, `sort`, `order`, `category`, `brand`, `minPrice`, `maxPrice`, `search`, `isActive`.
- **POST `/products`** (admin):
  ```json
  {
    "name": "Noise Cancelling Headphones",
    "description": "Premium wireless over-ear headphones",
    "price": 199.99,
    "category": "Electronics",
    "brand": "Soundify",
    "stock": 15,
    "tags": ["wireless", "audio", "noise-cancelling"],
    "images": ["https://res.cloudinary.com/.../image.jpg"]
  }
  ```
- **POST `/products/upload-images`** accepts `multipart/form-data` with `images`. The response contains Cloudinary URLs.

#### Orders

- **POST `/orders`** expects:
  ```json
  {
    "items": [
      {
        "product": "65a1234f0d4c8ab123456789",
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
    "paymentMethod": "Cash on Delivery"
  }
  ```
- **PUT `/orders/:id/status`** (admin) lets you transition between statuses (e.g., `processing`, `shipped`, `delivered`, `cancelled`).

#### Wishlist

- **POST `/wishlist/add`**:
  ```json
  { "productId": "65a1234f0d4c8ab123456789" }
  ```

#### AI

Refer to [AI Feature Usage](#ai-feature-usage) for quotas and fallback notes.

- **POST `/ai/search`**
  ```json
  { "query": "wireless headphones under $200" }
  ```
  Response normalises filters: category, brand, price range, tags, and derived intent.

- **POST `/ai/generate-description`** (admin)
  ```json
  {
    "productName": "Wireless Noise-Cancelling Headphones",
    "productInfo": {
      "brand": "Soundify",
      "price": 199.99,
      "features": ["Bluetooth 5.3", "20h battery", "Active noise cancellation"]
    }
  }
  ```

- **POST `/ai/enhance-image`** (admin)
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "imageData": {
      "productName": "Smart Watch",
      "category": "Wearables"
    }
  }
  ```

#### Health Check

- **GET `/health`** reports uptime, timestamp, and environment for monitoring.

---

## AI Feature Usage

| Feature | Endpoint | Role | Expected Use |
|---------|----------|------|--------------|
| Search intent parsing | `POST /ai/search` | Public | Translate natural-language queries into filters for product search. |
| Description generation | `POST /ai/generate-description` | Admin | Generate SEO-optimised copy, highlights, and keywords before publishing a product. |
| Image enhancement | `POST /ai/enhance-image` | Admin | Receive metadata and improvement tips for product imagery. |

### Rate Limits & Quotas
- Google Gemini enforces quotas based on your account tier (check Google AI Studio > Quotas). Typical starter quotas are **60 requests/minute** and **6,000 requests/day** for `gemini-1.5-flash`, but confirm with your plan.
- Configure `GEMINI_MAX_TOKENS` and `GEMINI_TEMPERATURE` to balance cost and output size.
- Implement client-side throttling or job queues if you expect bursts (e.g., mass product imports).

### Fallback Behaviour
- **Search Intent**: If Gemini errors or responds with invalid JSON, the service falls back to a generic result containing the original search terms and intent `general` while still returning `success: true`.
- **Description Generation**: Errors surface to the client with `success: false` and a descriptive message. Frontend should display a retry prompt.
- **Image Enhancement**: On failure, the API returns a default metadata payload and generic suggestions (e.g., "Consider using better lighting").

### Error Handling Tips
- Missing `GEMINI_API_KEY` throws an initialization error; ensure `.env` is populated before hitting AI routes.
- Log AI errors server-side (already implemented) and monitor for persistent 5xx to adjust quotas or prompt formatting.

---

## Testing & Manual QA

While there are no automated test scripts yet, the following manual QA flow covers critical paths.

1. **Authentication & JWT-Protected Routes**
   - Seed the database or create a user via `/auth/signup`.
   - Login via `/auth/login` to capture `accessToken` and `refreshToken`.
   - Call `/auth/profile` and `/orders` with `Authorization: Bearer <accessToken>` to confirm access.
   - Test token expiration by updating `JWT_EXPIRE` to a short interval and using `/auth/refresh` to renew.

2. **Admin Privileges**
   - Login as `admin@example.com` and call `/products` (GET) to confirm admin data.
   - Create or update a product via `/products` (POST/PUT) ensuring the response contains the new data.
   - Attempt the same with a non-admin user to verify `403 Forbidden`.

3. **AI Features**
   - Ensure `GEMINI_API_KEY` is valid.
   - Call `/ai/search` with queries of varying complexity and confirm the derived filters.
   - Call `/ai/generate-description` for an existing product; capture `shortDescription`, `longDescription`, and `seoKeywords`.
   - Temporarily revoke the API key or exceed quota to observe fallback behaviour, confirming that search gracefully degrades and other endpoints return controlled errors.

4. **Image Uploads**
   - Hit `POST /products/upload-images` with `multipart/form-data` using Postman or curl:
     ```bash
     curl -X POST http://localhost:3001/api/products/upload-images \
       -H "Authorization: Bearer <admin-access-token>" \
       -F "images=@/path/to/photo.jpg"
     ```
   - Verify the response contains `secure_url` values and confirm assets appear in your Cloudinary media library.

5. **Order Flow**
   - Using a shopper token, place an order via `/orders` and verify the response totals and status transitions.
   - Cancel an order (`DELETE /orders/:id/cancel`) and ensure stock levels restore (check product document in MongoDB).

6. **Recommendations**
   - Request `/products/:id/recommendations` to ensure scoring logic returns expected related items based on category/tags.

Document QA results or regressions as part of your release checklist.

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| `ECONNREFUSED` or timeout when connecting to MongoDB | MongoDB not running or URI incorrect | Start MongoDB, verify `MONGODB_URI`, and ensure local/Atlas access. |
| `401 Unauthorized` on protected routes | Missing/expired access token | Refresh token via `/auth/refresh`, ensure `Authorization: Bearer` header is set, and confirm system clocks are in sync. |
| `403 Forbidden` when accessing admin endpoints | Insufficient role | Confirm the user has `role: "admin"` in MongoDB and re-login to refresh tokens. |
| CORS errors in browser console | `FRONTEND_URL` does not match client origin | Update `.env`, restart server, and ensure URL includes protocol and port. |
| `Gemini API key is not configured` error | Missing/invalid `GEMINI_API_KEY` | Provide a valid key and restart the server. |
| Cloudinary upload failures (`401` or `ENOTFOUND`) | Invalid credentials or network issues | Double-check API key/secret, ensure network access, and verify the folder name exists. |

For architectural context, see the diagram in the root README or integrate your own ERD/sequence diagrams as needed.

---

## Useful Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled server (use in production) |
| `npm run seed` | Populate MongoDB with sample data (admin/users/products/orders) |

---

This backend is released under the MIT License. Adjust configuration and infrastructure to suit your organisation’s deployment and compliance requirements.
