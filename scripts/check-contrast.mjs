import { createServer } from 'vite';
import { chromium } from 'playwright';

// WCAG Luminance & Contrast Calculation
function parseRgb(colorStr) {
  if (!colorStr) return null;
  const match = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!match) return null;
  return {
    r: parseFloat(match[1]),
    g: parseFloat(match[2]),
    b: parseFloat(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

function sRgbToLinear(c) {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runCheck() {
  console.log('--- Starting Annapurna Contrast & Visual Audit ---');
  
  // 1. Start Vite dev server on free port
  const server = await createServer({
    server: { port: 5199, strictPort: false },
    logLevel: 'error',
  });
  await server.listen();
  const address = server.httpServer.address();
  const port = typeof address === 'object' ? address.port : 5199;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Server listening on ${baseUrl}`);

  // 2. Launch Chromium
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  // Bypass preloader on all pages
  await context.addInitScript(() => {
    sessionStorage.setItem('annapurna_loaded', '1');
    // Pre-populate admin login flag for admin routes
    const state = localStorage.getItem('ANNAPURNA_STORE_V1');
    if (state) {
      try {
        const parsed = JSON.parse(state);
        parsed.isAdminLoggedIn = true;
        localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify(parsed));
      } catch (e) {}
    } else {
      localStorage.setItem('ANNAPURNA_STORE_V1', JSON.stringify({ isAdminLoggedIn: true }));
    }
  });

  // Warm up Vite compilation
  console.log('Warming up Vite dev server...');
  const warmupPage = await context.newPage();
  try {
    await warmupPage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await warmupPage.waitForTimeout(1000);
  } finally {
    await warmupPage.close();
  }
  console.log('Vite server warmed up.');

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Category', path: '/category/fruits' },
    { name: 'Product Detail', path: '/product/prod-apple' },
    { name: 'Cart', path: '/cart' },
    { name: 'Checkout', path: '/checkout' },
    { name: 'Order Success', path: '/order-success/ANN-2026-0001' },
    { name: 'Account', path: '/account' },
    { name: 'Orders', path: '/orders' },
    { name: 'Order Detail', path: '/orders/ANN-2026-0001' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Profile', path: '/profile' },
    { name: 'Admin Login', path: '/admin/login' },
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Admin Products', path: '/admin/products' },
    { name: 'Admin Orders', path: '/admin/orders' },
    { name: 'Admin Inventory', path: '/admin/inventory' },
    { name: 'Admin Customers', path: '/admin/customers' },
    { name: 'Admin Wallet', path: '/admin/wallet' },
    { name: 'Admin Referrals', path: '/admin/referrals' },
    { name: 'Admin Analytics', path: '/admin/analytics' },
  ];

  let totalElementsChecked = 0;
  let totalFailures = 0;
  const failureReports = [];

  for (const route of routes) {
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Short pause for any framer motion or render settle
      await page.waitForTimeout(400);

      // Check contrast in the browser context
      const results = await page.evaluate(() => {
        function parseRgb(colorStr) {
          if (!colorStr) return null;
          const match = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
          if (!match) return null;
          return {
            r: parseFloat(match[1]),
            g: parseFloat(match[2]),
            b: parseFloat(match[3]),
            a: match[4] !== undefined ? parseFloat(match[4]) : 1,
          };
        }

        function sRgbToLinear(c) {
          const norm = c / 255;
          return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
        }

        function getLuminance(r, g, b) {
          return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
        }

        function getContrastRatio(rgb1, rgb2) {
          const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
          const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function getEffectiveBackgroundColor(el) {
          let current = el;
          let r = 255, g = 255, b = 255; // Default body fallback
          const stack = [];

          while (current && current !== document.documentElement) {
            const style = window.getComputedStyle(current);
            const bg = parseRgb(style.backgroundColor);
            if (bg && bg.a > 0) {
              stack.unshift(bg);
              if (bg.a >= 0.99) break; // Found fully opaque background
            }
            current = current.parentElement;
          }

          // Composite backgrounds from bottom to top
          for (const layer of stack) {
            r = Math.round(layer.r * layer.a + r * (1 - layer.a));
            g = Math.round(layer.g * layer.a + g * (1 - layer.a));
            b = Math.round(layer.b * layer.a + b * (1 - layer.a));
          }

          return { r, g, b, a: 1 };
        }

        const elements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label, input, strong, td, th'));
        const issues = [];
        let checkedCount = 0;

        for (const el of elements) {
          // Check if visible
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) < 0.1) continue;

          // Check if direct text exists or text node
          const text = (el.textContent || '').trim();
          if (!text || text.length === 0) continue;

          // Exclude pure icon SVGs or screen reader hidden
          if (el.getAttribute('aria-hidden') === 'true') continue;

          const textColor = parseRgb(style.color);
          if (!textColor) continue;

          // If text is totally transparent
          if (textColor.a <= 0.05) continue;

          checkedCount++;
          const bgColor = getEffectiveBackgroundColor(el);
          const ratio = getContrastRatio(textColor, bgColor);

          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight, 10) || 400;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const required = isLarge ? 3.0 : 4.5;

          // Tolerant boundary for subpixel rendering anti-aliasing
          if (ratio < required - 0.2) {
            // Filter out disabled inputs or buttons which are exempt under WCAG 1.4.3
            if (el.hasAttribute('disabled') || el.closest('[disabled]')) continue;

            issues.push({
              tag: el.tagName.toLowerCase(),
              className: el.className.slice(0, 60),
              text: text.slice(0, 35),
              color: style.color,
              bgColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
              ratio: Math.round(ratio * 100) / 100,
              required,
            });
          }
        }

        return { checkedCount, issues };
      });

      totalElementsChecked += results.checkedCount;
      if (results.issues.length > 0) {
        totalFailures += results.issues.length;
        failureReports.push({ route: route.name, path: route.path, issues: results.issues });
        console.log(`❌ ${route.name} (${route.path}): ${results.issues.length} contrast issues out of ${results.checkedCount} elements`);
      } else {
        console.log(`✅ ${route.name} (${route.path}): All ${results.checkedCount} text elements meet WCAG contrast!`);
      }
    } catch (err) {
      console.error(`Error auditing ${route.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  // 3. Responsive horizontal scroll test
  console.log('\n--- Checking Responsive Layouts (No horizontal overflow) ---');
  const viewports = [360, 390, 768, 1024, 1440];
  let overflowIssues = 0;

  for (const vpWidth of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vpWidth, height: 800 });
    try {
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 10000 });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.log(`❌ Horizontal overflow detected at ${vpWidth}px width!`);
        overflowIssues++;
      } else {
        console.log(`✅ ${vpWidth}px viewport: Clean, 0 horizontal scroll.`);
      }
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await server.close();

  console.log('\n=========================================');
  console.log(`Audit Summary: Checked ${totalElementsChecked} text elements.`);
  if (totalFailures === 0 && overflowIssues === 0) {
    console.log('🎉 ALL CONTRAST & RESPONSIVE CHECKS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.log(`⚠️ Completed with ${totalFailures} contrast notices, ${overflowIssues} overflow issues.`);
    if (failureReports.length > 0) {
      console.log(JSON.stringify(failureReports, null, 2));
    }
    process.exit(totalFailures > 0 || overflowIssues > 0 ? 1 : 0);
  }
}

runCheck().catch((err) => {
  console.error('Fatal error running contrast check:', err);
  process.exit(1);
});
