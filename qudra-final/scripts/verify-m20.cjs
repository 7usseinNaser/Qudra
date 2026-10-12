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
    console.log('\n=== M20: Team Composer — Full User Flow ===');

    await page.goto(`${BASE_URL}/teams/m20`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m20-01-overview');

    await page.click('text=اشرح لي');
    await page.waitForTimeout(300);
    await screenshot('m20-02-explain');

    await page.goto(`${BASE_URL}/teams/m20`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.locator('text=التفاصيل').first().click();
    await page.waitForTimeout(500);
    await screenshot('m20-03-details');

    await page.goto(`${BASE_URL}/teams/m20/create`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m20-04-create');

    await page.fill('input[placeholder*="فريق"]', 'فريق التحليل الذكي');
    const candidateCards = page.locator('[class*="candidateCard"]');
    const count = await candidateCards.count();
    for (let i = 0; i < Math.min(3, count); i++) {
      await candidateCards.nth(i).click();
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(300);
    await screenshot('m20-05-create-selected');

    await page.goto(`${BASE_URL}/teams/m20/results`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m20-06-results');

    await page.goto(`${BASE_URL}/teams/m20/empty`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m20-07-empty');

    await page.goto(`${BASE_URL}/teams/m20/error`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await screenshot('m20-08-error');

    console.log('\n=== M20 Verification Summary ===');
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
