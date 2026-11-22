import { test, expect } from '@playwright/test';

test.describe('Phase 1: Route Coverage & Console Health', () => {
  test.beforeEach(async ({ context }) => {
    // Avoid preloader delaying tests
    await context.addInitScript(() => {
      sessionStorage.setItem('annapurna_loaded', '1');
    });
  });

  const customerRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Shop Search', path: '/shop?q=apple' },
    { name: 'Category Fruits', path: '/category/fruits' },
    { name: 'Category Vegetables', path: '/category/vegetables' },
    { name: 'Category Organics', path: '/category/organics' },
    { name: 'Category Exotics', path: '/category/exotics' },
    { name: 'Category Juices', path: '/category/juices-beverages' },
    { name: 'Category Salads', path: '/category/salads-dips' },
    { name: 'Product Detail Valid', path: '/product/prod-apple' },
    { name: 'Product Detail Invalid (Empty/Not found)', path: '/product/invalid-id-xyz' },
    { name: 'Cart', path: '/cart' },
    { name: 'Checkout', path: '/checkout' },
    { name: 'Order Success Valid', path: '/order-success/ANN-2026-0001' },
    { name: 'Order Success Invalid', path: '/order-success/invalid-id' },
    { name: 'Account', path: '/account' },
    { name: 'Orders List', path: '/orders' },
    { name: 'Order Details Valid', path: '/orders/ANN-2026-0001' },
    { name: 'Order Details Invalid', path: '/orders/invalid-id' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Profile', path: '/profile' },
    { name: '404 Unknown Route', path: '/unknown-route-that-does-not-exist' },
  ];

  for (const r of customerRoutes) {
    test(`Customer route: ${r.name} (${r.path}) loads without crash or console error`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(err.message);
      });

      const res = await page.goto(r.path);
      expect(res?.status()).toBeLessThan(400);

      // Wait for React route chunk to mount
      const mainEl = page.locator('main');
      await mainEl.waitFor({ state: 'visible', timeout: 15000 });
      const mainText = await mainEl.textContent();
      expect(mainText?.trim().length).toBeGreaterThan(15);

      // Verify page reload (Vite SPA fallback works)
      await page.reload();
      await page.locator('main').waitFor({ state: 'visible', timeout: 15000 });
      const reloadedMainText = await page.locator('main').textContent();
      expect(reloadedMainText?.trim().length).toBeGreaterThan(15);

      const severeErrors = consoleErrors.filter(
        (e) => !e.includes('favicon') && !e.includes('Download the React DevTools')
      );
      expect(severeErrors).toEqual([]);
    });
  }

  test('Admin route: /admin while logged out redirects to /admin/login', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('ANNAPURNA_STORE_V1');
    });
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('h1')).toContainText('Owner Portal');
  });

  const adminRoutes = [
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Admin Produce Catalog', path: '/admin/products' },
    { name: 'Admin Product New', path: '/admin/products/new' },
    { name: 'Admin Product Edit Valid', path: '/admin/products/prod-apple/edit' },
    { name: 'Admin Orders Queue', path: '/admin/orders' },
    { name: 'Admin Order Detail Valid', path: '/admin/orders/ANN-2026-0001' },
    { name: 'Admin Inventory', path: '/admin/inventory' },
    { name: 'Admin Customers', path: '/admin/customers' },
    { name: 'Admin Wallet Ledger', path: '/admin/wallet' },
    { name: 'Admin Referrals', path: '/admin/referrals' },
    { name: 'Admin Analytics', path: '/admin/analytics' },
  ];

  for (const ar of adminRoutes) {
    test(`Admin route: ${ar.name} (${ar.path}) loads when authenticated`, async ({ page }) => {
      await page.addInitScript(() => {
        const state = localStorage.getItem('ANNAPURNA_STORE_V1');
        if (state) {
          try {
            const p = JSON.parse(state);
            p.isAdminLoggedIn = true;
            localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify(p));
          } catch (e) {}
        } else {
          localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify({ isAdminLoggedIn: true }));
        }
      });

      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(err.message));

      await page.goto(ar.path);
      await expect(page).toHaveURL(new RegExp(ar.path));
      const mainEl = page.locator('main');
      await mainEl.waitFor({ state: 'visible', timeout: 15000 });
      const mainText = await mainEl.textContent();
      expect(mainText?.trim().length).toBeGreaterThan(15);

      const severeErrors = consoleErrors.filter(
        (e) => !e.includes('favicon') && !e.includes('Download the React DevTools')
      );
      expect(severeErrors).toEqual([]);
    });
  }

  test('Corrupted localStorage fallback to seed data', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('ANNAPURNA_STORE_V1', '{ corrupted: json bad-data');
    });

    await page.goto('/');
    await page.locator('main').waitFor({ state: 'visible' });
    await expect(page.locator('h1')).toContainText('Fresh from the farm');
  });
});
