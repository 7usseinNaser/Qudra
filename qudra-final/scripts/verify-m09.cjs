/**
 * FE-P01 · M09 Next Step Engine — Playwright verification (Q-0321..Q-0351)
 * Real Chrome (channel: 'chrome'), explicit splash wait, real clicks,
 * zero console errors, 6 screenshots → verification/m09/
 *
 * Usage: node scripts/verify-m09.cjs [baseUrl]
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(__dirname, '..', 'verification', 'm09');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SCREENS = [
  { route: '/next/overview', file: 'Q-0321.png', name: 'Overview' },
  { route: '/next/details', file: 'Q-0323.png', name: 'Details' },
  { route: '/next/create', file: 'Q-0324.png', name: 'Create' },
  { route: '/next/results', file: 'Q-0327.png', name: 'Results' },
  { route: '/next/empty', file: 'Q-0349.png', name: 'Empty' },
  { route: '/next/error', file: 'Q-0351.png', name: 'Error' },
];

async function waitForBoot(page) {
  // Explicit wait for the splash screen to leave (or be absent with reduced-motion)
  try {
    await page.waitForSelector('[aria-label="جارٍ التشغيل"]', { state: 'attached', timeout: 8000 });
    await page.waitForSelector('[aria-label="جارٍ التشغيل"]', { state: 'detached', timeout: 15000 });
  } catch {
    await page.waitForSelector('[aria-label="جارٍ التشغيل"]', { state: 'detached', timeout: 15000 }).catch(() => {});
  }
  await page.waitForLoadState('networkidle').catch(() => {});
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: process.env.HEADLESS !== '0' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(`[${msg.location()?.url}] ${msg.text()}`); });
  page.on('pageerror', (err) => pageErrors.push(String(err && err.message || err)));

  const results = [];
  try {
    // Boot once on landing to settle providers/splash
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await waitForBoot(page);

    for (const s of SCREENS) {
      try {
        await page.goto(`${BASE}${s.route}`, { waitUntil: 'domcontentloaded' });
        await waitForBoot(page);
        // AnchorNav must be present on every M09 screen
        await page.waitForSelector('nav[aria-label*="M09"]', { timeout: 15000 });
        // Page must render a heading
        await page.waitForSelector('h1', { timeout: 15000 });

        // Real interaction per screen
        if (s.file === 'Q-0321.png') {
          // Open ExplainDrawer via the real button, verify dialog, then close
          const explainBtn = page.getByRole('button', { name: /تفسير الذكاء الاصطناعي/ }).first();
          await explainBtn.waitFor({ timeout: 10000 });
          await explainBtn.click();
          await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
          await page.getByRole('button', { name: /إغلاق التفسير/ }).click();
          await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 8000 }).catch(() => {});
          // Navigate via AnchorNav to Details and assert route change
          await page.getByRole('link', { name: /التفاصيل/ }).first().click();
          await page.waitForURL('**/next/details', { timeout: 8000 });
          await page.goto(`${BASE}${s.route}`, { waitUntil: 'domcontentloaded' });
          await waitForBoot(page);
        }
        if (s.file === 'Q-0324.png') {
          // Toggle a gap selection card (real click changes state)
          const card = page.locator('article').first();
          await card.waitFor({ timeout: 10000 });
          await card.click();
        }
        if (s.file === 'Q-0323.png') {
          const drawerBtn = page.getByRole('button', { name: /تفسير الذكاء الاصطناعي/ }).first();
          if (await drawerBtn.count()) {
            await drawerBtn.click();
            await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
            await page.keyboard.press('Escape').catch(() => {});
            await page.getByRole('button', { name: /إغلاق التفسير/ }).click().catch(() => {});
          }
        }

        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(OUT_DIR, s.file), fullPage: false });
        results.push({ screen: s.file, route: s.route, status: 'PASS' });
        console.log(`PASS ${s.file} ${s.route}`);
      } catch (e) {
        results.push({ screen: s.file, route: s.route, status: 'FAIL', error: String(e && e.message || e) });
        console.log(`FAIL ${s.file} ${s.route}: ${e && e.message || e}`);
        try { await page.screenshot({ path: path.join(OUT_DIR, s.file), fullPage: false }); } catch {}
      }
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n==== M09 SUMMARY ====');
  console.log(`Screens: ${results.length}, PASS: ${results.length - failed.length}, FAIL: ${failed.length}`);
  console.log(`Console errors: ${consoleErrors.length}, Page errors: ${pageErrors.length}`);
  consoleErrors.slice(0, 20).forEach((e) => console.log(`CONSOLE-ERROR: ${e}`));
  pageErrors.slice(0, 20).forEach((e) => console.log(`PAGE-ERROR: ${e}`));

  if (failed.length > 0 || consoleErrors.length > 0 || pageErrors.length > 0) {
    console.log('M09 VERIFICATION: FAILED');
    process.exit(1);
  }
  console.log('M09 VERIFICATION: PASSED — 6/6 screens, zero console errors');
})();
