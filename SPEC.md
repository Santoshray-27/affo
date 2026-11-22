# Annapurna Farm Fresh & Organics: Antigravity Prompt Pack v2 (Full Spec)

This version merges the Frontend Page Specification (customer storefront + owner/admin dashboard) with the brand design system, landing page and logo preloader. It REPLACES the earlier Next.js pack. Stack is now React + Vite + Tailwind, as the spec requires.

HOW TO USE
1. Create an empty folder, open it in Antigravity.
2. Put logos in `/public/brand/` (`logo-full.png` = leaf logo with swoosh, `logo-simple.png` = clean logo).
3. Paste PROMPT 0 first, wait, check the app runs. Then paste prompts 1 to 12 in order, checking each in the browser.
4. After Prompt 12, use the acceptance checklist (end of this file).
5. Also paste the "SPEC REFERENCE" block (below) into Antigravity as a file named `SPEC.md` in the project root so it can re-read it at any time. You can paste the full spec document you shared into that file.

---------------------------------------------------------------------

## DESIGN SYSTEM

| Role | Hex |
|---|---|
| Primary (Annapurna Forest Green) | #14612A |
| Primary dark | #0B3D1A |
| Leaf green | #4FA52A |
| Lime | #A6CE39 |
| Brand red (main CTAs, offers, small accents only) | #D62828 |
| Marigold (ratings, warnings, low stock) | #F5A524 |
| Cream (page background) | #FAFAF3 |
| Mint (soft sections) | #EAF4E4 |
| Text / Muted / Border | #1F2A22 / #6B7A6F / #DDE6D6 |
| Success / Error | #2E9E4F / #D62828 |

