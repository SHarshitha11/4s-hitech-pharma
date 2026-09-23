# 4S HITECH PHARMA

A Next.js-based pharmaceutical distribution and pharmacy ordering platform.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Git
- npm

## Project Structure

- `src/app/` - Application routes and pages
- `src/components/` - Reusable UI components
- `src/features/` - Business-specific modules
- `src/hooks/` - Reusable React hooks
- `src/lib/` - Libraries and shared configuration
- `src/services/` - Backend/API communication
- `src/types/` - TypeScript types
- `src/constants/` - Application constants
- `src/config/` - Shared configuration
- `src/utils/` - Utility functions

## Route Areas

### Public

- /about
- /products
- /manufacturing
- /distribution
- /contact
- /register-pharmacy

### Pharmacy

- /pharmacy/dashboard
- /pharmacy/products
- /pharmacy/cart
- /pharmacy/checkout
- /pharmacy/orders
- /pharmacy/invoices
- /pharmacy/support
- /pharmacy/profile

### Admin

- /admin/dashboard
- /admin/pharmacies
- /admin/products
- /admin/inventory
- /admin/orders
- /admin/invoices
- /admin/deliveries
- /admin/support
- /admin/users
- /admin/reports

## Environment Configuration

Create a `.env.local` file with the required environment variables.

``env
NEXT_PUBLIC_APP_NAME="4S HITECH PHARMA"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
`` 

Do not commit `.env.local` to Git.

## Getting Started

Install dependencies:

``bash
npm install
`` 

Start the development server:

``bash
npm run dev
`` 

Open http://localhost:3000 in your browser.

## Code Quality

Run ESLint:

``bash
npm run lint
`` 

Run the production build:

``bash
npm run build
`` 

Format files with Prettier:

``bash
npx prettier --write .
`` 

## Project Status

Initial project setup is complete. The project is prepared for design-system and reusable-component development.
