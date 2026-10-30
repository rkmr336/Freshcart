# FreshKart - Online Grocery Store Frontend

FreshKart is a modern, responsive, and complete grocery e-commerce web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It is themed in clean emerald green and crisp white, designed specifically for everyday household grocery shoppers in India.

---

## 🌟 Highlights & Features

- **Themed UI & Design System**: Custom Emerald Green (`#16A34A`), light green background tint (`#F0FDF4`), soft green borders (`#BBF7D0`), readable dark green headings, and amber discount callouts.
- **Offline-First Visuals**: Beautiful gradient cards with large grocery emojis (🍎, 🥕, 🥛, 🌾, 🍪) ensuring zero external image breakage or slow network asset dependencies.
- **Zero Hydration Mismatch & Safe Storage**: Context-based cart and wishlist storage with guarded hydration-safe `localStorage` synchronization.
- **Complete Shopping Workflow**:
  - **Header & Navigation**: Sticky header with live predictive search dropdown, category chips, wishlist counter, cart item badge, and mobile drawer.
  - **Home Page (`/`)**: Hero banner, category grid, promotional offers banner, featured groceries, best sellers, and "Why FreshKart" guarantee strip.
  - **Products Aisle (`/products`)**: Dynamic product catalog with real-time URL query sync (`?q=`, `?category=`, `?sort=`, `?inStock=`, `?maxPrice=`), sidebar filters, price slider, and pagination with "Load more".
  - **Product Detail (`/products/[slug]`)**: Showcase page with rating breakdown, MRP discount calculation, quantity picker, wishlist toggle, full description, and similar category products.
  - **Cart (`/cart`)**: Item quantities with interactive stepper, free delivery progress bar, item removal, "Move to wishlist", and discount coupon engine.
  - **Checkout (`/checkout`)**: Client-side validated form (10-digit Indian phone, 6-digit PIN, address, slot options), delivery time selector, payment simulator (COD, UPI, Card), and instant order placement.
  - **Order Confirmation (`/order-success`)**: Displays simulated order summary, delivery slot ETA, item breakdown, and saved address.
  - **Wishlist (`/wishlist`)**: Saved products management with direct one-click "Add to cart" and item removal.
  - **Interactive Micro-features**: Mini-cart drawer sliding in on add-to-cart, toast alerts, custom 404 page, and error boundary.

---

## 🎟️ Active Promo Coupon

Use promo code **`FRESH10`** in the cart or checkout page to unlock an instant **10% extra discount** on the entire subtotal!

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js (latest stable, App Router)
- **Language**: TypeScript (strict types for products, categories, cart, and orders)
- **Styling**: Tailwind CSS v4
- **Icons**: `lucide-react`
- **Fonts**: `next/font` (Google Fonts: Poppins for headings, Inter for body text)
- **State Management**: React Context (`CartContext`, `WishlistContext`, `ToastContext`)

---

## 📁 Folder Structure

```
freshkart-store/
├── app/
│   ├── cart/page.tsx               # Cart page with coupon & totals
│   ├── checkout/page.tsx           # Form validation & simulated checkout
│   ├── order-success/page.tsx      # Order confirmation & receipt
│   ├── products/
│   │   ├── [slug]/page.tsx         # Product detail dynamic route
│   │   ├── [slug]/not-found.tsx    # 404 handler for invalid product slugs
│   │   └── page.tsx                # Product catalog with URL filters
│   ├── wishlist/page.tsx           # Wishlist page
│   ├── error.tsx                   # Global error boundary
│   ├── globals.css                 # Tailwind & design system theme variables
│   ├── layout.tsx                  # Root layout (Header, CartDrawer, Footer)
│   ├── not-found.tsx               # Global 404 page
│   └── page.tsx                    # FreshKart Home page
├── components/
│   ├── CartDrawer.tsx              # Slide-over mini-cart drawer
│   ├── Footer.tsx                  # Footer with links & newsletter
│   ├── Header.tsx                  # Sticky header with search autocomplete
│   ├── OrderSuccessPageContent.tsx # Order success client component
│   ├── ProductCard.tsx             # Reusable card with stepper & badges
│   ├── ProductDetailView.tsx       # Interactive product detail view
│   ├── ProductsPageContent.tsx     # Filterable products grid
│   └── QuantityStepper.tsx         # Clean +/- quantity stepper component
├── context/
│   ├── CartContext.tsx             # Cart state, quantities & coupons
│   ├── ToastContext.tsx            # Animated notifications
│   └── WishlistContext.tsx         # Wishlist state & persistence
├── data/
│   ├── categories.ts               # 8 Grocery categories
│   └── products.ts                 # 40 realistic grocery items in INR
├── lib/
│   └── helpers.ts                  # Currency formatting, totals & order generator
├── types/
│   └── index.ts                    # TypeScript interfaces
├── README.md                       # Documentation
└── package.json
```

---

## 🚀 How to Install and Run

### 1. Windows (PowerShell)
```powershell
# Navigate into the project folder
cd freshkart-store

# Run development server
npm run dev
```

### 2. macOS / Linux (Terminal)
```bash
# Navigate into the project folder
cd freshkart-store

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ How to Customize

### 1. Modifying or Adding Products
Edit [`data/products.ts`](data/products.ts) to add or edit grocery items:
```typescript
{
  id: "fk-xx-01",
  slug: "my-custom-item",
  name: "Organic Honey",
  category: "Household",
  categorySlug: "household",
  emoji: "🍯",
  price: 240,
  mrp: 300,
  unit: "500 g",
  rating: 4.8,
  reviewCount: 45,
  description: "Raw forest wild honey.",
  inStock: true,
  tags: ["honey", "organic", "natural"],
  isFeatured: true,
  isBestSeller: true
}
```

### 2. Modifying Colors & Theme
All theme variables are centralized in [`app/globals.css`](app/globals.css):
- Primary Brand Green: `--primary: #16A34A;`
- Hover Green: `--primary-hover: #15803D;`
- Soft Background: `--bg-light: #F0FDF4;`
- Border Accent: `--border-soft: #BBF7D0;`
- Discount Badge: `--accent-badge: #F59E0B;`

---

## 🚢 Deploy to Vercel (When Ready)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: FreshKart grocery frontend"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New Project** and import the `freshkart-store` repository.
4. Framework preset **Next.js** will be detected automatically.
5. Click **Deploy**!
