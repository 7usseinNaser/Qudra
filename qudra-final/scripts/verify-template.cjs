const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * قالب تحقق موحد لوحدات QUDRA
 * ينسخ من verify-m05.cjs مع تعميم متغير MODULE_ID و ROUTES
 * الاستخدام: node scripts/verify-template.cjs M05 /evidence
 */

const MODULE_ID = process.argv[2] || 'MXX';
const BASE_ROUTE = process.argv[3] || '/evidence';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';

const VERIF_DIR = path.join(__dirname, '..', 'verification', MODULE_ID.toLowerCase());

const ANCHORS = [
  { id: '01', name: 'Overview', route: BASE_ROUTE, selector: '' },
  { id: '03', name: 'Details', route: `${BASE_ROUTE}/record`, selector: '' },
  { id: '04', name: 'Create', route: `${BASE_ROUTE}/create`, selector: '' },
  { id: '07', name: 'Results', route: `${BASE_ROUTE}/results`, selector: '' },
  { id: '29', name: 'Empty', route: `${BASE_ROUTE}/empty`, selector: '' },
  { id: '31', name: 'Error', route: `${BASE_ROUTE}/error`, selector: '' },
];

async function run() {
  if (!fs.existsSync(VERIF_DIR)) {
    fs.mkdirSync(VERIF_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    locale: 'ar-SA',
  });
  const page = await context.newPage();

  // Block font loading to avoid stalls
  await page.route('**/fonts.googleapis.com/**', r => r.abort());
  await page.route('**/fonts.gstatic.com/**', r => r.abort());

  // Mock only mutating API calls
  await page.route('**/api/**', route => {
    const method = route.request().method();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return route.continue();
    }
    console.log(`   [SAFETY MOCK] ${method} ${route.request().url()}`);
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Safety mock: No production DB mutation' }),
    });
  });

  const results = [];

  for (const anchor of ANCHORS) {
    console.log(`\nTesting ${MODULE_ID} ${anchor.id} ${anchor.name} at ${anchor.route}...`);
    const consoleErrors = [];
    const onConsole = msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    };
    page.on('console', onConsole);

    try {
      await page.goto(`${BASE_URL}${anchor.route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Wait for splash screen dismissal (app-specific)
      await page.waitForSelector('[aria-label="جارٍ التشغيل"]', {
        state: 'detached',
        timeout: 15000,
      }).catch(() => { /* splash already gone */ });

      await page.waitForTimeout(800);

      // Module-specific assertions would go here
      // For template, just verify page loads
      if (anchor.selector) {
        await page.waitForSelector(anchor.selector, { timeout: 10000 });
      }

      const screenshotPath = path.join(VERIF_DIR, `Q-${anchor.id}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   Saved screenshot: ${MODULE_ID.toLowerCase()}/Q-${anchor.id}.png`);

      page.off('console', onConsole);

      const pass = consoleErrors.length === 0;
      results.push({
        qId: anchor.id,
        route: anchor.route,
        status: pass ? 'PASS' : 'FAIL',
        consoleErrors,
        screenshot: `/verification/${MODULE_ID.toLowerCase()}/Q-${anchor.id}.png`,
      });
      console.log(`   Result: ${pass ? 'PASS' : 'FAIL (Console errors detected)'}`);
      if (!pass) console.log('   Errors:', JSON.stringify(consoleErrors.slice(0, 3)));
    } catch (err) {
      page.off('console', onConsole);
      console.error(`   Error during ${MODULE_ID} ${anchor.id}:`, err.message);
      try {
        const failPath = path.join(VERIF_DIR, `Q-${anchor.id}_FAIL.png`);
        await page.screenshot({ path: failPath, fullPage: true });
        console.log(`   Saved failure screenshot: ${MODULE_ID.toLowerCase()}/Q-${anchor.id}_FAIL.png`);
      } catch { /* ignore */ }
      results.push({
        qId: anchor.id,
        route: anchor.route,
        status: 'FAIL',
        error: err.message,
        consoleErrors,
        screenshot: `/verification/${MODULE_ID.toLowerCase()}/Q-${anchor.id}.png`,
      });
    }
  }

  await browser.close();

  console.log('\n================ SUMMARY ================');
  results.forEach(r => console.log(`${r.status}  ${MODULE_ID} ${r.qId}  ${r.route}  -> ${r.screenshot}`));
  const failed = results.filter(r => r.status !== 'PASS');
  if (failed.length > 0) {
    console.log(`\n${failed.length} screen(s) FAILED`);
    process.exit(1);
  }
  console.log(`\nAll 6 ${MODULE_ID} anchor screens PASSED`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});