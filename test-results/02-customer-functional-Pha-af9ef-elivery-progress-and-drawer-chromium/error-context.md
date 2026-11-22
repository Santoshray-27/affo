# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-customer-functional.spec.ts >> Phase 2: Customer Storefront Functional Workflows >> Cart: Items management, ANNA10 coupon, free delivery progress, and drawer
- Location: tests\e2e\02-customer-functional.spec.ts:91:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/cart
Call log:
  - navigating to "http://localhost:5173/cart", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Phase 2: Customer Storefront Functional Workflows', () => {
  4   |   test.beforeEach(async ({ context }) => {
  5   |     await context.addInitScript(() => {
  6   |       sessionStorage.setItem('annapurna_loaded', '1');
  7   |       localStorage.removeItem('ANNAPURNA_STORE_V1');
  8   |     });
  9   |   });
  10  | 
  11  |   test('Home: Hero CTA navigates to shop, newsletter validates and submits', async ({ page }) => {
  12  |     await page.goto('/');
  13  |     await page.locator('main').waitFor({ state: 'visible' });
  14  | 
  15  |     // 1. Hero CTA button
  16  |     const shopNowBtn = page.getByRole('button', { name: 'Shop now' });
  17  |     await expect(shopNowBtn).toBeVisible();
  18  |     await shopNowBtn.click();
  19  |     await expect(page).toHaveURL(/\/shop/);
  20  | 
  21  |     // 2. Return home and test Newsletter
  22  |     await page.goto('/');
  23  |     const emailInput = page.getByPlaceholder(/Enter your email/i);
  24  |     await expect(emailInput).toBeVisible();
  25  | 
  26  |     const subscribeBtn = page.getByRole('button', { name: /Subscribe|Join/i });
  27  |     await emailInput.fill('tester@annapurna.demo');
  28  |     await subscribeBtn.click();
  29  | 
  30  |     // Success confirmation appears
  31  |     await expect(page.locator('text=Thank you. You are on the morning harvest list.')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('Shop: Search, filter chips, sort order, and layout switcher work', async ({ page }) => {
  35  |     await page.goto('/shop');
  36  |     await page.locator('main').waitFor({ state: 'visible' });
  37  | 
  38  |     // Search inside shop
  39  |     const searchInput = page.getByPlaceholder(/Search produce/i);
  40  |     await searchInput.fill('Apple');
  41  |     await expect(page).toHaveURL(/q=Apple/);
  42  |     await expect(page.locator('text=Shimla Royal Apple')).toBeVisible();
  43  | 
  44  |     // Clear search
  45  |     await searchInput.fill('');
  46  |     await page.keyboard.press('Enter');
  47  | 
  48  |     // Category filter button
  49  |     const fruitsBtn = page.getByRole('button', { name: /Fruits \(/i });
  50  |     await fruitsBtn.click();
  51  |     await expect(page).toHaveURL(/category=cat-fruits/);
  52  | 
  53  |     // Sort switcher
  54  |     const sortSelect = page.locator('select').first();
  55  |     await sortSelect.selectOption('price-asc');
  56  |     await expect(page).toHaveURL(/sort=price-asc/);
  57  | 
  58  |     // Layout switcher (Grid to List)
  59  |     const listBtn = page.getByLabel('List view');
  60  |     if (await listBtn.isVisible()) {
  61  |       await listBtn.click();
  62  |       await expect(page.locator('.aspect-\\[4\\/5\\]').first()).toBeVisible();
  63  |     }
  64  |   });
  65  | 
  66  |   test('Product Detail: Stepper limits, Add to basket, Buy Now, and Tab switching', async ({ page }) => {
  67  |     await page.goto('/product/prod-apple');
  68  |     await page.locator('main').waitFor({ state: 'visible' });
  69  | 
  70  |     await expect(page.locator('h1')).toContainText('Shimla Royal Apple');
  71  | 
  72  |     // Quantity Stepper
  73  |     const incrementBtn = page.getByLabel('Increase quantity');
  74  |     await incrementBtn.click();
  75  | 
  76  |     // Add to basket
  77  |     const addBtn = page.getByRole('button', { name: /Add to basket/i });
  78  |     await addBtn.click();
  79  | 
  80  |     // Toast notification visible
  81  |     await expect(page.locator('text=Added to basket')).toBeVisible();
  82  | 
  83  |     // Tab switching (Product Specifications)
  84  |     const specsTab = page.getByRole('button', { name: /Product Specifications/i });
  85  |     if (await specsTab.isVisible()) {
  86  |       await specsTab.click();
  87  |       await expect(page.locator('text=Pack Unit')).toBeVisible();
  88  |     }
  89  |   });
  90  | 
  91  |   test('Cart: Items management, ANNA10 coupon, free delivery progress, and drawer', async ({ page }) => {
> 92  |     await page.goto('/cart');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/cart
  93  |     await page.locator('main').waitFor({ state: 'visible' });
  94  | 
  95  |     // Default seed cart has items
  96  |     await expect(page.locator('text=Shopping Basket')).toBeVisible();
  97  | 
  98  |     // Free delivery progress bar exists
  99  |     await expect(page.getByText(/delivery/i).first()).toBeVisible();
  100 | 
  101 |     // Test Coupon
  102 |     const couponToggle = page.locator('text=Have a coupon code?');
  103 |     if (await couponToggle.isVisible()) {
  104 |       await couponToggle.click();
  105 |       const couponInput = page.getByPlaceholder(/ANNA10/i);
  106 |       await couponInput.fill('ANNA10');
  107 |       await page.getByRole('button', { name: 'Apply' }).click();
  108 |       await expect(page.locator('text=10% discount applied')).toBeVisible();
  109 |     }
  110 |   });
  111 | 
  112 |   test('Checkout: Full validation, slot selection, order placement, and double-click prevention', async ({ page }) => {
  113 |     await page.goto('/checkout');
  114 |     await page.locator('main').waitFor({ state: 'visible' });
  115 | 
  116 |     // Select COD payment scoped to main form
  117 |     const codOption = page.locator('#main-content').locator('text=Cash on Delivery');
  118 |     await codOption.click();
  119 | 
  120 |     // Place Order button
  121 |     const placeOrderBtn = page.getByRole('button', { name: /Place Order/i });
  122 |     await expect(placeOrderBtn).toBeVisible();
  123 | 
  124 |     // Submit order
  125 |     await placeOrderBtn.click();
  126 | 
  127 |     // Redirects to order success
  128 |     await expect(page).toHaveURL(/\/order-success\/ANN-/, { timeout: 15000 });
  129 |     await expect(page.locator('text=Order placed successfully')).toBeVisible();
  130 |   });
  131 | 
  132 |   test('Wallet & Referrals & Profile: Balance, Add Money modal, Friend Referral simulation, Profile save', async ({ page }) => {
  133 |     // 1. Wallet
  134 |     await page.goto('/wallet');
  135 |     await page.locator('main').waitFor({ state: 'visible' });
  136 |     await expect(page.locator('text=Available Balance')).toBeVisible();
  137 | 
  138 |     const addMoneyBtn = page.getByRole('button', { name: /Add money/i });
  139 |     await addMoneyBtn.click();
  140 |     await expect(page.locator('text=Wallet top-up rules to be confirmed. Demo only.')).toBeVisible();
  141 |     await page.getByRole('button', { name: 'Close', exact: true }).click();
  142 | 
  143 |     // 2. Referrals
  144 |     await page.goto('/referrals');
  145 |     await page.locator('main').waitFor({ state: 'visible' });
  146 |     await expect(page.locator('text=Refer & Earn')).toBeVisible();
  147 | 
  148 |     const simulateBtn = page.getByRole('button', { name: 'Simulate Join' });
  149 |     if (await simulateBtn.isVisible()) {
  150 |       await simulateBtn.click();
  151 |       await expect(page.locator('text=Friend Joined & Ordered')).toBeVisible();
  152 |     }
  153 | 
  154 |     // 3. Profile
  155 |     await page.goto('/profile');
  156 |     await page.locator('main').waitFor({ state: 'visible' });
  157 |     await expect(page.locator('h1')).toContainText('Account Profile');
  158 | 
  159 |     const nameInput = page.getByLabel(/Full Name/i);
  160 |     await nameInput.fill('Demo Customer Updated');
  161 |     await page.getByRole('button', { name: 'Save Profile Changes' }).click();
  162 |     await expect(page.locator('text=Profile Saved')).toBeVisible();
  163 |   });
  164 | });
  165 | 
```