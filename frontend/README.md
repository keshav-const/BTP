# E-Store Frontend

A modern e-commerce storefront built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Zustand for state management, and SWR for data fetching. The application consumes the Express API in `../backend` to deliver a responsive shopping experience with AI-assisted discovery.

## Table of Contents

1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Configuration](#environment-configuration)
6. [Running the Frontend](#running-the-frontend)
7. [Build & Deployment](#build--deployment)
8. [Manual QA Playbook](#manual-qa-playbook)
9. [Troubleshooting](#troubleshooting)
10. [Available Scripts](#available-scripts)
11. [Additional Resources](#additional-resources)

---

## Key Features

- **Responsive UI** with tailored components, dark-mode-ready styles, and smooth animations.
- **Authentication & Authorization** powered by JWTs with automatic token refresh, logout on 401, and role-based guards for admin routes.
- **Cart & Wishlist** management with Zustand and persistent local storage (SSR-safe hydration).
- **Checkout Flow** including multi-step address, review, and payment forms.
- **AI Integration** with an "Ask AI" search modal that leverages `/api/ai/search` to suggest filters and update product listing URLs.
- **API Layer** using Axios with interceptors and SWR for efficient data fetching and caching.
- **Manual QA-friendly UI** with loading, error, and empty states to simplify testing.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, CSS variables |
| State | Zustand (auth, cart, wishlist, UI stores) |
| Data Fetching | Axios + SWR |
| Icons | Lucide React |
| Tooling | ESLint (flat config), PostCSS, Tailwind CLI |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # App Router routes and layouts
│   │   ├── (auth)/               # Login/Register routes
│   │   ├── products/             # Listing + detail pages
│   │   ├── cart/                 # Shopping cart
│   │   ├── wishlist/             # Wishlist
│   │   ├── checkout/             # Multi-step checkout
│   │   ├── account/              # Account dashboard
│   │   ├── admin/                # Admin section (guarded)
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page with AI search
│   ├── api/                      # API client modules (auth, products, ai, orders)
│   ├── components/               # Reusable UI & layout components
│   ├── hooks/                    # Custom hooks (useAuth, useCart, etc.)
│   ├── store/                    # Zustand stores
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # Helpers (formatting, classNames)
├── public/                       # Static assets
├── docs/                         # Additional documentation (API integration)
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Web app scripts & dependencies
```

---

## Getting Started

### Prerequisites
- Node.js **v18.17+**
- npm **v9+**
- Running backend API (default `http://localhost:3001/api`) with seeds and environment variables configured (see [`../backend/README.md`](../backend/README.md)).

### Installation

```bash
cd frontend
npm install
```

---

## Environment Configuration

Create `frontend/.env.local` with the following keys:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_TOKEN_KEY=ecommerce_auth_token
```

| Variable | Purpose | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API (must include `/api`). | Update for each environment (dev/staging/prod). |
| `NEXT_PUBLIC_APP_URL` | Public URL of the storefront used for redirects and canonical links. | Match the domain/port you launch Next.js with. |
| `NEXT_PUBLIC_AUTH_TOKEN_KEY` | Local storage key used by the auth store. | Changing this invalidates stored sessions. |

Restart `npm run dev` after editing `.env.local`.

---

## Running the Frontend

```bash
npm run dev
```

- Launches Next.js in development mode on `http://localhost:3000`.
- Automatically proxies requests to the backend using the configured `NEXT_PUBLIC_API_BASE_URL`.
- Hot reloads pages and components on change.

To run the full stack locally:
1. Start MongoDB.
2. Run `npm run dev` in `../backend` (with `PORT=3001`).
3. Run `npm run dev` in `frontend/`.
4. Seed data (`npm run seed` in backend) for demo products and accounts.

---

## Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

- `npm run build` compiles the Next.js app.
- `npm start` serves the production build on `PORT=3000` by default.

### Deployment Options

| Option | Notes |
|--------|-------|
| **Vercel** | Recommended for SSR; configure environment variables via Vercel dashboard. Point the backend URL to your deployed API. |
| **Self-hosted Node** | Run `npm run build` followed by `npm start` behind a reverse proxy (NGINX/Caddy). Ensure the server has Node.js 18+ and that process manager (PM2/systemd) restarts on failure. |
| **Docker** | Build a Node-based image that copies the repository, installs dependencies, runs `npm run build`, and starts via `npm start`. |

> Always verify CORS configuration on the backend (`FRONTEND_URL`) matches the deployed frontend origin.

### Static Asset Optimisation
- Product images are served from Cloudinary; no additional configuration required.
- Optimise fonts and icons through Next.js built-in optimisations.

---

## Manual QA Playbook

The following checks align with the backend QA flow and validate end-to-end functionality.

1. **Authentication**
   - Login via `/login` using `admin@example.com` / `admin123` or another seeded user.
   - Open DevTools > Application > Local Storage and confirm `NEXT_PUBLIC_AUTH_TOKEN_KEY` entry is created.
   - Refresh the page and confirm session persistence.
   - Attempt accessing `/admin` as a non-admin and confirm redirection or access denial.

2. **Product Experiences**
   - Visit `/products` and apply filters (category, price range) to ensure the URL updates and results refresh via SWR.
   - Inspect a product detail page to confirm descriptions, highlights, recommendations, and wishlist toggle behave correctly.

3. **Ask AI Search**
   - Open the "Ask AI" modal on the home page.
   - Submit a query such as “Show me gaming laptops under $2000”.
   - Validate success toast, filter chips, and resulting navigation to `/products` with applied query params.
   - Disable or remove `GEMINI_API_KEY` on the backend to ensure the UI surfaces fallback messaging without breaking the flow.

4. **Cart & Checkout**
   - Add multiple products to the cart, adjust quantities, and verify totals.
   - Complete the checkout flow; confirm the success toast and redirection to `/account?tab=orders`.
   - Check the backend `/api/orders` endpoint (or Account Orders tab) to verify the new order exists.

5. **Wishlist**
   - Toggle wishlist status on a product card and confirm persistence in `/wishlist`.
   - Use “Clear wishlist” and ensure the UI updates instantly.

6. **Image Upload Experience**
   - (Requires admin) Navigate to an admin product creation/edit screen (or run manual Postman upload) and confirm new images appear in Cloudinary. Validate the frontend refreshes product galleries after the upload.

7. **Error States**
   - Stop the backend server and confirm the frontend shows user-friendly error toasts via the Axios interceptor.
   - Remove required environment variables locally to ensure the app fails fast with descriptive messages in the console.

Document outcomes in your QA checklist before promoting builds.

---

## Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| 404s or CORS errors on API calls | `NEXT_PUBLIC_API_BASE_URL` incorrect or backend `FRONTEND_URL` mismatch | Update both env files and restart servers. |
| Infinite loading states | Backend unavailable or authentication failure | Check browser console, verify tokens in local storage, and ensure backend `/health` responds. |
| AI search modal returns generic results | Gemini fallback triggered | Confirm `GEMINI_API_KEY` validity, inspect backend logs, and monitor quota usage. |
| Orders/cart not persisting | Local storage disabled or key mismatch | Ensure `NEXT_PUBLIC_AUTH_TOKEN_KEY` and store keys are consistent, and that the browser allows storage. |
| Styling inconsistencies | Tailwind build cache or conflicting classes | Restart `npm run dev`, clear `.next/`, and ensure global styles aren’t overridden. |

---

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Launch production build
npm run lint    # Run ESLint (flat config)
```

---

## Additional Resources

- Backend API reference and troubleshooting: [`../backend/README.md`](../backend/README.md)
- Integration guide with request/response contracts: [`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md)
- Monorepo overview and deployment considerations: [`../README.md`](../README.md)

Leverage these documents when onboarding new developers, planning deployments, or executing QA cycles.
