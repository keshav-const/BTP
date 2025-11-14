# E-Commerce Platform Monorepo

## Overview

This repository hosts a full-stack e-commerce platform composed of a TypeScript/Express REST API (`backend/`) and a Next.js 16 storefront (`frontend/`). The backend provides authentication, catalog management, order processing, wishlist features, AI-powered search utilities, and media uploads. The frontend delivers a responsive shopping experience that consumes the API, featuring cart management, checkout flows, and AI-assisted discovery.

```
Frontend (Next.js) ─────► REST API (Express) ─────► MongoDB & Cloudinary
                                 │
                                 └────► Google Gemini AI (search, copy, media)
```

Use the READMEs in each workspace for in-depth details:

- [`backend/README.md`](backend/README.md) – API reference, environment details, seeding, QA, and troubleshooting for the server.
- [`frontend/README.md`](frontend/README.md) – Frontend setup, environment configuration, manual QA, and deployment guidance.

Additional integration notes, request flows, and UX guidance are documented in [`frontend/docs/API_INTEGRATION.md`](frontend/docs/API_INTEGRATION.md).

---

## Repository Layout

| Path       | Description |
|------------|-------------|
| `backend/` | Express + TypeScript API, MongoDB models, AI services, and seed scripts |
| `frontend/`| Next.js 16 App Router storefront with Tailwind, Zustand, and SWR |
| `.gitignore` | Root ignore rules (frontend and backend have additional ignores) |

---

## Prerequisites

| Tool / Service | Version / Notes |
|----------------|-----------------|
| Node.js        | v18.17 or higher (required by Next.js 16) |
| npm            | v9 or higher |
| MongoDB        | Local instance (e.g., Docker, MongoDB Community Server) or a hosted Atlas cluster |
| Cloudinary     | Account with API key/secret for product media uploads |
| Google Gemini  | API key with access to generative models (e.g., `gemini-1.5-flash`) |

> Tip: When running both workspaces locally, set the backend `PORT` to **3001** (or any port other than 3000) to avoid a conflict with Next.js’ development server.

---

## Initial Setup

1. **Clone and select the working branch**
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   git checkout docs/readmes-setup-api-ai-seeding-testing-troubleshooting
   ```

2. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Copy and configure environment variables**
   - Backend: `cd backend && cp .env.example .env`
   - Frontend: create `frontend/.env.local` (sample values below)

   ### Backend `.env`
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/ecommerce

   JWT_SECRET=change-me
   JWT_REFRESH_SECRET=change-me-too
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d

   FRONTEND_URL=http://localhost:3000

   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-1.5-flash
   GEMINI_MAX_TOKENS=2048
   GEMINI_TEMPERATURE=0.7

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   CLOUDINARY_FOLDER=products

   MAX_FILE_SIZE=5242880
   ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
   MAX_FILES=5
   ```

   ### Frontend `.env.local`
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_AUTH_TOKEN_KEY=ecommerce_auth_token
   ```

4. **Start MongoDB**
   - Local installation: `brew services start mongodb-community@7.0` (macOS) or `sudo systemctl start mongod` (Linux)
   - Docker alternative:
     ```bash
     docker run --name ecommerce-mongo -p 27017:27017 -d mongo:7
     ```

5. **Seed initial data (optional but recommended)**
   ```bash
   cd backend
   npm run seed
   ```
   Seeding creates an admin account (`admin@example.com` / `admin123`), test shoppers, sample products, orders, and wishlists.

---

## Running the Platform Locally

Use two terminals (or a process manager) so the backend and frontend run concurrently.

1. **Backend (API)**
   ```bash
   cd backend
   npm run dev
   ```
   - Base URL: `http://localhost:3001`
   - Health check: `GET /health`
   - API base path: `http://localhost:3001/api`

2. **Frontend (Next.js storefront)**
   ```bash
   cd frontend
   npm run dev
   ```
   - Access the storefront at `http://localhost:3000`
   - The frontend reads API URLs from `NEXT_PUBLIC_API_BASE_URL`

> Tip: If you prefer a single command runner, add your own script (e.g., `npm-run-all`) outside the scope of this repository.

---

## Build & Deployment Overview

### Backend
1. Ensure environment variables are set in your hosting environment.
2. Build once: `cd backend && npm run build` (outputs to `dist/`).
3. Start with a process manager (PM2, systemd, Docker) using `npm start` or `node dist/index.js`.
4. Configure HTTPS termination and CORS (`FRONTEND_URL`) to match your deployed frontend.

### Frontend
1. Ensure `NEXT_PUBLIC_API_BASE_URL` points to the deployed backend.
2. Build: `cd frontend && npm run build`.
3. Self-host with `npm start` (Node SSR) or deploy to Vercel/Netlify. When using Vercel, set environment variables in the dashboard and enable the `experimental.appDir` defaults provided by Next.js 16.

Additional deployment considerations (SSL, load balancing, secrets management) are covered in each workspace README.

---

## Manual QA Checklist

- **Authentication**: Use the seeded accounts to log in, refresh tokens via `/api/auth/refresh`, and verify role-based behavior (admin vs shopper).
- **Product Catalog**: Confirm the frontend list, detail, recommendations, and wishlist flows interact correctly with the API.
- **Orders & Checkout**: Place a checkout order from the storefront and confirm it appears under `/api/orders` via the authenticated API client.
- **AI Features**: Test the "Ask AI" modal in the frontend or call `/api/ai/search` directly. Validate fallback messaging when the Gemini API key is missing or quotas are exceeded.
- **Image Uploads**: Exercise the admin image upload endpoint and verify asset creation in your Cloudinary dashboard.

Detailed, step-by-step QA procedures live in `backend/README.md` and `frontend/README.md`.

---

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| **MongoDB connection failures** | Verify `MONGODB_URI`, ensure the service is running, check firewall rules/Atlas IP allowlist, and confirm credentials. |
| **Environment variables not loading** | Confirm `.env`/`.env.local` files exist, match the variable names above, and that you’ve restarted the servers after changes. |
| **CORS errors in browser** | Update `FRONTEND_URL` in the backend `.env` to match the exact origin (protocol, host, and port) of your frontend; restart the backend after changes. |
| **Gemini quota or auth errors** | Re-check `GEMINI_API_KEY`, monitor Google AI Studio quotas, and consider lowering `GEMINI_MAX_TOKENS` or adding retry guards for high-traffic deployments. |
| **Cloudinary upload failures** | Verify credentials, ensure the account allows unsigned uploads if configured, and confirm your Cloudinary folder exists. |

---

## Additional Resources

- Backend API reference, testing playbooks, and troubleshooting: [`backend/README.md`](backend/README.md)
- Frontend setup, QA scripts, and runtime notes: [`frontend/README.md`](frontend/README.md)
- Integration guide and UI/API contracts: [`frontend/docs/API_INTEGRATION.md`](frontend/docs/API_INTEGRATION.md)

For architecture diagrams or ERDs, adapt the overview schematic above or integrate your organization’s diagrams—this repository keeps the implementation details consistent with a typical e-commerce layered architecture.
