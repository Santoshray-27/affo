import { createServer } from 'vite';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verifyMarqueesAndScreenshots() {
  console.log('--- Starting Marquee Motion & Responsive Screenshot Verification ---');
  
  const server = await createServer({
    server: { port: 5188, strictPort: false },
    logLevel: 'error',
  });
  await server.listen();
  const address = server.httpServer.address();
  const port = typeof address === 'object' ? address.port : 5188;
  const baseUrl = `http://localhost:${port}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.addInitScript(() => {
    sessionStorage.setItem('annapurna_loaded', '1');
  });

  const outDir = path.resolve('test-artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Capture Marquee Motion Test (t0 and t2, 2 seconds apart)
  console.log('Capturing marquee positions at t=0s and t=2s...');
  
  const announcementSelector = '.marquee__track';
  await page.waitForSelector(announcementSelector);

  const getTransform = async () => {
    return await page.evaluate(() => {
      const el = document.querySelector('.marquee__track');
      if (!el) return null;
      return window.getComputedStyle(el).transform;
    });
  };

  const transform0 = await getTransform();
  await page.screenshot({ path: path.join(outDir, 'marquee-t0.png'), clip: { x: 0, y: 0, width: 1440, height: 180 } });

  await page.waitForTimeout(2000);

  const transform2 = await getTransform();
  await page.screenshot({ path: path.join(outDir, 'marquee-t2.png'), clip: { x: 0, y: 0, width: 1440, height: 180 } });

  console.log(`Marquee transform at t=0s: ${transform0}`);
  console.log(`Marquee transform at t=2s: ${transform2}`);

  const hasMoved = transform0 !== transform2;
  console.log(hasMoved ? '✅ Marquee animation confirmed moving continuously in CSS!' : '❌ Marquee did not move!');

  // 2. Full Page Screenshots at 1440px and 390px
  console.log('Capturing full page desktop (1440px) screenshot...');
  await page.screenshot({ path: path.join(outDir, 'homepage-1440px.png'), fullPage: true });

  console.log('Capturing full page mobile (390px) screenshot...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'homepage-390px.png'), fullPage: true });

  await browser.close();
  await server.close();

  console.log('Screenshots saved to test-artifacts/');
}

verifyMarqueesAndScreenshots().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});

