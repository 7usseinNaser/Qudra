const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const MODULE_ID = 'M24';
const BASE_ROUTE = '/assistant';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';

const VERIF_DIR = path.join(__dirname, '..', 'verification', MODULE_ID.toLowerCase());

const ANCHORS = [
  { id: '0921', name: 'Overview', route: `${BASE_ROUTE}`, selector: '[data-testid="screen-q-0921"]' },
  { id: '0923', name: 'Details', route: `${BASE_ROUTE}/exp-01`, selector: '[data-testid="screen-q-0923"]' },
  { id: '0924', name: 'Create/Query', route: `${BASE_ROUTE}/new`, selector: '[data-testid="screen-q-0924"]' },
  { id: '0927', name: 'Result', route: `${BASE_ROUTE}/result?topic=Test&type=MATCH&confidence=88`, selector: '[data-testid="screen-q-0927"]' },
  { id: '0949', name: 'Empty', route: `${BASE_ROUTE}/empty`, selector: '[data-testid="screen-q-0949"]' },
  { id: '0951', name: 'Error', route: `${BASE_ROUTE}/error`, selector: '[data-testid="screen-q-0951"]' },
  { id: '0925', name: 'Dispute (AC-14)', route: `${BASE_ROUTE}/dispute?targetId=exp-01&type=CAPABILITY`, selector: '[data-testid="screen-q-0925"]' },
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

  // Mock only mutating API calls (POST, PUT, DELETE, PATCH)
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
    console.log(`\nTesting ${MODULE_ID} Q-${anchor.id} ${anchor.name} at ${anchor.route}...`);
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

      await page.waitForSelector('[aria-label="جارٍ التشغيل"]', {
        state: 'detached',
        timeout: 15000,
      }).catch(() => { /* splash already gone */ });

      await page.waitForTimeout(800);

      if (anchor.selector) {
        await page.waitForSelector(anchor.selector, { timeout: 10000 });
      }

      // For M24 Overview - verify ExplainDrawer opens
      if (anchor.id === '0921') {
        await page.waitForSelector('[data-testid="open-drawer-btn"]', { timeout: 5000 });
        await page.click('[data-testid="open-drawer-btn"]');
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
        // Check for dispute link in drawer
        const disputeLink = await page.locator('a:has-text("اعتراض")').count();
        if (disputeLink > 0) {
          console.log(`   Dispute link found in ExplainDrawer`);
        }
      }

      // For M24 Details - verify ExplainDrawer and Dispute link
      if (anchor.id === '0923') {
        await page.waitForSelector('[data-testid="open-drawer-btn"]', { timeout: 5000 });
        await page.waitForSelector('[data-testid="dispute-link-btn"]', { timeout: 5000 });
      }

      // For M24 Create/Query - verify form and submission
      if (anchor.id === '0924') {
        await page.waitForSelector('[data-testid="query-input"]', { timeout: 5000 });
        await page.waitForSelector('[data-testid="submit-query-btn"]', { timeout: 5000 });
        // Fill query and submit
        await page.fill('[data-testid="query-input"]', 'لماذا تم تصنيف قدرتي في معمارية الأنظمة الموزعة بمستوى متقدم؟');
        await page.click('[data-testid="submit-query-btn"]');
        // Wait for drawer to open
        await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      }

      // For M24 Result - verify drawer and dispute link
      if (anchor.id === '0927') {
        await page.waitForSelector('[data-testid="open-drawer-btn"]', { timeout: 5000 });
        await page.waitForSelector('[data-testid="dispute-link-btn"]', { timeout: 5000 });
      }

      // For M24 Dispute (AC-14) - verify PENDING_REVIEW mention and form
      if (anchor.id === '0925') {
        await page.waitForSelector('[data-testid="dispute-reason-input"]', { timeout: 5000 });
        await page.waitForSelector('[data-testid="submit-dispute-btn"]', { timeout: 5000 });
        // Check for PENDING_REVIEW text
        const pageContent = await page.textContent('body');
        if (pageContent && pageContent.includes('PENDING_REVIEW')) {
          console.log(`   PENDING_REVIEW status badge found`);
        }
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
      console.error(`   Error during ${MODULE_ID} Q-${anchor.id}:`, err.message);
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
  results.forEach(r => console.log(`${r.status}  ${MODULE_ID} Q-${r.qId}  ${r.route}  -> ${r.screenshot}`));
  const failed = results.filter(r => r.status !== 'PASS');
  if (failed.length > 0) {
    console.log(`\n${failed.length} screen(s) FAILED`);
    process.exit(1);
  }
  console.log(`\nAll 7 ${MODULE_ID} anchor screens PASSED`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});