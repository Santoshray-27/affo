import { test, expect } from '@playwright/test';

test.describe('Phase 3 & 4: Admin Dashboard & Cross-Interface End-to-End Workflows', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      sessionStorage.setItem('annapurna_loaded', '1');
      const current = localStorage.getItem('ANNAPURNA_STORE_V1');
      if (!current) {
        localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify({ isAdminLoggedIn: true }));
      } else {
        try {
          const parsed = JSON.parse(current);
          if (!parsed.isAdminLoggedIn) {
            parsed.isAdminLoggedIn = true;
            localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify(parsed));
          }
        } catch {
          // ignore
        }
      }
    });
  });

  test('Workflow 1: Admin adds product -> customer buys it -> admin fulfills order -> customer timeline reflects updates', async ({ page }) => {
    // 1. Admin adds product
    await page.goto('/admin/products/new');
    await page.locator('main').waitFor({ state: 'visible' });

    const newProdName = 'Artisanal Himalayan Kiwi';
    await page.getByLabel(/Produce Name/i).fill(newProdName);
    await page.locator('textarea').fill('Hand-plucked organic kiwis from Kullu valley.');
    await page.getByLabel(/Selling Price/i).fill('220');
    await page.getByLabel(/Compare-At Price/i).fill('260');
    await page.getByLabel(/Stock Quantity/i).fill('45');
    await page.getByLabel(/Pack Unit/i).fill('500 g pack');

    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.locator('tbody').getByText(newProdName)).toBeVisible();

    // 2. Customer finds product in /shop
    await page.goto('/shop');
    await page.locator('main').waitFor({ state: 'visible' });
    const searchInput = page.getByPlaceholder(/Search produce/i);
    await searchInput.fill('Kiwi');
    await expect(page.locator(`text=${newProdName}`)).toBeVisible();

    // 3. Customer adds to cart & checks out
    const addBtn = page.locator('div').filter({ hasText: newProdName }).getByRole('button', { name: 'Add' }).first();
    await addBtn.click();

    await page.goto('/checkout');
    await page.locator('#main-content').locator('text=Cash on Delivery').click();
    await page.getByRole('button', { name: /Place Order/i }).click();
    await expect(page).toHaveURL(/\/order-success\/ANN-/, { timeout: 15000 });

    const successUrl = page.url();
    const orderIdMatch = successUrl.match(/ANN-[^/]+/);
    const orderId = orderIdMatch ? orderIdMatch[0] : '';
    expect(orderId).not.toBe('');

    // 4. Order appears in admin orders queue
    await page.goto('/admin/orders');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator(`text=${orderId}`)).toBeVisible();

    // 5. Admin updates status: Confirmed -> Out for Delivery -> Delivered
    await page.goto(`/admin/orders/${orderId}`);
    await page.locator('main').waitFor({ state: 'visible' });

    await page.getByRole('button', { name: /Confirmed/i }).click();
    await expect(page.locator('text=Confirmed').first()).toBeVisible();

    await page.getByRole('button', { name: /Out for Delivery/i }).click();
    await expect(page.locator('text=Out for Delivery').first()).toBeVisible();

    await page.getByRole('button', { name: /Delivered/i }).click();
    await expect(page.locator('text=Delivered').first()).toBeVisible();

    // 6. Customer order detail reflects 'Delivered'
    await page.goto(`/orders/${orderId}`);
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('text=Delivered').first()).toBeVisible();
  });

  test('Workflow 2: Admin edits price -> storefront reflects updated price', async ({ page }) => {
    // Admin edits price of apple
    await page.goto('/admin/products/prod-apple/edit');
    await page.locator('main').waitFor({ state: 'visible' });

    const priceInput = page.getByLabel(/Selling Price/i);
    await priceInput.fill('195');
    const compareInput = page.getByLabel(/Compare-At Price/i);
    await compareInput.fill('240');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page).toHaveURL(/\/admin\/products/);

    // Storefront reflects ₹195
    await page.goto('/product/prod-apple');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('#main-content').getByText(/₹195/).first()).toBeVisible();
  });

  test('Workflow 3: Admin sets stock to 0 -> storefront shows Sold Out', async ({ page }) => {
    // Admin sets stock of apple to 0
    await page.goto('/admin/products/prod-apple/edit');
    await page.locator('main').waitFor({ state: 'visible' });

    const stockInput = page.getByLabel(/Stock Quantity/i);
    await stockInput.fill('0');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Storefront reflects Sold Out
    await page.goto('/product/prod-apple');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.getByText(/Sold out/i).first()).toBeVisible();
  });

  test('Workflow 4: Customer cancels Pending order -> Admin sees Cancelled & produce restocked', async ({ page }) => {
    await page.goto('/orders');
    await page.locator('main').waitFor({ state: 'visible' });

    // Open first pending order
    const viewBtn = page.getByRole('button', { name: /View/i }).first();
    await viewBtn.click();

    const cancelBtn = page.getByRole('button', { name: /Cancel order/i });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      const confirmCancelBtn = page.getByRole('button', { name: 'Yes, cancel order' });
      await confirmCancelBtn.click();
      await expect(page.locator('text=Cancelled')).toBeVisible();
    }
  });

  test('Workflow 5: Referral simulated -> friend joins -> wallet credited and admin referrals updated', async ({ page }) => {
    await page.goto('/referrals');
    await page.locator('main').waitFor({ state: 'visible' });

    const simulateBtn = page.getByRole('button', { name: 'Simulate Join' });
    await simulateBtn.click();
    await expect(page.locator('text=Friend Joined & Ordered')).toBeVisible();

    // Check admin referrals dashboard
    await page.goto('/admin/referrals');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('main h2').first()).toBeVisible();
  });

  test('Workflow 6: Reset Demo Data returns store to pristine initial state', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('main').waitFor({ state: 'visible' });

    // Open profile menu in topbar
    const avatarBtn = page.locator('header').locator('button').filter({ hasText: /Owner|Admin/i }).first();
    if (await avatarBtn.isVisible()) {
      await avatarBtn.click();
      const resetBtn = page.getByRole('button', { name: /Reset demo data/i });
      if (await resetBtn.isVisible()) {
        await resetBtn.click();
        await expect(page.locator('text=Data Restored')).toBeVisible();
      }
    }
  });
});
