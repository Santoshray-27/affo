import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Phase 7: WCAG AA Accessibility Audit (Axe-Core)', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      sessionStorage.setItem('annapurna_loaded', '1');
      localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify({ isAdminLoggedIn: true }));
    });
  });

  const routesToAudit = [
    { name: 'Home Page', path: '/' },
    { name: 'Shop Page', path: '/shop' },
    { name: 'Product Detail', path: '/product/prod-apple' },
    { name: 'Cart Page', path: '/cart' },
    { name: 'Checkout Page', path: '/checkout' },
    { name: 'Orders History', path: '/orders' },
    { name: 'Wallet Page', path: '/wallet' },
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Admin Catalog', path: '/admin/products' },
  ];

  for (const r of routesToAudit) {
    test(`Axe-core scan for ${r.name} (${r.path}) has zero critical accessibility violations`, async ({ page }) => {
      await page.goto(r.path);
      await page.locator('main').waitFor({ state: 'visible' });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(criticalViolations).toEqual([]);
    });
  }

  test('Keyboard navigation: Skip to main content link works', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('text=Skip to main content');
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
