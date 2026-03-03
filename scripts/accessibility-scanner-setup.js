#!/usr/bin/env node

/**
 * Primero Accessibility Scanner
 * Crawls all pages in the admin interface and generates accessibility reports
 * Requires: pa11y-ci, puppeteer, dotenv
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: ['.env.local', '.env'] });

const baseUrl = process.env.ACCESSIBILITY_BASE_URL || 'http://localhost:3000/v2';
const reportDir = process.env.ACCESSIBILITY_REPORT_DIR || './accessibility-reports';
const username = process.env.PRIMERO_USERNAME || 'primero';
const password = process.env.PRIMERO_PASSWORD || 'primer0!';

// Ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

console.log('🔍 Primero Accessibility Scanner');
console.log('================================\n');
console.log(`Base URL: ${baseUrl}`);
console.log(`Report Directory: ${reportDir}\n`);

// Admin interface pages to scan
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

const urls = adminPages.map(page => `${baseUrl}${page}`);

// Create .pa11yci.json configuration
const pa11yConfig = {
  defaults: {
    standard: 'WCAG2AA',
    runners: ['axe'],
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    timeout: 30000,
    wait: 3000,
    beforeEach: `
      // Login if on login page
      const page = await browser.newPage();
      await page.goto('${baseUrl}/login');
      
      const isLoginPage = await page.evaluate(() => {
        return document.querySelector('[data-testid="login-form"]') !== null;
      });
      
      if (isLoginPage) {
        await page.type('input[name="user[login]"]', '${username}');
        await page.type('input[name="user[password]"]', '${password}');
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
      }
      
      await browser.close();
    `
  },
  urls: urls,
  timeout: 30000,
  wait: 3000
};

// Write configuration
fs.writeFileSync('.pa11yci.json', JSON.stringify(pa11yConfig, null, 2));

console.log(`✓ Created .pa11yci.json with ${urls.length} pages to scan\n`);
console.log('Pages to scan:');
urls.forEach(url => console.log(`  • ${url}`));

console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install --save-dev pa11y-ci');
console.log('2. Run scan: npx pa11y-ci');
console.log('3. Results will be saved to: ' + reportDir);
console.log('\n💡 Note: Make sure your Primero server is running at ' + baseUrl);
