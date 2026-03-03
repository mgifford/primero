# Primero Accessibility Testing Setup

This guide explains how to set up and run accessibility testing for Primero, including automated scans, pre-commit hooks, and CI/CD integration.

## Quick Start

### 1. Set Up Environment Credentials

Create a `.env.local` file with your Primero credentials (this file is automatically ignored by git):

```bash
# .env.local - Never commit this file!
PRIMERO_USERNAME=primero
PRIMERO_PASSWORD=primer0!
ACCESSIBILITY_BASE_URL=http://localhost:3000/v2
ACCESSIBILITY_REPORT_DIR=./accessibility-reports
```

Or copy from the example:
```bash
cp .env.example .env.local
# Then edit .env.local with your actual credentials
```

### 2. Install Pre-commit Hooks (Optional but Recommended)

```bash
# Install pre-commit framework
pip install pre-commit

# Install the hooks
pre-commit install

# Optionally: run on all files
pre-commit run --all-files
```

### 3. Run Accessibility Lint

Check JavaScript/React components for accessibility violations:

```bash
# Check all files
npm run lint:a11y

# Fix issues automatically
npm run lint:a11y -- --fix
```

### 4. Full-Site Accessibility Scan

Perform a comprehensive audit of all admin pages.

**Prerequisites:**
- Primero running locally: `npm run dev` (webpack) and `rails s` (Rails)
- `.env.local` file with credentials

**Install dependencies:**
```bash
npm install --save-dev @axe-core/playwright playwright dotenv
```

**Run the scan:**
```bash
node scripts/accessibility-scan-playwright.js
```

**Results:**
- `accessibility-reports/accessibility-report-TIMESTAMP.json` - Full data
- `accessibility-reports/accessibility-report-TIMESTAMP.html` - Visual summary

## Detailed Testing Guide

### Linting (ESLint + jsx-a11y)

ESLint with the jsx-a11y plugin checks your code for common accessibility issues during development.

**What it checks:**
- Proper use of semantic HTML tags
- ARIA attribute usage
- Keyboard navigation support
- Color contrast (limited)
- Form labels and associations
- Image alt text

**Run:**
```bash
npm run lint:a11y
npm run lint:a11y -- --fix     # Auto-fix where possible
npm run lint:a11y -- app/javascript/components/my-component/
```

**Example output:**
```
✔ 245 accessibility rules passed
✔ 12 moderate warnings
✘ 2 errors found

/Users/mike/primero/app/javascript/components/login/component.jsx
  45:10 error Missing alt attribute on images
  67:5  error div element with an onClick must be a button element
```

### Pre-commit Hooks

Pre-commit hooks run automatically before you commit code, ensuring accessibility issues don't get committed.

**Setup (one-time):**
```bash
pre-commit install
```

**What runs:**
1. Trailing whitespace checks
2. ESLint accessibility rules on changed .js/.jsx files
3. Prettier code formatting

**Override (if needed):**
```bash
git commit --no-verify  # Skip hooks (not recommended!)
```

**Manual runs:**
```bash
pre-commit run --all-files   # Run on all files
pre-commit run lint:a11y     # Run specific hook
```

### Full-Site Scans (Playwright + axe-core)

The most comprehensive testing option. Crawls all admin pages and runs axe-core accessibility scanning.

**Setup:**
```bash
# Install Playwright and axe-core
npm install --save-dev @axe-core/playwright playwright dotenv
```

**Configuration:**
Create `.env.local`:
```bash
PRIMERO_USERNAME=primero
PRIMERO_PASSWORD=primer0!
ACCESSIBILITY_BASE_URL=http://localhost:3000/v2
ACCESSIBILITY_REPORT_DIR=./accessibility-reports
```

**Run scan:**
```bash
node scripts/accessibility-scan-playwright.js
```

**What it does:**
1. Starts a headless browser
2. Logs into Primero
3. Crawls each admin page
4. Runs axe-core on each page
5. Generates JSON and HTML reports

**Reports:**
- **JSON format**: Machine-readable, all details
  ```json
  {
    "timestamp": "2024-03-03T10:30:00Z",
    "pages": [
      {
        "url": "http://localhost:3000/v2/dashboard",
        "violations": [
          {
            "id": "color-contrast",
            "issue": "Text color contrast ratio is 3.2:1, expected 4.5:1"
          }
        ]
      }
    ]
  }
  ```

- **HTML format**: Human-readable summary
  ```
  Total Violations: 12
  Total Passes: 145
  Pages Scanned: 15
  ```

### Manual Testing with Browser Tools

#### axe DevTools (Recommended)

