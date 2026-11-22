# Annapurna Farm Fresh & Organics (अन्नपूर्णा)
### Clickable Frontend Demo & Owner Dashboard Prototype

A high-performance, responsive, frontend-only clickable demo for **Annapurna Farm Fresh & Organics**, an Indian farm-to-table organic grocery brand delivering sunrise harvests across Delhi NCR.

Built with **React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons + Recharts**.

---

## 🌟 Key Architecture & Highlights

1. **Two Complete Interfaces in One App**:
   - **Customer Storefront**: Premium landing page, produce catalog, category listings, interactive cart drawer, multi-step simulated checkout, live order tracking, wallet management, and referral rewards.
   - **Owner / Admin Dashboard**: Real-time sales metrics, product catalog with multi-select bulk operations, order fulfillment advancement, inventory threshold management, simulated wallet adjustments, and business analytics.

2. **Single Shared In-Browser Reactive State**:
   - Both interfaces interact through a unified reactive store persisted in `localStorage` (`ANNAPURNA_STORE_V1`).
   - Adding/editing products, advancing order statuses, debiting stock, or issuing referral rewards in one interface updates the other interface in real time with zero backend required.
   - Built-in graceful fallback to seed data if localStorage is absent or corrupted, with a **"Reset demo data"** button available in the Demo Guide and admin settings.

3. **Interactive Demo Story Guide**:
   - A floating interactive guide is embedded on both interfaces demonstrating the primary client story:
     1. Owner adds/edits a product in Admin (`/admin/products/new`).
     2. Product immediately appears in the customer shop (`/shop`).
     3. Customer adds item to basket and completes simulated checkout (`/checkout`).
     4. Order instantly lands in the owner's fulfillment queue (`/admin/orders`).
     5. Owner moves status through *Confirmed → Out for Delivery → Delivered*.
     6. Customer watches their live timeline update at `/orders/:id`.

---

## 🚀 Quick Start & Scripts

### Prerequisites
- Node.js `v18+` or `v20+` / `v22+`
- npm `v9+` or `v10+`

### Installation & Run

```bash
# Install dependencies
npm install

# Start local dev server (default port 5173)
npm run dev

# Run production build & type check
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Folder Structure

```
├── public/
│   ├── brand/
│   │   ├── logo-full.png        # Official brand logo with leaf swoosh
│   │   └── logo-simple.png      # Clean simple logo for preloader/favicon
│   └── images/
│       ├── banners/             # Hero harvest photography
│       ├── categories/          # 6 high-res category showcase photography
│       └── products/            # 20 natural studio product photography items
├── src/
│   ├── components/
│   │   ├── admin/               # AdminSidebar, AdminTopbar, BulkActionToolbar, ProductForm
│   │   ├── common/              # Preloader, TopProgressBar, PageTransition, DemoGuideModal
│   │   ├── storefront/          # StoreHeader, StoreFooter, CartDrawer, ProductCard, TabBar, HelpDrawer
│   │   └── ui/                  # Button, Input, Select, Modal, Drawer, Toast, ConfirmDialog, StatusBadge
│   ├── config/
│   │   ├── brandClaims.ts       # Quality claims flagged approved: false (TODO: confirm with client)
│   │   ├── business.ts          # Business info, addresses, FSSAI placeholder
│   │   └── pricing.ts           # Delivery tiers (₹40, free > ₹499), coupons (ANNA10)
│   ├── data/
│   │   └── seedData.ts          # 6 categories, 20 products, 5 customers, 6 orders, 8 wallet tx, 5 referrals
│   ├── lib/
│   │   ├── formatters.ts        # Currency and date formatting
│   │   ├── images.ts            # Image resolvers and fallback photography maps
│   │   └── utils.ts             # Tailwind class merge (clsx + twMerge), ID generator
│   ├── pages/
│   │   ├── admin/               # 12 admin pages (Dashboard, Products, Orders, Inventory, Analytics, etc.)
│   │   └── store/               # 13 customer pages (Home, Shop, Category, Checkout, Wallet, etc.)
│   ├── store/
│   │   └── AppStoreContext.tsx  # Unified reactive store with reducer and localStorage persistence
│   ├── types/
│   │   └── index.ts             # TypeScript domain models (Product, Order, Customer, WalletTransaction)
│   ├── App.tsx                  # Lazy-loaded route hierarchy
│   ├── index.css                # Tailwind design tokens, typography, custom scrollbars
│   └── main.tsx                 # Entrypoint
├── SPEC.md                      # Source of truth specification
├── vite.config.ts               # Vite configuration with chunk splitting
└── tailwind.config.js           # Design tokens: Forest green, lime, cream, brand-red
```

---

## 🎨 Design System & Tokens

| Token Role | Hex Code | Usage |
|---|---|---|
| **Primary** (Annapurna Forest Green) | `#14612A` | Brand color, buttons, accents |
| **Primary Dark** | `#0B3D1A` | Admin sidebar, deep footer |
| **Leaf Green** | `#4FA52A` | Sub-headings, botanical accents |
| **Lime** | `#A6CE39` | Active navigation states, highlights |
| **Brand Red** | `#D62828` | Main CTAs (5% rule), offers, discounts |
| **Marigold** | `#F5A524` | Low stock warnings, ratings |
| **Cream** | `#FAFAF3` | Page backgrounds, card fills |
| **Mint** | `#EAF4E4` | Soft pill badges, banner panels |
| **App Text** | `#1F2A22` | High-contrast readable typography |
| **Border** | `#DDE6D6` | Subtle organic container dividers |

