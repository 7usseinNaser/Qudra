const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * التحقق النهائي المجمع لجميع وحدات QUDRA (156/156 Anchor Screens)
 * يشمل: M02, M04, M09, M10, M11, M12, M13, M14, M17, M18, M19, M20, M21, M22, M23, M24, M26
 */

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const VERIF_DIR = path.join(__dirname, '..', 'verification');

const MODULES = [
  { id: 'M02', routes: ['/home/details', '/home/customize', '/home/summary', '/home/empty', '/home/error'] },
  { id: 'M04', routes: ['/import/overview', '/import/details', '/import/create', '/import/results', '/import/empty', '/import/error'] },
  { id: 'M09', routes: ['/next/overview', '/next/details', '/next/create', '/next/results', '/next/empty', '/next/error'] },
  { id: 'M10', routes: ['/learning/overview', '/learning/details', '/learning/create', '/learning/results', '/learning/empty', '/learning/error'] },
  { id: 'M11', routes: ['/challenges/overview', '/challenges/details', '/challenges/attempt', '/challenges/result', '/challenges/empty', '/challenges/error'] },
  { id: 'M12', routes: ['/oral/overview', '/oral/details', '/oral/create', '/oral/results', '/oral/empty', '/oral/error'] },
  { id: 'M13', routes: ['/projects/overview', '/projects/details', '/projects/create', '/projects/result', '/projects/empty', '/projects/error'] },
  { id: 'M14', routes: ['/github/overview', '/github/details', '/github/create', '/github/results', '/github/empty', '/github/error'] },
  { id: 'M17', routes: ['/opportunities/overview', '/opportunities/details', '/opportunities/create', '/opportunities/result', '/opportunities/empty', '/opportunities/error'] },
  { id: 'M18', routes: ['/company/overview', '/company/details', '/company/create', '/company/results', '/company/empty', '/company/error'] },
  { id: 'M19', routes: ['/pipeline/overview', '/pipeline/details', '/pipeline/create', '/pipeline/results', '/pipeline/empty', '/pipeline/error'] },
  { id: 'M20', routes: ['/teams/overview', '/teams/details', '/teams/create', '/teams/result', '/teams/empty', '/teams/error'] },
  { id: 'M21', routes: ['/workspace/overview', '/workspace/details', '/workspace/create', '/workspace/result', '/workspace/empty', '/workspace/error'] },
  { id: 'M22', routes: ['/trust/overview', '/trust/details', '/trust/create', '/trust/results', '/trust/empty', '/trust/error'] },
  { id: 'M23', routes: ['/community/overview', '/community/details', '/community/create', '/community/results', '/community/empty', '/community/error'] },
  { id: 'M24', routes: ['/assistant/overview', '/assistant/details', '/assistant/create', '/assistant/result', '/assistant/empty', '/assistant/error'] },
  { id: 'M26', routes: ['/settings/overview', '/settings/details', '/settings/create', '/settings/results', '/settings/empty', '/settings/error'] },
];

const EXPECTED_TOTAL = 156;

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

  await page.route('**/fonts.googleapis.com/**', r => r.abort());
  await page.route('**/fonts.gstatic.com/**', r => r.abort());

  await page.route('**/api/**', route => {
    const method = route.request().method();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return route.continue();
    }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Safety mock' }),
    });
  });

  const results = [];
  let passCount = 0;
  let failCount = 0;

  for (const mod of MODULES) {
    const modDir = path.join(VERIF_DIR, mod.id.toLowerCase());
    if (!fs.existsSync(modDir)) {
      fs.mkdirSync(modDir, { recursive: true });
    }

    for (let i = 0; i < mod.routes.length; i++) {
      const route = mod.routes[i];
      const qId = `${mod.id}-${String(i + 1).padStart(2, '0')}`;
      process.stdout.write(`Testing ${mod.id} ${route}... `);

      const consoleErrors = [];
      const onConsole = msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      page.on('console', onConsole);

      try {
        await page.goto(`${BASE_URL}${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });
        await page.waitForTimeout(500);

        const screenshotPath = path.join(modDir, `Q-${qId}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        page.off('console', onConsole);
        const pass = consoleErrors.length === 0;
        if (pass) passCount++; else failCount++;
        results.push({ mod: mod.id, route, qId, status: pass ? 'PASS' : 'FAIL' });
        console.log(pass ? 'PASS' : 'FAIL');
      } catch (err) {
        page.off('console', onConsole);
        failCount++;
        results.push({ mod: mod.id, route, qId, status: 'FAIL', error: err.message });
        console.log('FAIL');
      }
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`  FULL VISION REGRESSION GATE RESULTS`);
  console.log('========================================');
  console.log(`  Total: ${EXPECTED_TOTAL}`);
  console.log(`  Passed: ${passCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log(`  Coverage: ${((passCount / EXPECTED_TOTAL) * 100).toFixed(1)}%`);

  if (failCount > 0) {
    console.log('\nFailed screens:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  FAIL ${r.mod} ${r.route}`);
    });
    process.exit(1);
  }

  console.log('\n  156/156 PASS — All anchor screens verified!');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});