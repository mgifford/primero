# Primero Accessibility

This document outlines Primero's accessibility strategy, including automated testing, manual testing, and governance.

## Accessibility Governance

Primero is committed to WCAG 2.2 AA compliance. Our accessibility strategy follows a "shift-left" approach, integrating accessibility checks at every layer:

| Layer | When | Tools | Status |
|-------|------|-------|--------|
| **Editor / IDE** | While coding | eslint-plugin-jsx-a11y | ✓ Configured |
| **Pre-commit** | Before push | pre-commit hooks | ✓ Available |
| **PR gate** | On pull request | ESLint accessibility rules | ✓ Active |
| **Scheduled scan** | Weekly (Mon 6 AM UTC) | @axe-core/playwright | ✓ Active |

## Running Accessibility Tests Locally

### 1. Automated Linting (During Development)

Our ESLint configuration includes `jsx-a11y` rules to catch accessibility issues during development:

```bash
# Lint only accessibility issues
npm run lint:a11y

# Lint and fix accessibility issues
npm run lint:a11y -- --fix
```

### 2. Pre-commit Hooks

Set up pre-commit hooks to run accessibility checks before committing:

```bash
# Install pre-commit
pip install pre-commit

# Set up hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files
```

### 3. Full-Site Accessibility Scan

Perform a comprehensive accessibility audit of all admin pages using Playwright and axe-core.

**Prerequisites:**
- Primero must be running locally: `npm run dev` (webpack) and `rails s` (backend)
- Credentials in `.env.local`: `PRIMERO_USERNAME` and `PRIMERO_PASSWORD`

**Run the scan:**

```bash
# First time setup
node scripts/accessibility-scanner-setup.js

# Then run the scan
npx pa11y-ci

# Or use the Playwright version (recommended)
npm install --save-dev @axe-core/playwright playwright dotenv
node scripts/accessibility-scan-playwright.js
```

**Output:**
- JSON report: `accessibility-reports/accessibility-report-TIMESTAMP.json`
- HTML report: `accessibility-reports/accessibility-report-TIMESTAMP.html`

### 4. Manual Testing with Browser DevTools

Use browser extensions for real-time feedback:

**Recommended Tools:**
- **axe DevTools** (Chrome, Firefox, Edge): Real-time accessibility checks
- **WAVE** (Chrome, Firefox): Contrast evaluation and element inspection
- **Accessibility Insights** (Chrome, Edge): Automated + manual testing workflows
- **NVDA** (Windows) or **JAWS** (commercial): Screen reader testing

**Keyboard Navigation:**
Test all interactive elements using only the keyboard:
```
Tab - Move forward
Shift+Tab - Move backward
Enter - Activate buttons/links
Space - Activate buttons/links or checkboxes
Arrow keys - Navigate within components
Esc - Close modals/dropdowns
```

## Accessibility Issue Definitions

### Blocking Violations
Issues that **must be fixed** before merge:
- WCAG 2.2 AA violations with `critical` or `serious` impact (axe-core severity)
- Keyboard navigation failures
- Missing alt text for critical images
- Color contrast below 4.5:1 for normal text

### Non-blocking Issues
Issues reported as warnings:
- `Moderate` impact violations
- Best practice improvements
- Section 508 compliance items

### Manual Testing Required
Not covered by automated tools:
- Screen reader announcements and labels
- Focus management in custom components
- Touch target sizes (responsive only)
- Language and content clarity

## Accessibility Roadmap

### Phase 1: Foundation (Current)
- ✓ ESLint accessibility rules configured
- ✓ Pre-commit hooks available
- ✓ PR gate automation in place
- ✓ Weekly scheduled scans enabled
- Establish baseline of violations

### Phase 2: Remediation (In Progress)
- Triage existing accessibility issues
- Fix critical violations first (critical/serious impact)
- Document known limitations
- Update component library patterns

### Phase 3: Excellence (Planned)
- < 5 violations per automated scan
- 100% keyboard navigable
- All error messages announced to screen readers
- Lighthouse accessibility score ≥ 0.95

## Contributing Accessible Code

### Component Accessibility Checklist

Before submitting a PR, ensure your component:

- [ ] **Semantic HTML**: Uses correct tags (`<button>` not `<div onclick>`)
- [ ] **Keyboard Accessible**: Fully navigable without mouse
- [ ] **Focus Visible**: Focus indicator visible for all interactive elements
- [ ] **ARIA Labels**: Has `aria-label`, `aria-labelledby`, or visible text
- [ ] **Color Contrast**: Text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] **Form Labels**: All inputs have `<label>` or `aria-label`
- [ ] **Alt Text**: Images have alternative text (skip decorative images)
- [ ] **Error Messages**: Form errors help text associated with inputs
- [ ] **No Keyboard Traps**: Can tab out of all components

### Testing Your Component

```jsx
// Example: Accessible button component
import { useCallback } from 'react';

function MyButton({ onClick, disabled, children }) {
  // ✓ Use semantic button
  // ✓ Keyboard accessible by default
  // ✓ Has visible focus indicator (styled with :focus-visible)
  // ✓ Has aria-label or children text
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
}

export default MyButton;
```

### Before You Commit

```bash
# 1. Run accessibility linting
npm run lint:a11y -- --fix

# 2. Install pre-commit hooks (one-time)
pre-commit install

# 3. Commit your code (hooks will run automatically)
git commit -m "feat: accessible component"

# 4. Before pushing, verify with local scan
# (Optional for critical components)
node scripts/accessibility-scan-playwright.js
```

## Resources

### Documentation
- [ACCESSIBILITY.md](../ACCESSIBILITY.md) - Full accessibility best practices
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/) - Official standards
- [WebAIM](https://webaim.org/) - Practical accessibility articles
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Web accessibility guide

### Tools
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md) -Reference of all axe-core checks
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - ESLint accessibility rules
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG contrast validation
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - ARIA patterns and examples

### Reports
- Latest accessibility scan: See `.github/workflows/accessibility-scan.yml`
- Historical reports: Check GitHub Actions artifacts
- Issue tracking: Filter by `accessibility` or `a11y` labels

## Contact & Questions

For accessibility-related questions or to report issues:
1. Check existing [accessibility issues](../../issues?q=label%3Aaccessibility)
2. Open a new issue with label `accessibility`
3. Assign to accessibility team for triage

## References

- [CI/CD Accessibility Best Practices](../examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md)
- [Shift-Left Accessibility](../examples/SHIFT_LEFT_ACCESSIBILITY_AUTOMATION.md)
- [GitHub Accessibility Scanner](https://github.com/github/accessibility-scanner)
- [WCAG 2.2 AA Standard](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Last Updated:** March 3, 2026
**Maintained By:** Primero Core Team
**Next Scan:** Monday, next week at 6:00 AM UTC
