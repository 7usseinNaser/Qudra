/**
 * FE-P01 · M04 Import Center — Playwright verification (Q-0121..Q-0151)
 * Real Chrome (channel: 'chrome'), explicit splash wait, real clicks,
 * zero console errors, 6 screenshots → verification/m04/
 *
 * Usage: node scripts/verify-m04.cjs [baseUrl]
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(__dirname, '..', 'verification', 'm04');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SCREENS = [
  { route: '/import/overview', file: 'Q-0121.png', name: 'Overview' },
  { route: '/import/details', file: 'Q-0123.png', name: 'Details' },
  { route: '/import/create', file: 'Q-0124.png', name: 'Create' },
  { route: '/import/results', file: 'Q-0127.png', name: 'Results' },
  { route: '/import/empty', file: 'Q-0149.png', name: 'Empty' },
  { route: '/import/error', file: 'Q-0151.png', name: 'Error' },
];

async function waitForBoot(page) {
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
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await waitForBoot(page);

    for (const s of SCREENS) {
      try {
        await page.goto(`${BASE}${s.route}`, { waitUntil: 'domcontentloaded' });
        await waitForBoot(page);
        await page.waitForSelector('nav[aria-label*="M04"]', { timeout: 15000 });
        await page.waitForSelector('h1', { timeout: 15000 });

        if (s.file === 'Q-0121.png') {
          // Real navigation: click "بدء الاستيراد" → create route, then back
          const startBtn = page.getByRole('button', { name: /بدء الاستيراد/ }).first();
          await startBtn.waitFor({ timeout: 10000 });
          await startBtn.click();
          await page.waitForURL('**/import/create', { timeout: 8000 });
          await page.goto(`${BASE}${s.route}`, { waitUntil: 'domcontentloaded' });
          await waitForBoot(page);
        }
        if (s.file === 'Q-0124.png') {
          // Real input: type a Credly URL (default source may be LinkedIn file or URL)
          const input = page.locator('input[type="text"], input[type="password"]').first();
          if (await input.count()) {
            await input.fill('https://credly.com/users/demo-user');
          }
        }
        if (s.file === 'Q-0151.png') {
          // Error screen: verify retry exists and is clickable, WITHOUT triggering
          // the full reload before the screenshot (reload would race the capture).
          // Interaction check happens after the screenshot below.
          const retry = page.getByRole('button', { name: /إعادة المحاولة الآن/ }).first();
          await retry.waitFor({ timeout: 10000 });
          await page.waitForTimeout(600);
          await page.screenshot({ path: path.join(OUT_DIR, s.file), fullPage: false });
          await retry.click();
          await page.waitForTimeout(2200);
          await waitForBoot(page);
          await page.waitForSelector('h1', { timeout: 15000 });
          results.push({ screen: s.file, route: s.route, status: 'PASS' });
          console.log(`PASS ${s.file} ${s.route}`);
          continue;
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

    // Security red line: assert no token is persisted in storage on create page
    await page.goto(`${BASE}/import/create`, { waitUntil: 'domcontentloaded' });
    await waitForBoot(page);
    const leaked = await page.evaluate(() => {
      const keys = [];
      try {
        for (let i = 0; i < localStorage.length; i++) keys.push('ls:' + localStorage.key(i));
        for (let i = 0; i < sessionStorage.length; i++) keys.push('ss:' + sessionStorage.key(i));
      } catch {}
      return keys.filter((k) => /token|pat|secret|access/i.test(k));
    });
    if (leaked.length > 0) {
      console.log(`SECURITY-FAIL: token-like keys in storage: ${leaked.join(', ')}`);
      results.push({ screen: 'SECURITY', route: '/import/create', status: 'FAIL', error: 'token in storage' });
    } else {
      console.log('SECURITY-PASS: no token/PAT in localStorage/sessionStorage');
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n==== M04 SUMMARY ====');
  console.log(`Screens: 6, PASS: ${6 - failed.filter((f) => f.screen !== 'SECURITY').length}, FAIL: ${failed.length}`);
  console.log(`Console errors: ${consoleErrors.length}, Page errors: ${pageErrors.length}`);
  consoleErrors.slice(0, 20).forEach((e) => console.log(`CONSOLE-ERROR: ${e}`));
  pageErrors.slice(0, 20).forEach((e) => console.log(`PAGE-ERROR: ${e}`));

  if (failed.length > 0 || consoleErrors.length > 0 || pageErrors.length > 0) {
    console.log('M04 VERIFICATION: FAILED');
    process.exit(1);
  }
  console.log('M04 VERIFICATION: PASSED — 6/6 screens, zero console errors');
})();