**Install:**
- Chrome: [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnkpklempisson/reviews)
- Firefox: [axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

**Use:**
1. Open page in browser
2. Open DevTools (F12)
3. Click "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review results (violations, passes, incomplete)

#### WAVE (Web Accessibility Evaluation Tool)

**Install:**
- Chrome: [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpobllcpbcmfbjnjlhdohjoliar)
- Firefox: [WAVE](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)

**Use:**
1. Install extension
2. Click WAVE icon in browser
3. See inline annotations for: errors, contrast, structure
4. Click icons for details and remediation help

#### Keyboard Navigation Testing

**How to test:**
1. Open the page
2. Press `Tab` to move forward through elements
3. Press `Shift+Tab` to move backward
4. Use `Enter` to activate buttons/links
5. Use `Space` for buttons/checkboxes
6. Use `Arrow Keys` within dropdown menus

**Check for:**
- Focus visible (boxes look different when focused)
- Logical tab order (left-to-right, top-to-bottom)
- No keyboard traps (can always tab out)
- All interactive elements accessible

**Example:**
```
Tab through login form:
1. Username input (focus visible)
2. Password input (focus visible)
3. Login button (focus visible, Enter activates)
✓ All accessible via keyboard
```

### Screen Reader Testing

#### NVDA (Free, Windows)

**Install:** https://www.nvaccess.org/download/

**Basic controls:**
- `Insert+Up Arrow` - Read line
- `Insert+Down Arrow` - Read all (continuous reading)
- `Tab` - Move to next focusable element
- `Q` - Quit speech

#### JAWS (Commercial, Windows)

**Demo mode:** Available at https://www.freedomscientific.com/products/software/jaws/

#### Safari with VoiceOver (Mac)

**Enable:** `System Preferences > Accessibility > VoiceOver`

**Controls:**
- `VO+Right/Left` - Navigate
- `VO+Space` - Activate
- `VO+Down` - Enter web rotor

---

## CI/CD Integration

### GitHub Actions

Two workflows are configured:

#### 1. Accessibility Scan (Scheduled - Weekly)
- **When:** Every Monday at 6:00 AM UTC
- **What:** Runs full-site scan on all admin pages
- **Output:**  Artifacts + automatic issue creation
- **Configuration:** `.github/workflows/accessibility-scan.yml`

**Secrets required:**
```
ACCESSIBILITY_USERNAME  = primero
ACCESSIBILITY_PASSWORD  = primer0!
```

**Variables required:**
```
ACCESSIBILITY_SCAN_URL  = http://localhost:3000/v2
```

#### 2. PR Checks (On Pull Request)
- **When:** PRs touching `app/javascript/**`
- **What:** Runs ESLint accessibility rules
- **Status:** Required pass/fail on PR

---

## Troubleshooting

### Issue: "Cannot find module '@axe-core/playwright'"

**Solution:**
```bash
npm install --save-dev @axe-core/playwright playwright
```

### Issue: Scan times out connecting to http://localhost:3000

**Solution:**
1. Make sure Primero is running:
   ```bash
   npm run dev          # In one terminal
   rails s              # In another terminal
   ```
2. Check the URL in `.env.local`
3. Increase timeout in script if needed

### Issue: ".env.local is missing"

**Solution:**
```bash
cp .env.example .env.local
# Edit with your actual credentials
```

### Issue: Pre-commit hook runs every commit even if not in JS

**Solution:** This is expected - the hook checks if files match the pattern. You can modify `.pre-commit-config.yaml` or run specific hooks:

```bash
pre-commit run lint:a11y -- --files app/javascript/**
```

### Issue: "Pre-commit hook failed: npm run lint:a11y"

**Reasons & Solutions:**

1. **ESLint not installed:**
   ```bash
   npm install --save-dev eslint eslint-plugin-jsx-a11y
   ```

2. **Syntax errors in code:**
   ```bash
   npm run lint:a11y -- --fix  # Auto-fix if possible
   ```

3. **JSX-specific rules failing:**  
   Ensure files have `.jsx` extension and ESLint config includes React plugin

---

## Best Practices

### During Development

1. **Keep linting enabled** in your editor:
   - VS Code: Install "ESLint" extension
   - Vim/Neovim: Use ALE or Coc-eslint
   - Sublime: Use SublimeLinter-eslint

2. **Use pre-commit hooks** to catch issues before pushing

3. **Test keyboard navigation** on complex components

### Before Submitting PR

1. Run ESLint accessibility checks:
   ```bash
   npm run lint:a11y -- --fix
   ```

2. Test manually with browser extension (axe or WAVE)

3. If touching form inputs or buttons, test with keyboard

4. If header structure changed, verify with Web Rotor

### Before Merge

1. Verify pre-commit checks pass

2. CI/CD ESLint checks pass on PR

3. No new critical violations (documented in WCAG section)

---

## Resources & References

| Resource | URL | Purpose |
|----------|-----|---------|
| WCAG 2.2 AA | https://www.w3.org/WAI/WCAG22/quickref/ | Accessibility standards |
| axe-core Rules | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md | Available axe checks |
| jsx-a11y | https://github.com/jsx-eslint/eslint-plugin-jsx-a11y | ESLint plugin docs |
| WebAIM Articles | https://webaim.org/ | Practical guides |
| MDN Accessibility | https://developer.mozilla.org/en-US/docs/Web/Accessibility | Technical reference |
| ARIA Authoring Practices | https://www.w3.org/WAI/ARIA/apg/ | ARIA patterns |
| Primero Accessibility | [doc/ACCESSIBILITY.md](../doc/ACCESSIBILITY.md) | Project-specific guidance |

---

## Questions?

- Check existing [accessibility issues](../../issues?q=label%3Aaccessibility)
- Open new issue with `accessibility` label
- See [doc/ACCESSIBILITY.md](../doc/ACCESSIBILITY.md) for governance & roadmap

**Remember:** Automated testing catches ~40% of issues. Manual testing & assistive technology validation is essential for true accessibility.
