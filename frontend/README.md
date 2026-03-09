# Jewellery E-Commerce Store

A modern, minimalist jewellery e-commerce platform built on the Internet Computer with React and Motoko.

## Features

- **Storefront**: Browse products with category filtering and price sorting
- **Product Pages**: Detailed product views with image zoom
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout**: Validated shipping form (Stripe-ready payment placeholder)
- **Admin Dashboard**: Secure product management with Internet Identity authentication
- **Image Storage**: Product images stored on-chain using IC blob storage

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query
- **Styling**: Tailwind CSS with custom OKLCH color system
- **UI Components**: Shadcn/ui (Radix primitives)
- **Backend**: Motoko (Internet Computer)
- **Authentication**: Internet Identity
- **Storage**: On-chain blob storage for product images

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- DFX (Internet Computer SDK)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

### Local Development

1. Start the local Internet Computer replica:
   ```bash
   dfx start --clean --background
   ```

2. Deploy the backend canister:
   ```bash
   dfx deploy backend
   ```

3. Generate TypeScript bindings:
   ```bash
   dfx generate backend
   ```

4. Start the frontend development server:
   ```bash
   pnpm start
   ```

5. Open http://localhost:3000 in your browser

### Admin Setup

The first admin must be initialized using a secret token in the URL:

1. Get your Internet Identity principal by logging in
2. Add the admin token to the URL hash:
   ```
   http://localhost:3000/#caffeineAdminToken=YOUR_SECRET_TOKEN
   ```
3. The token is automatically stored in session storage and removed from the URL
4. Once authenticated as admin, you can access the Admin Dashboard at `/admin`

**Security Note**: The admin token is passed via URL hash fragment (not query params) for better security:
- Hash fragments are not sent to servers
- Not logged in server access logs
- Not sent in HTTP Referer headers
- Automatically cleared from URL after extraction

### Building for Production

