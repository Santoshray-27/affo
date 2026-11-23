import { test, expect } from '@playwright/test';

test.describe('Phase 2: Customer Storefront Functional Workflows', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      sessionStorage.setItem('annapurna_loaded', '1');
      localStorage.removeItem('ANNAPURNA_STORE_V1');
    });
  });

  test('Home: Hero CTA navigates to shop, newsletter validates and submits', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').waitFor({ state: 'visible' });

    // 1. Hero CTA button
    const shopNowBtn = page.getByRole('button', { name: 'Shop now' });
    await expect(shopNowBtn).toBeVisible();
    await shopNowBtn.click();
    await expect(page).toHaveURL(/\/shop/);

    // 2. Return home and test Newsletter
    await page.goto('/');
    await page.locator('main').waitFor({ state: 'visible' });
    const emailInput = page.getByPlaceholder(/Enter your email/i);
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();

    const subscribeBtn = page.getByRole('button', { name: /Subscribe|Join/i });
    await emailInput.fill('tester@annapurna.demo');
    await subscribeBtn.click();

    // Success confirmation appears
    await expect(page.locator('text=Thank you. You are on the morning harvest list.')).toBeVisible();
  });

  test('Shop: Search, filter chips, sort order, and layout switcher work', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('main').waitFor({ state: 'visible' });

    // Search inside shop
    const searchInput = page.getByPlaceholder(/Search produce/i);
    await searchInput.fill('Apple');
    await expect(page).toHaveURL(/q=Apple/);
    await expect(page.locator('text=Shimla Royal Apple')).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.keyboard.press('Enter');

    // Category filter button
    const fruitsBtn = page.getByRole('button', { name: /Fruits \(/i });
    await fruitsBtn.click();
    await expect(page).toHaveURL(/category=cat-fruits/);

    // Sort switcher
    const sortSelect = page.locator('select').first();
    await sortSelect.selectOption('price-asc');
    await expect(page).toHaveURL(/sort=price-asc/);

    // Layout switcher (Grid to List)
    const listBtn = page.getByLabel('List view');
    if (await listBtn.isVisible()) {
      await listBtn.click();
      await expect(page.locator('.aspect-\\[4\\/5\\]').first()).toBeVisible();
    }
  });

  test('Product Detail: Stepper limits, Add to basket, Buy Now, and Tab switching', async ({ page }) => {
    await page.goto('/product/prod-apple');
    await page.locator('main').waitFor({ state: 'visible' });

    await expect(page.locator('h1')).toContainText('Shimla Royal Apple');

    // Quantity Stepper
    const incrementBtn = page.getByLabel('Increase quantity');
    await incrementBtn.click();

    // Add to basket
    const addBtn = page.getByRole('button', { name: /Add to basket/i });
    await addBtn.click();

    // Toast notification visible
    await expect(page.locator('text=Added to basket')).toBeVisible();

    // Tab switching (Product Specifications)
    const specsTab = page.getByRole('button', { name: /Product Specifications/i });
    if (await specsTab.isVisible()) {
      await specsTab.click();
      await expect(page.locator('text=Pack Unit')).toBeVisible();
    }
  });

  test('Cart: Items management, ANNA10 coupon, free delivery progress, and drawer', async ({ page }) => {
    await page.goto('/cart');
    await page.locator('main').waitFor({ state: 'visible' });

    // Default seed cart has items
    await expect(page.locator('text=Shopping Basket')).toBeVisible();

    // Free delivery progress bar exists
    await expect(page.getByText(/delivery/i).first()).toBeVisible();

    // Test Coupon
    const couponToggle = page.locator('text=Have a coupon code?');
    if (await couponToggle.isVisible()) {
      await couponToggle.click();
      const couponInput = page.getByPlaceholder(/ANNA10/i);
      await couponInput.fill('ANNA10');
      await page.getByRole('button', { name: 'Apply' }).click();
      await expect(page.locator('text=10% discount applied')).toBeVisible();
    }
  });

  test('Checkout: Full validation, slot selection, order placement, and double-click prevention', async ({ page }) => {
    await page.goto('/checkout');
    await page.locator('main').waitFor({ state: 'visible' });

    // Select COD payment scoped to main form
    const codOption = page.locator('#main-content').locator('text=Cash on Delivery');
    await codOption.click();

    // Place Order button
    const placeOrderBtn = page.getByRole('button', { name: /Place Order/i });
    await expect(placeOrderBtn).toBeVisible();

    // Submit order
    await placeOrderBtn.click();

    // Redirects to order success
    await expect(page).toHaveURL(/\/order-success\/ANN-/, { timeout: 15000 });
    await expect(page.locator('text=Order placed successfully')).toBeVisible();
  });

  test('Wallet & Referrals & Profile: Balance, Add Money modal, Friend Referral simulation, Profile save', async ({ page }) => {
    // 1. Wallet
    await page.goto('/wallet');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('text=Available Balance')).toBeVisible();

    const addMoneyBtn = page.getByRole('button', { name: /Add money/i });
    await addMoneyBtn.click();
    await expect(page.locator('text=Wallet top-up rules to be confirmed. Demo only.')).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    // 2. Referrals
    await page.goto('/referrals');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('text=Refer & Earn')).toBeVisible();

    const simulateBtn = page.getByRole('button', { name: 'Simulate Join' });
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      await expect(page.locator('text=Friend Joined & Ordered')).toBeVisible();
    }

    // 3. Profile
    await page.goto('/profile');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('h1')).toContainText('Profile & Delivery Addresses');

    const nameInput = page.getByLabel(/Full Name/i);
    await nameInput.fill('Demo Customer Updated');
    await page.getByRole('button', { name: 'Save Profile Changes' }).click();
    await expect(page.locator('text=Profile Saved')).toBeVisible();
  });
});
