# Jackson Storefront Frontend

Polished, responsive single-vendor cosmetics, hair-care, barber-supplies, and salon-equipment storefront built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

All catalog data, prices, variants, inventory, and brands are fetched from the Jackson FastAPI backend.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React Context (`CartContext` with `localStorage` persistence)
- **Testing**: Jest, Testing Library (`@testing-library/react`), `jest-environment-jsdom`

---

## 🚀 Pages & Routing

| Route | Purpose | Features |
|---|---|---|
| `/` | Home & Category Grid | Hero banner, categories showcase, in-stock products preview, brand guarantee |
| `/categories/[categorySlug]` | Category View | Product types grid within the category, category products with filter sidebar and pagination |
| `/categories/[categorySlug]/[productTypeSlug]` | Product Type Catalog | Products of all brands within the product type, brand filter, price range, stock toggle, sorting, pagination |
| `/products/[productSlug]` | Product Detail | Variant selector, dynamic live pricing, stock availability, SKU, attributes, quantity picker, and Add to Cart action |
| `/cart` | Shopping Cart | Variant breakdown, quantity adjustment clamped by warehouse stock, line totals, subtotal calculation, checkout trigger |
| `/search` | Global Catalog Search | Search query results with brand/price filters and pagination |

---

## 🧩 Reusable Components

- [`Header`](src/components/Header.tsx): Brand emblem, desktop navigation, search bar, cart badge counter, responsive mobile drawer
- [`Footer`](src/components/Footer.tsx): Catalog links, store assurances, live backend status
- [`Breadcrumbs`](src/components/Breadcrumbs.tsx): Hierarchical path navigation matching storefront taxonomy
- [`CategoryCard`](src/components/CategoryCard.tsx): Category card with collection badge and product type counts
- [`ProductCard`](src/components/ProductCard.tsx): Product brand, name, price range/single price, and stock status badge
- [`ProductFilters`](src/components/ProductFilters.tsx): Brand dropdown, in-stock checkbox, price min/max inputs, sort selector, and search
- [`Pagination`](src/components/Pagination.tsx): URL-synced pagination with smart page windowing
- [`AddToCartForm`](src/components/AddToCartForm.tsx): Variant selector (SKU, attributes, price, stock), quantity controls, Add to Cart button
- [`CartDrawer`](src/components/CartDrawer.tsx): Slide-over cart sheet accessible from any page
- [`EmptyState`](src/components/EmptyState.tsx) & [`ErrorMessage`](src/components/ErrorMessage.tsx): User-friendly error banners and empty catalog views
- [`LoadingSkeleton`](src/components/LoadingSkeleton.tsx): Skeleton loading states for smooth rendering

---

## ⚙️ Environment Variables

Create `.env.local` in the `frontend` root:

```env
# Jackson FastAPI backend API base URL (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Optional: Storefront site title
NEXT_PUBLIC_SITE_NAME=Jackson
```

---

## 🧪 Testing & Verification

Run the automated test suite:

```bash
npm test
```

Build the production bundle:

```bash
npm run build
```

Run the local development server:

```bash
npm run dev
```
