const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:5173';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function verify() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  let screenshotCount = 0;
  async function screenshot(name) {
    screenshotCount++;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${String(screenshotCount).padStart(2, '0')}-${name}.png`), fullPage: true });
    console.log(`  Screenshot ${screenshotCount}: ${name}`);
  }

  try {
    console.log('\n=== M17: Opportunities Hub — Full User Flow ===');

    await page.goto(`${BASE_URL}/opportunities/m17`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m17-01-overview');

    await page.click('text=مشروع');
    await page.waitForTimeout(300);
    await screenshot('m17-02-filtered');

    await page.goto(`${BASE_URL}/opportunities/m17`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const firstCard = page.locator('[aria-label*="تفاصيل"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    await screenshot('m17-03-details');

    await page.goto(`${BASE_URL}/opportunities/m17/create`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m17-04-create');

    await page.fill('input[placeholder*="تطوير بنية"]', 'تطوير منصة ذكاء اصطناعي للتحليل المالي');
    await page.fill('input[placeholder*="مختبرات"]', 'شركة الابتكار التقني');
    await page.fill('textarea[placeholder*="صف الفرصة"]', 'مشروع متكامل لبناء منصة تحليل مالي ذكية باستخدام الذكاء الاصطناعي ومعالجة اللغات الطبيعية.');
    await page.waitForTimeout(300);
    await screenshot('m17-05-create-filled');

    await page.goto(`${BASE_URL}/opportunities/m17/results`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m17-06-results');

    await page.goto(`${BASE_URL}/opportunities/m17/empty`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m17-07-empty');

    await page.goto(`${BASE_URL}/opportunities/m17/error`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m17-08-error');

    console.log('\n=== M17 Verification Summary ===');
    console.log(`Total screenshots: ${screenshotCount}`);
    console.log(`Console errors: ${consoleErrors.length}`);
    console.log(`Page errors: ${pageErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\nConsole Errors:');
      consoleErrors.forEach(e => console.log(`  - ${e}`));
    }

    if (pageErrors.length > 0) {
      console.log('\nPage Errors:');
      pageErrors.forEach(e => console.log(`  - ${e}`));
    }

    const success = consoleErrors.length === 0 && pageErrors.length === 0;
    console.log(`\nResult: ${success ? 'PASS' : 'FAIL'}`);

    await browser.close();
    process.exit(success ? 0 : 1);

  } catch (err) {
    console.error('Verification failed:', err.message);
    await browser.close();
    process.exit(1);
  }
}

verify();
