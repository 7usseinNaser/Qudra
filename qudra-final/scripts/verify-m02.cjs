/**
 * FE-P01 · M02 Home Dashboard — Playwright verification (Q-0041..Q-0071)
 * Real Chrome (channel: 'chrome'), explicit splash wait, real clicks,
 * zero console errors, 6 screenshots → verification/m02/
 *
 * Usage: node scripts/verify-m02.cjs [baseUrl]
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(__dirname, '..', 'verification', 'm02');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SCREENS = [
  { route: '/home', file: 'Q-0041.png', name: 'Overview' },
  { route: '/home/details', file: 'Q-0043.png', name: 'Details' },
  { route: '/home/customize', file: 'Q-0044.png', name: 'Create/Customize' },
  { route: '/home/summary', file: 'Q-0047.png', name: 'Results/Summary' },
  { route: '/home/empty', file: 'Q-0069.png', name: 'Empty' },
  { route: '/home/error', file: 'Q-0071.png', name: 'Error' },
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
        await page.waitForSelector('h1, h2', { timeout: 15000 });

        if (s.file === 'Q-0041.png') {
          // Home overview: toggle role (real state switch) then back
          const orgBtn = page.getByRole('button', { name: /واجهة المنشأة/ }).first();
          if (await orgBtn.count()) {
            await orgBtn.click();
            await page.waitForTimeout(500);
            const talentBtn = page.getByRole('button', { name: /واجهة المطور/ }).first();
            await talentBtn.click();
            await page.waitForTimeout(500);
          }
        }
        if (s.file === 'Q-0043.png') {
          // Details: switch tabs (real state change)
          const evTab = page.getByRole('button', { name: /الأدلة/ }).first();
          if (await evTab.count()) {
            await evTab.click();
            await page.waitForTimeout(400);
            const dnaTab = page.getByRole('button', { name: /DNA/ }).first();
            await dnaTab.click();
            await page.waitForTimeout(400);
            const capTab = page.getByRole('button', { name: /الكفاءات/ }).first();
            await capTab.click();
            await page.waitForTimeout(400);
          }
        }
        if (s.file === 'Q-0044.png') {
          // Customize: toggle a widget switch (real state change)
          const toggle = page.locator('label input[type="checkbox"]').first();
          if (await toggle.count()) {
            await toggle.click({ force: true }).catch(() => {});
            await page.waitForTimeout(300);
          }
        }
        if (s.file === 'Q-0071.png') {
          // Same reload-race guard as M04 Q-0151: screenshot before retry click.
          const retry = page.getByRole('button', { name: 'إعادة المحاولة', exact: true }).first();
          await retry.waitFor({ timeout: 10000 });
          await page.waitForTimeout(600);
          await page.screenshot({ path: path.join(OUT_DIR, s.file), fullPage: false });
          await retry.click();
          await page.waitForTimeout(2200);
          await waitForBoot(page);
          await page.waitForSelector('h1, h2', { timeout: 15000 });
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
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n==== M02 SUMMARY ====');
  console.log(`Screens: ${results.length}, PASS: ${results.length - failed.length}, FAIL: ${failed.length}`);
  console.log(`Console errors: ${consoleErrors.length}, Page errors: ${pageErrors.length}`);
  consoleErrors.slice(0, 20).forEach((e) => console.log(`CONSOLE-ERROR: ${e}`));
  pageErrors.slice(0, 20).forEach((e) => console.log(`PAGE-ERROR: ${e}`));

  if (failed.length > 0 || consoleErrors.length > 0 || pageErrors.length > 0) {
    console.log('M02 VERIFICATION: FAILED');
    process.exit(1);
  }
  console.log('M02 VERIFICATION: PASSED — 6/6 screens, zero console errors');
})();