- **Typography**: `Fraunces` for headings, `DM Sans` for UI/body, and `Noto Sans Devanagari` for Hindi accents.
- **Card Radius**: `16px` (`rounded-card`) with soft green shadows.

---

## 🔄 Replacing the Shared In-Browser Store with Production APIs

The demo uses `src/store/AppStoreContext.tsx` with `useReducer` and `localStorage` to emulate a live fullstack backend. In a live production environment, this can be transitioned to an API client (such as TanStack Query or RTK Query):

1. **Catalog API (`/api/products`, `/api/categories`)**:
   - Replace `dispatch({ type: 'ADD_PRODUCT' })` with `POST /api/products`.
   - Replace `dispatch({ type: 'BULK_UPDATE_PRODUCTS' })` with `PATCH /api/products/bulk`.
2. **Order & Checkout API (`/api/orders`)**:
   - Replace `dispatch({ type: 'PLACE_ORDER' })` with `POST /api/orders` accompanied by Razorpay / Cashfree webhook callbacks.
3. **Wallet & Referrals Ledger (`/api/wallet`, `/api/referrals`)**:
   - Replace in-memory ledger arrays with double-entry database ledger transactions.

---

## 📋 Items to Confirm with Client (from SPEC.md Section 10)

Before promoting to production, the following business items must be signed off by the client:

1. **Brand Quality Claims (`src/config/brandClaims.ts`)**:
   - Confirm specific lab validation for claims such as *"Ozone-Washed"* and *"Nitrate-Tested"*.
   - Never write "FDA Approved"; only confirm national Indian standards (e.g., FSSAI, Jaivik Bharat).
2. **Legal & Compliance Info (`src/config/business.ts`)**:
   - Confirm the legal entity name, central FSSAI registration number, registered office address, and customer helpline.
3. **Pricing & Delivery Rules (`src/config/pricing.ts`)**:
   - Final delivery charge (currently demo ₹40, free above ₹499).
   - Delivery slots (currently Morning 6–9 AM, Evening 5–8 PM).
   - Real coupon discount codes and minimum basket thresholds.
4. **Wallet Top-Up Terms**:
   - Customer wallet balance top-up rules, bonus thresholds, and refund policies.
5. **Referral Program Economics**:
   - Final reward amounts for referrer and referred customer (currently ₹100 / ₹50 sample placeholders).

