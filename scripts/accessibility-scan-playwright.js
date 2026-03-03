#!/usr/bin/env node

// Primero Accessibility Scanner - Automated scanning with Playwright + axe-core
// Performs comprehensive accessibility testing across all admin pages
// Requirements: Primero must be running locally (npm run dev + rails s)

require('dotenv').config({ path: ['.env.local', '.env'] });

const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

// Configuration from environment variables
const baseUrl = process.env.ACCESSIBILITY_BASE_URL || 'http://localhost:3000/v2';
const reportDir = process.env.ACCESSIBILITY_REPORT_DIR || './accessibility-reports';
const username = process.env.PRIMERO_USERNAME || 'primero';
const password = process.env.PRIMERO_PASSWORD || 'primer0!';

// Admin pages to scan
const adminPages = [
  '/login',
  '/dashboard',
  '/cases',
  '/incidents',
  '/tracing-requests',
  '/registry-records',
  '/families',
  '/reports',
  '/admin/agencies',
  '/admin/forms',
  '/admin/lookups',
  '/admin/roles-permissions',
  '/admin/users',
  '/admin/locations',
  '/admin/account'
];

// Initialize report structure
const results = {
  timestamp: new Date().toISOString(),
  baseUrl: baseUrl,
  pages: [],
  summary: {
    violations: 0,
    passes: 0,
    incomplete: 0,
    total: 0,
    pagesScanned: 0
  }
};

// Ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

async function login(page) {
  console.log('🔐 Logging in...');
  await page.goto(`${baseUrl}/login`);
  await page.waitForSelector('input[name="user_name"]', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  await page.type('input[name="user_name"]', username);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  console.log('✓ Logged in successfully\n');
}

async function scanPageWithAxe(browser, pageUrl, authCookies) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Restore authentication cookies
    if (authCookies && authCookies.length > 0) {
      await context.addCookies(authCookies);
    }

    console.log(`📄 Scanning: ${pageUrl.replace(baseUrl, '')}`);
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for any animations

    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    return {
      url: pageUrl,
      violations: axeResults.violations,
      passes: axeResults.passes,
      incomplete: axeResults.incomplete,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`  ✗ Error scanning ${pageUrl}: ${error.message}`);
    return {
      url: pageUrl,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    await context.close();
  }
}

async function generateHtmlReport(results, timestamp) {
  const htmlPath = path.join(reportDir, `accessibility-report-${timestamp}.html`);

  const violationsByPage = results.pages.reduce((acc, page) => {
    if (page.violations) {
      acc[page.url] = page.violations.length;
    }
    return acc;
  }, {});

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Primero Accessibility Scan Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .summary-card { background: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #999; }
    .summary-card.violations { border-left-color: #d32f2f; }
    .summary-card.violations .number { color: #d32f2f; }
    .summary-card.passes { border-left-color: #388e3c; }
    .summary-card.passes .number { color: #388e3c; }
    .summary-card.incomplete { border-left-color: #f57c00; }
    .summary-card.incomplete .number { color: #f57c00; }
    .number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
    .label { font-size: 14px; color: #666; }
    .page-item { background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-radius: 6px; }
    .page-url { font-weight: 500; color: #0066cc; font-family: monospace; word-break: break-all; }
    .page-violations { color: #d32f2f; font-weight: 500; }
    .page-error { color: #d32f2f; }
    h2 { margin-top: 30px; margin-bottom: 15px; color: #333; font-size: 16px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Primero Accessibility Scan Report</h1>
    <div class="meta">
      <div>Generated: ${new Date(results.timestamp).toLocaleString()}</div>
      <div>Base URL: ${results.baseUrl}</div>
      <div>Pages Scanned: ${results.summary.pagesScanned}</div>
    </div>

    <div class="summary">
      <div class="summary-card violations">
        <div class="number">${results.summary.violations}</div>
        <div class="label">Violations Found</div>
      </div>
      <div class="summary-card passes">
        <div class="number">${results.summary.passes}</div>
        <div class="label">Passing Checks</div>
      </div>
      <div class="summary-card incomplete">
        <div class="number">${results.summary.incomplete}</div>
        <div class="label">Incomplete Checks</div>
      </div>
    </div>

    ${results.summary.violations > 0 ? `
      <h2>Pages with Violations</h2>
      <div>
        ${Object.entries(violationsByPage)
          .sort((a, b) => b[1] - a[1])
          .map(([url, count]) => `
            <div class="page-item">
              <div class="page-url">${url}</div>
              <div class="page-violations">${count} violation${count !== 1 ? 's' : ''}</div>
            </div>
          `).join('')}
      </div>
    ` : '<div style="padding: 20px; background: #e8f5e9; border-radius: 6px; color: #2e7d32;">✓ No violations found!</div>'}

    <h2>Pages Scanned</h2>
    <div>
      ${results.pages.map(page => `
        <div class="page-item">
          <div class="page-url">${page.url}</div>
          ${page.error ? `<div class="page-error">Error: ${page.error}</div>` : `<div>Violations: ${page.violations?.length || 0} | Passes: ${page.passes?.length || 0} | Incomplete: ${page.incomplete?.length || 0}</div>`}
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Full scan data available in JSON report: accessibility-report-${timestamp}.json</p>
      <p>For detailed violation information, see the JSON file.</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html);
  console.log(`HTML Report: ${htmlPath}\n`);
}

async function main() {
  console.log('🔍 Primero Accessibility Scanner');
  console.log('================================\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Report Directory: ${reportDir}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Login first
    await login(page);

    // Get authentication cookies after login
    const cookies = await page.context().cookies();

    // Close login page
    await page.close();

    // Scan each page with fresh context
    for (const adminPage of adminPages) {
      const pageUrl = `${baseUrl}${adminPage}`;
      const pageResults = await scanPageWithAxe(browser, pageUrl, cookies);
      results.pages.push(pageResults);
      results.summary.pagesScanned += 1;

      if (pageResults.violations) {
        results.summary.violations += pageResults.violations.length;
        results.summary.total += pageResults.violations.length;
      }
      if (pageResults.passes) {
        results.summary.passes += pageResults.passes.length;
      }
      if (pageResults.incomplete) {
        results.summary.incomplete += pageResults.incomplete.length;
      }
    }

    // Generate JSON report
    const timestamp = Date.now();
    const reportPath = path.join(reportDir, `accessibility-report-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log('\n📊 Scan Complete');
    console.log('================');
    console.log(`Pages scanned: ${results.summary.pagesScanned}`);
    console.log(`Total violations found: ${results.summary.violations}`);
    console.log(`Total passes: ${results.summary.passes}`);
    console.log(`Total incomplete: ${results.summary.incomplete}`);
    console.log(`\nJSON Report: ${reportPath}`);

    // Generate HTML summary
    await generateHtmlReport(results, timestamp);

  } finally {
    await browser.close();
  }
}

// Run the scanner
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