Rule: about 70% green, 25% cream and white, 5% red.
Fonts: Fraunces (headings), DM Sans (body/UI), Tiro Devanagari Hindi and Noto Sans Devanagari (Hindi accents).
Shape: 16px card radius, pill buttons, soft green shadows. Motion: Framer Motion 250 to 500ms ease-out.
Admin uses the same palette but denser: white cards on a cream/mint background, dark-green sidebar (#0B3D1A) with lime active state.

---------------------------------------------------------------------

## PROMPT 0: MASTER BRIEF (paste first)

```
You are a senior product designer and frontend engineer. Build a frontend-only, clickable DEMO for "Annapurna Farm Fresh & Organics" (अन्नपूर्णा), an Indian online grocery brand. There are TWO separate interfaces in one app: (1) Customer Storefront, (2) Owner/Admin Dashboard. Read SPEC.md in the project root: it is the source of truth for pages, fields, and behaviors.

TECH STACK
- React 18 + Vite + TypeScript + Tailwind CSS + React Router v6 + Framer Motion + Lucide icons.
- State: React Context + useReducer (or Zustand) as ONE shared in-browser store used by both storefront and admin. Persist products, categories, customers, cart, orders, wallet transactions and referrals to localStorage. Seed mock data on first load. If localStorage is missing/corrupted, fall back to seed data. Add a demo "Reset demo data" action in a non-customer-facing place (admin footer or settings).
- Charts: Recharts. Toasts: sonner or a custom Toast. Forms: react-hook-form + zod validation.
- No backend, no real payments, no real auth. Everything simulated and clearly labelled "Demo".

BRAND
- Logos are in /public/brand/logo-full.png and /public/brand/logo-simple.png; use them as provided, never redraw or recolor them.
- Generate all product, category, banner and lifestyle images with your image tool (clean, bright, natural food photography, consistent style). Save in /public/images/{products,categories,banners}.
- Do NOT invent certifications or quality claims. Put all brand claims (e.g. "Ozone-Treated", "Nitrate-Tested", any certification) in /src/config/brandClaims.ts with an `approved: false` flag and show them only as clearly editable placeholder copy, with a TODO comment "confirm with client". Never write "FDA Approved". Contact details and FSSAI number are placeholders in /src/config/business.ts.

DESIGN SYSTEM (tailwind.config + CSS variables)
Colors: primary #14612A, primary-dark #0B3D1A, leaf #4FA52A, lime #A6CE39, brand-red #D62828, marigold #F5A524, cream #FAFAF3, mint #EAF4E4, text #1F2A22, muted #6B7A6F, border #DDE6D6.
Rule: ~70% green, ~25% cream/white, ~5% red for main CTAs and small accents.
Fonts: Fraunces for headings, DM Sans for body, Tiro Devanagari Hindi / Noto Sans Devanagari for Hindi accents.
Shape: 16px radius cards, pill buttons, soft green-tinted shadows, generous whitespace.

ROUTES (exactly as in SPEC.md)
Customer: / , /shop , /category/:slug , /product/:productId , /cart , /checkout , /order-success/:orderId , /account , /orders , /orders/:orderId , /wallet , /referrals , /profile
Admin: /admin/login , /admin , /admin/products , /admin/products/new , /admin/products/:productId/edit , /admin/orders , /admin/orders/:orderId , /admin/inventory , /admin/customers , /admin/wallet , /admin/referrals , /admin/analytics
- Customer and admin use different layouts (StorefrontLayout vs AdminLayout) with clearly distinct navigation.
- Provide a small, clearly labelled "Owner Demo" entry link in the storefront footer (not in the main header) and a "Back to Storefront" link in the admin top bar. Admin routes are protected by a mock login flag in the store.
- 404 page, safe not-found states for invalid product/order IDs, no blank pages anywhere, no inert buttons: every prominent action must navigate, open a modal/drawer, update state, or show a clear "Demo only / coming later" toast.

SHARED DATA MODEL (TypeScript types in /src/types)
Product {id, name, description, categoryId, image, price, compareAtPrice?, unitLabel, stockQuantity, isActive, createdAt, updatedAt}
Category {id, name, slug, image?, description?}
Customer {id, name, mobile, email?, addresses[], walletBalance, referralCode}
CartItem {productId, quantity}
Order {id, customerId, items[], deliveryAddress, subtotal, deliveryCharge, discount, total, paymentMethod, paymentStatus, orderStatus, createdAt, internalNote?}
WalletTransaction {id, customerId, type(credit|debit|refund|reward), amount, description, createdAt, referenceId?}
Referral {id, referralCode, referrerCustomerId, referredCustomerId?, status, rewardAmount, createdAt}
Order statuses: Pending, Confirmed, Processing, Out for Delivery, Delivered, Cancelled.
Stock status derived: In Stock, Low Stock (threshold constant LOW_STOCK=10), Out of Stock.
Pricing rule (label as "sample demo pricing"): delivery ₹40, free above ₹499; sample coupon ANNA10 = 10% off. Keep these in /src/config/pricing.ts.

SEED DATA
6 categories (Fruits, Vegetables, Organics, Exotics, Juices & Beverages, Salads & Dips). 18 to 20 products with a mix of in-stock, low-stock, out-of-stock and inactive. 5 customers (one is the demo logged-in customer "Demo Customer"). 6 orders across all statuses. 8 wallet transactions. 5 referral records. All clearly sample data.

CROSS-INTERFACE RULES (must work through the shared store)
1. Admin adds a product -> appears in /shop.
2. Admin edits price/name/image/category/unit/availability -> storefront reflects it.
3. Bulk edit updates all selected products.
4. Customer checkout creates an order, clears the cart, decrements stock.
5. New order appears in admin orders immediately.
6. Admin changes order status -> customer tracking shows it.
7. Admin changes stock -> customer availability changes; out-of-stock products cannot be added to cart.
8. Wallet and referral records show consistently in both views.

QUALITY RULES
- Responsive: mobile (360), tablet (768), desktop (1440). Storefront gets a mobile bottom tab bar; admin sidebar collapses to a drawer.
- Accessibility AA, keyboard focus, aria labels, 44px tap targets.
- Every list has loading skeleton, empty state, and error state.
- Reusable components as listed in SPEC.md section 6 (StoreHeader, ProductCard, QuantityStepper, DataTable, StatusBadge, ConfirmDialog, BulkActionToolbar, etc.).

Now scaffold: project, tokens, fonts, folder structure (/src/{components,pages/{store,admin},store,types,config,data,lib}), seed data, the shared store with actions and localStorage persistence, both layouts (header/footer/tab bar for storefront; sidebar/topbar for admin), the router with all routes as placeholder pages, and shared UI components (Button, Input, Select, Modal/Drawer, Toast, EmptyState, ErrorState, LoadingState, ConfirmDialog). Run the app and show it working.
```

---------------------------------------------------------------------

## PROMPT 1: LOGO PRELOADER AND PAGE TRANSITIONS

```
Add the branded preloader and transitions.

PRELOADER (first load per session, via sessionStorage)
- Full-screen cream overlay with a soft green radial glow.
- /public/brand/logo-simple.png fades and scales in (0.92 to 1) with a subtle spring; a leaf-shaped green sweep wipes left-to-right across the logo as if it is growing in; small leaf particles float upward.
- Thin progress line (green to lime) under the logo fills with real asset loading; min display 1.6s, max 3s. Fade-in tagline "Farm Fresh & Organics".
- Exit: logo scales down toward the header logo position (shared-element feel) while the overlay splits into two panels sliding up and down, about 700ms total.
- Respect prefers-reduced-motion (simple fade).
- Do not show the preloader on admin route refreshes after the first load in a session.

TRANSITIONS
- Route transitions: 350ms fade + slight upward slide using AnimatePresence.
- Thin top progress bar on navigation.
- Skeleton shimmer components for grids, cards, tables (mint tones).
Build <Preloader/>, <PageTransition/>, <TopProgressBar/>, <Skeleton/>. No layout shift, no flicker.
```

---------------------------------------------------------------------

## PROMPT 2: CUSTOMER HOME (C01) WITH NEXT-LEVEL LANDING

```
Build the Home page "/" (spec C01) as a premium landing page. Original layout and copy.

Required by spec: announcement strip, main nav with logo + shop/category nav + search + account + cart, hero with "Shop Now", shop-by-category, featured/best-selling products, promo/seasonal banner, brand trust/quality section (placeholder claims from brandClaims.ts), referral promo linking to /referrals, footer with business info (placeholders from business.ts) and the small "Owner Demo" link.

Landing enhancements:
- Hero (about 90vh): Fraunces headline, a Hindi accent line "अन्नपूर्णा – सबके लिए स्वस्थ भोजन", Shop Now (red) + secondary button, floating parallax collage of generated produce, soft leaf shapes, pincode-check input (demo).
- Offer banner carousel (autoplay, swipe, dots).
- Circular category chips row (links to /category/:slug).
- "How it works" 4-step scroll-animated timeline (Farm, Quality check, Pack, Doorstep).
- Featured products carousel and "Under ₹99" grid, using live data from the store.
- Membership/wallet teaser panel (links to /wallet, marked demo).
- Refer & Earn strip ("Refer a friend and both get a reward", amount shown as placeholder from config).
- Recipe / editorial cards, testimonials slider (sample), counters (placeholder values in config).
- App-download section with phone mockup (demo, no real store links).
- Scroll-reveal animations, hover zoom, sticky mini-cart summary when the cart has items.

Interactions: category click -> category listing; product click -> product detail; search submit -> /shop?q=...; Add-to-cart updates cart count and store; Shop Now -> /shop; referral CTA -> /referrals. Header: icon-over-label actions (Shop, Wallet, Account, Cart with badge), pill search with live suggestions, category chip row under header, floating help bubble (opens a demo help drawer), mobile bottom tab bar.
```

---------------------------------------------------------------------

## PROMPT 3: SHOP, CATEGORY, PRODUCT DETAILS (C02, C03, C04)

```
Build /shop, /category/:slug and /product/:productId per spec.

SHOP and CATEGORY
- Title/intro (category page adds name, description/banner, breadcrumb back to Shop).
- Search input, category filter (pre-applied on category pages), sort (Featured, Price low-high, Price high-low), product count, clear-filters action, empty state. Sync q/sort/category with URL query params.
- Layout switcher: Grid (3 to 4 cols), List, Compact. Remember choice in localStorage. Left filter sidebar on desktop, bottom-sheet on mobile (price range, availability, on-offer).
- Only isActive products are shown to customers.
- ProductCard: image, name, category, price, unit label, optional compare-at price + discount badge, availability indicator, Add button that becomes a QuantityStepper. Out-of-stock cards show a clear "Out of stock" state and cannot be added. Quick-view modal. Card opens product page.

PRODUCT DETAILS
- Image gallery area (thumbnails + zoom), name, price + unit, availability, description, quantity selector with valid limits (max = stock), Add to Cart with toast confirmation, Buy Now (adds then goes to /cart), related/recommended products (same category), breadcrumbs/back navigation.
- Tabs: Description, Details (unit, category), Reviews (sample).
- Invalid product ID -> safe not-found state with link to /shop.
```

---------------------------------------------------------------------

## PROMPT 4: CART, CHECKOUT, ORDER SUCCESS (C05, C06, C07)

```
Build /cart, /checkout and /order-success/:orderId.

CART
- Line items (image, name, unit, unit price, quantity stepper, remove), subtotal, delivery charge line (rule from pricing.ts, labelled "sample demo pricing"), discount line, total, coupon / referral-code input (ANNA10 works; invalid shows error), free-delivery progress bar, Continue Shopping (/shop), Proceed to Checkout (/checkout), empty-cart state with suggestions. Cart persists across pages and refresh. Cart drawer (slide-in) from the header icon too.

CHECKOUT (3 clear sections or steps with sticky order summary)
1. Delivery address: select saved address (autofills) or add a new one in a form. Fields: name, mobile, address line, area/locality, city, PIN code, optional delivery note. Validate with zod (10-digit mobile, 6-digit PIN).
2. Optional delivery slot picker (demo).
3. Order summary: items, quantities, subtotal, delivery charge, discount, final total.
4. Payment method selection (demo, no real data collected): UPI (GPay, PhonePe, Paytm tiles + UPI ID field with format validation only), Card / Net Banking (show a simple "pay on a secure page (demo)" panel, do NOT collect real card numbers), Wallet balance toggle, Cash on Delivery. Add a visible "Demo payment: no real money is charged" note.
5. Place Order: validates, creates a local order with a unique demo ID (e.g. ANN-2026-0001), sets paymentStatus to "Paid (simulated)" or "Pending (COD)", orderStatus "Pending", decrements stock, debits wallet if used (adds a wallet transaction), clears the cart, and navigates to /order-success/:orderId. Block if any cart item is now out of stock with a clear message.

ORDER SUCCESS
- Success animation (brand-color confetti), demo order ID, total, payment method + simulated payment status, delivery address summary, buttons View Order (/orders/:orderId) and Continue Shopping (/shop). Unknown order ID -> safe not-found state.
```

---------------------------------------------------------------------

## PROMPT 5: ACCOUNT, ORDER HISTORY, TRACKING (C08, C09, C10)

```
Build /account, /orders and /orders/:orderId.

ACCOUNT (/account)
- Customer name and contact summary, shortcut cards (Orders, Wallet, Referrals, Profile & Addresses), recent order summary, demo reset/sign-out action (mock). Layout: persistent left menu card on desktop (avatar, phone, menu rows with icon/title/subtitle/right link), full-screen list on mobile.

ORDER HISTORY (/orders)
- Order list with order ID, date, item count, thumbnails, total, payment method/status, fulfilment StatusBadge, View Details. Status filter (All, Processing, Delivered, Cancelled) plus search. Empty state. New orders appear instantly.

ORDER DETAILS (/orders/:orderId)
- Order ID and date, items, delivery address, price breakdown, payment method + status, current status, and an OrderStatusTimeline (Pending -> Confirmed -> Processing -> Out for Delivery -> Delivered; Cancelled shown as a terminal red state). No map/GPS; the timeline is enough.
- Reflects status changes made in the admin dashboard in real time (store subscription).
- Actions: Reorder (adds in-stock items to the cart), Download invoice (demo toast), Cancel order (only while Pending/Confirmed), Need help (opens demo help drawer).
- Invalid ID -> not-found state.
```

---------------------------------------------------------------------

## PROMPT 6: WALLET, REFERRALS, PROFILE (C11, C12, C13)

```
Build /wallet, /referrals, /profile.

WALLET (/wallet)
- Wallet balance card (animated number), transaction history table (type credit/debit/refund/reward, amount, date, description/reference) with filter chips and empty state. Reflects shared-store transactions (checkout debits, referral rewards).
- "Add Money" is shown as a clearly labelled non-functional demo placeholder (opens a modal saying "Wallet top-up rules to be confirmed. Demo only."). No money transfer or withdrawal.

REFER & EARN (/referrals)
- Explanation of the programme (copy and reward amount are placeholders from config, labelled "to be confirmed"), the customer's referral code with Copy Code (clipboard + toast), Share button (Web Share API with copy-message fallback), reward summary stats, referral activity list (status Pending/Completed, reward, date) from the store.
- A "Simulate a friend joining" demo button that creates a completed referral and a wallet reward credit, so the wallet and the admin referral page show it.

PROFILE and ADDRESSES (/profile)
- Edit name, mobile, optional email; saved address list with add/edit/delete, default-address indicator; validation; saves to store; addresses are selectable at checkout. No OTP.
```

---------------------------------------------------------------------

## PROMPT 7: ADMIN SHELL, LOGIN, DASHBOARD (A01, A02)

```
Build the owner interface shell and first pages.

ADMIN LAYOUT
- Dark-green sidebar (#0B3D1A, lime active state, logo at top) with: Dashboard, Products, Orders, Inventory, Customers, Wallet, Referrals, Analytics. Collapses to a drawer on mobile. Topbar with page title, global search (demo), notifications bell (low stock and new orders from the store), "Back to Storefront" link, and an owner avatar menu (Reset demo data, Logout).
- Guard /admin/* with the mock login flag.

LOGIN (/admin/login)
- Annapurna branding, a simple mock form (email + password with obvious demo credentials shown as help text, e.g. owner@annapurna.demo / demo1234, which are NOT real) and an "Enter demo dashboard" button. Success -> /admin.

DASHBOARD (/admin)
- Metric cards: total sales/revenue, total orders, pending orders, products listed, low-stock products, total customers; all derived from the shared store; each links to the relevant filtered page.
- Recent orders list (click opens the order), sales trend chart (Recharts line/area), best-selling products, low-stock alerts, quick actions (Add Product, View Orders, Manage Inventory).
```

---------------------------------------------------------------------

## PROMPT 8: ADMIN PRODUCTS WITH BULK EDIT (A03, A04, A05)

```
Build /admin/products, /admin/products/new and /admin/products/:productId/edit. This is a key client requirement.

PRODUCT MANAGEMENT
- DataTable with columns: checkbox, image + name, category, unit/pack, price, stock, availability/status (StatusBadge), last updated, actions. Search by name, category filter, status filter (Active/Inactive, In/Low/Out of stock), sortable columns, pagination. Add Product button; per-row Edit and Delete (ConfirmDialog).
- Select-all and per-row checkboxes. When 1 or more are selected, show a sticky BulkActionToolbar with: Update price (fixed amount or percentage, increase/decrease), Update stock (set or add), Change category, Mark active/inactive, Delete.
- Every bulk action opens a ConfirmDialog with a preview/summary (e.g. "12 products: price +5%. Example: Apple ₹120 -> ₹126") before applying. After applying, show a toast with an Undo option (restore previous values) for a few seconds.
- All changes write to the shared store, so the storefront updates immediately.

ADD PRODUCT and EDIT PRODUCT (shared ProductForm)
- Fields: name, description, category, image (file input with local preview via URL.createObjectURL or base64; no real upload), selling price, optional compare-at price (validate it is higher than price), unit/pack label (free text with suggestions like 500 g, 1 kg, 1 pack, per piece), stock quantity, active toggle.
- Required-field validation, Save (adds/updates in store, returns to list, toast), Cancel. Edit page preloads values; invalid product ID -> safe not-found state. Live "Storefront preview" card on the right showing how the product card will look.
```

---------------------------------------------------------------------

## PROMPT 9: ADMIN ORDERS AND INVENTORY (A06, A07, A08)

```
Build /admin/orders, /admin/orders/:orderId and /admin/inventory.

ORDERS
- Table: order ID, customer name/contact, date, item count, total, payment method/status, fulfilment StatusBadge, View Details. Search by order ID or customer, status filter tabs with counts, optional date range filter, empty state. New customer orders appear immediately (highlight "New" for a short time).

ORDER DETAILS
- Order ID/date, customer name and contact, delivery address + note, items with quantity and price, subtotal/delivery/discount/total, payment method and status (label simulated payments clearly), current status, OrderStatusControl (advance through Pending -> Confirmed -> Processing -> Out for Delivery -> Delivered, or Cancel with confirmation; cancelling restocks items), internal note field saved to the order. The customer order page must reflect the same status. Invalid ID -> not-found.

INVENTORY
- Table: image/name, product ID/SKU, current stock, unit, stock status badge (In Stock / Low Stock / Out of Stock), threshold indicator, search + category filter + status filter, stock adjustment action (modal: set or +/- quantity with reason). Stock changes update the product, customer availability, and notification bell. Show the LOW_STOCK threshold at the top (read-only constant).
```

---------------------------------------------------------------------

## PROMPT 10: ADMIN CUSTOMERS, WALLET, REFERRALS, ANALYTICS (A09 to A12)

```
Build /admin/customers, /admin/wallet, /admin/referrals and /admin/analytics, all derived from the shared store.

CUSTOMERS: table with name, mobile, email, total orders, total spend (derived from orders), joined date, View. Search by name/mobile. Detail drawer with addresses, wallet balance, order list.

WALLET MANAGEMENT: transaction list (customer, reference, type credit/debit/refund/reward, amount, date, description/status), search and type filter. "Add adjustment" modal: select customer, credit or debit, amount, reason, confirm. Label everything "Simulated ledger. No real money movement." Adjustments update the customer's wallet page.

REFERRAL MANAGEMENT: table with code, referrer, referred customer, date, status, reward amount/status; summary cards (total, successful, rewards issued); search/filter; view record drawer. Reward amounts come from config and are labelled placeholders.

ANALYTICS: revenue summary, orders over time (line chart), best-selling products (bar), sales by category (donut), order status breakdown, date-range selector (Last 7 / 30 days / All) that recalculates from mock orders. Export is optional; if added, make it a simple CSV download of the current table.
```

---------------------------------------------------------------------

## PROMPT 11: CROSS-INTERFACE WIRING AND DEMO STORY

```
Verify and fix the end-to-end connections. Then add a small "Demo Guide" (floating button, admin and storefront) that lists the primary demo story and links to each step:

1. Owner adds a product (Admin > Products > Add) -> 2. It appears in /shop -> 3. Customer adds it to cart and checks out (simulated payment) -> 4. Order appears in Admin > Orders -> 5. Owner opens the order and moves it to Confirmed / Out for Delivery -> 6. Customer opens /orders/:id and sees the updated tracking status.

Also test the other cross-interface rules: edits/availability, bulk edit, stock changes blocking Add to Cart, wallet and referral records appearing in both views, state surviving a page refresh, corrupted localStorage falling back to seed data, and "Reset demo data" working.
Report and fix any bug found.
```

---------------------------------------------------------------------

## PROMPT 12: POLISH, QA AND ACCEPTANCE

```
Final pass.
1. Check every route at 360, 768, 1024, 1440 widths. Fix overflow, spacing and tap targets. Admin tables must scroll horizontally or collapse into cards on mobile.
2. No route may render a blank page; check invalid IDs, empty lists, and refreshed deep links (configure Vite SPA fallback).
3. No inert buttons: every prominent action navigates, opens a modal/drawer, changes state, or shows a "Demo only / coming later" toast.
4. Form validation feedback everywhere (checkout, address, profile, product form, adjustments).
5. Accessibility: AA contrast, focus rings, labels, keyboard operation for drawers, modals, tables, and bulk toolbar.
6. Confirm preloader plays once per session with no layout shift.
7. Performance: lazy-load routes (React.lazy), optimized images, Lighthouse 90+.
8. Confirm demo-only labelling on payments, wallet, referrals, and sample pricing.
9. Write README.md: setup, scripts, folder structure, how to edit tokens/config/seed data, where the shared store would be replaced by API calls, and the "Items to confirm with client" list from SPEC.md section 10.
10. Run lint and type-check, fix warnings. Then walk through the acceptance checklist below and mark each item pass or fail.
```

---------------------------------------------------------------------

## SPEC REFERENCE (save as SPEC.md in the project root)

Paste the full "Annapurna Farm Fresh & Organics: Frontend Page Specification, Demo Build" document you were given, unchanged. Prompt 0 tells Antigravity to treat it as the source of truth.

---------------------------------------------------------------------

## ACCEPTANCE CHECKLIST (from the spec)

Customer storefront
- [ ] Navigate Home -> Shop -> category pages
- [ ] Search and category filtering work
- [ ] Product details open correctly
- [ ] Add, update, remove cart items; totals correct
- [ ] Simulated checkout completes, creates an order, clears the cart
- [ ] New order appears in Order History with details and status
- [ ] Wallet and referral pages show demo info
- [ ] Profile/address editing works

Owner dashboard
- [ ] Enter demo dashboard; metrics and recent orders show
- [ ] View/search products; add, edit, delete a product
- [ ] Select multiple products and bulk edit (price, stock, category, active/inactive, delete)
- [ ] View incoming orders and update status
- [ ] View and adjust inventory
- [ ] View customers, wallet transactions, referrals
- [ ] Analytics shows derived info

Cross-interface
- [ ] Owner-added products appear in storefront
- [ ] Edits and availability changes appear in storefront
- [ ] Checkout creates an order visible to the owner
- [ ] Owner status changes appear in customer tracking
- [ ] Inventory updates affect customer availability
- [ ] State survives refresh

Quality
- [ ] No blank routes, no inert buttons
- [ ] Validation feedback, empty states, invalid IDs handled
- [ ] Customer and admin navigation clearly separated
- [ ] Usable on desktop and mobile
- [ ] Demo-only actions clearly labelled

---------------------------------------------------------------------

## NOTES

- **Stack change:** the earlier pack used Next.js. This one uses React + Vite + Tailwind, as your spec requires.
- **Claims:** the spec says brand claims must be client-approved. The prompts put "Ozone-Treated", "Nitrate-Tested" and any certification in a config file flagged "confirm with client", and never use "FDA Approved". For the demo, tell the client these are placeholders.
- **Order of work:** if time is tight (spec section 11), run prompts 0, 3, 4, 7, 8 and 9 first. They cover the main demo story: owner lists a product, customer buys it, owner updates status, customer sees it.
- **If Antigravity stops midway:** paste "Continue from where you stopped, finish this prompt completely, then run the app and show me."
