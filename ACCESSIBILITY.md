# Accessibility Commitment (ACCESSIBILITY.md)

> **Primero is committed to building an inclusive case management system accessible to all users, regardless of ability.**

Just as `SECURITY.md` defines how to handle vulnerabilities, **`ACCESSIBILITY.md`** defines the inclusive state of Primero's codebase. It is a human and machine-readable manifest that tracks our commitment to accessibility (a11y) through metrics, guardrails, and automated enforcement.

---

## 1. Our Commitment

We are committed to **WCAG 2.2 AA** compliance for all user-facing interfaces. Primero is deployed globally in humanitarian and child protection contexts where users may have varying device capabilities, connectivity constraints, and accessibility needs. Accessibility is not a feature—it is a requirement.

### Standards We Follow

- **WCAG 2.2 AA**: Web Content Accessibility Guidelines (Web Accessibility Initiative)
- **ARIA 1.2**: Accessible Rich Internet Applications (W3C)
- **HTML Living Standard**: Semantic HTML practices
- **EN 301 549 / Section 508**: Government and procurement accessibility standards

---

## 2. Real-Time Health Metrics

| Metric | Status / Value | Owner |
| :--- | :--- | :--- |
| **Open A11y Issues** | [GitHub Issues](https://github.com/primeroIMS/primero/issues?q=is%3Aopen+label%3Aaccessibility) | @team |
| **A11y PRs Merged (MTD)** | – | @team |
| **Automated Test Pass Rate** | – (via axe-core) | @team |
| **Manual Testing Cadence** | As-needed (per feature) | @team |
| **WCAG 2.2 AA Coverage** | Targeted (forms, navigation, search) | @team |

---

## 3. Known Gaps & Remediation Plan

Primero's strength is case management logic; historically, accessibility was not a primary focus during initial development. We are addressing gaps systematically:

### Critical Focus Areas

#### 3.1 Form Accessibility (High Priority)

**Current State:**
- Form fields exist across `app/javascript/components/form/fields/` (text, date, select, radio, checkbox, etc.)
- Validation error messaging is implemented but needs semantic review.
- Label associations and ARIA attributes need validation.

**Gaps:**
- [ ] Not all error messages are programmatically associated with inputs (`aria-describedby`).
- [ ] `fieldset` and `legend` usage for radio/checkbox groups may be incomplete.
- [ ] Required field indicators may rely on visual cues (color) without text alternatives.
- [ ] Placeholder text in date fields may not meet label requirements.

**Remediation:**
1. Audit all form field components for WCAG 2.1 1.3.1 (Info and Relationships) and 3.3.1 (Error Identification).
2. Implement ARIA labels, descriptions, and invalid state attributes.
3. Add form validation error summary pattern (WCAG 2.2 3.3.4).
4. Document in [`doc/examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md`](./doc/examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md).

**Ticket:** [TBD - Create epic: "Form Accessibility Audit & Remediation"]

---

#### 3.2 Keyboard Navigation (High Priority)

**Current State:**
- React components are interactive (buttons, modals, record lists).

**Gaps:**
- [ ] Record list filtering and row selection may not be fully keyboard accessible.
- [ ] Modal focus management may not be enforced (focus should move to modal on open, restore on close).
- [ ] Long forms may lack skip links or form section navigation for keyboard users.

**Remediation:**
1. Add keyboard navigation audit to CI/CD (see Section 5).
2. Ensure `tabindex` is used sparingly and intentionally.
3. Use `focus-visible` for keyboard-only outline styling.
4. Document in [`doc/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md`](./doc/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md).

---

#### 3.3 Screen Reader Testing (Medium Priority)

**Current State:**
- Semantic HTML and ARIA are partially implemented.

**Gaps:**
- [ ] Not all dynamic content updates announce changes to assistive tech (missing `aria-live` regions).
- [ ] Record status badges may be visual-only without accessible text alternatives.
- [ ] List and table structures may lack proper semantic markup.

**Remediation:**
1. Conduct manual screen reader testing with NVDA and JAWS (or alternatives).
2. Implement `aria-live` regions for async updates (save status, validation, etc.).
3. Add test helpers for screen reader testing in Jest specs.
4. Document in [`doc/examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md`](./doc/examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md).

---

#### 3.4 Color Contrast & Visual Design (Medium Priority)

**Current State:**
- Material-UI theming is in place with configurable colors.

**Gaps:**
- [ ] Some UI states (focus, hover, disabled) may not meet WCAG AA 4.11.3 (Non-text Contrast) ratios.
- [ ] Error states may rely on color alone (WCAG 1.4.1).

**Remediation:**
1. Run Lighthouse and axe DevTools color contrast audits.
2. Enforce color contrast in CI via automation tools.
3. Document in [`doc/examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md`](./doc/examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md).

---

## 4. Contributor Requirements (The Guardrails)

To contribute to Primero, you must follow these accessibility guidelines:

### All Contributors

- **Test locally:** Before opening a PR, run accessibility checks (see Section 5).
- **Read guidelines:** Familiarize yourself with relevant best practice docs (forms, keyboard, etc.).
- **Use semantic HTML:** Avoid `<div>` for interactive elements; use `<button>`, `<a>`, `<form>`, etc.
- **Label every control:** No inputs without associated labels.
- **Test with keyboard:** Ensure all functionality works without a mouse.

### React Component Authors

- **Import and use:** `eslint-plugin-jsx-a11y` errors must be resolved (not suppressed without justification).
- **ARIA attributes:** Use `aria-label`, `aria-labelledby`, `aria-describedby`, and `aria-invalid` as appropriate.
- **Focus management:** Modal and drawer components must manage focus programmatically.
- **Live regions:** Use `aria-live="polite"` or `aria-live="assertive"` for async updates.
- **Write specs:** Include keyboard and screen reader tests in Jest specs (use `screen.getByRole()` and `fireEvent.keyDown()`).

### Rails View Authors

- **Semantic HTML:** Use `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<input>` correctly.
- **Error markup:** Associate error messages with form controls via `aria-describedby` or `aria-invalid`.
- **Skip links:** Include navigation skip links in layouts.

### Example: Accessible React Form Field

```jsx
import { useField } from "formik";

export const TextInput = ({ label, name, isRequired, errorMessage, ...props }) => {
  const [field, meta] = useField(name);
  const id = `form-${name}`;
  const errorId = meta.touched && meta.error ? `${id}-error` : undefined;

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="required" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        {...field}
        {...props}
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
        aria-describedby={errorId}
        required={isRequired}
      />
      {errorMessage && (
        <div id={errorId} className="error" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
```

---

## 5. Automated Check Coverage

We use a combination of automated and manual testing to catch accessibility regressions early.

### Automated Tools

| Tool | Purpose | Integrated? |
| :--- | :--- | :--- |
| **axe-core** | WCAG/ARIA automation | ❌ (In Progress – See Section 6) |
| **ESLint jsx-a11y** | React a11y linting | ✅ (Review in PR) |
| **Lighthouse** | Performance & a11y audit | ⚠️ (Manual, not CI) |
| **HTML Validator** | Semantic HTML checks | ⚠️ (Manual, not CI) |

### Coverage Target

Currently, we estimate **~40%** of accessibility requirements are covered by linting. We aim to reach **~70%** with axe-core automation in CI/CD.

---

## 6. CI/CD Integration (Coming Soon)

We are implementing automated accessibility scanning in GitHub Actions to fail builds on critical violations.

### Planned Workflow

```yaml
# .github/workflows/accessibility-check.yml
name: Accessibility Check
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run axe-core on staging build
        run: npm run test:a11y
      - name: ESLint jsx-a11y
        run: npm run lint:a11y
```

**Status:** 🟡 In progress. [See Issue: #TBD](https://github.com/primeroIMS/primero/issues)

---

## 7. Severity & Triage Taxonomy

When reporting or prioritizing accessibility issues, use these labels and severity levels:

### Issue Labels

- `accessibility` – General a11y category
- `a11y-critical` – Blocks core workflow (e.g., "Cannot submit form")
- `a11y-high` – Significant barrier (e.g., "Keyboard nav broken in record list")
- `a11y-medium` – Inconsistency or minor inconvenience (e.g., "Heading hierarchy off")
- `a11y-low` – Quality of life improvement (e.g., "Improve focus outline styling")
- `wcag-2.1-level-a`, `wcag-2.1-level-aa` – Compliance level

### Priority Matrix

| Severity | Impact | Fix Timeline |
| :--- | :--- | :--- |
| **Critical** | Prevents task completion (e.g., form submission, case search) | Next release |
| **High** | Significant friction, workaround exists | Within 2 sprints |
| **Medium** | Annoyance or inconsistency | Backlog (next 1–2 quarters) |
| **Low** | Quality improvement, no functional impact | Nice-to-have |

---

## 8. Testing Expectations

### For Form Field Changes

Every form field component change must include:

- ✅ Label association validation (check in JSX)
- ✅ Error message association (`aria-describedby`)
- ✅ Keyboard navigation test (tab, enter, esc)
- ✅ Screen reader check (Chrome DevTools Accessibility panel)
- ✅ Jest spec with `screen.getByRole()` and keyboard events

### For Page/Section Changes

Every new page or section must pass:

- ✅ Landmark navigation (main, nav, aside, etc.)
- ✅ Heading hierarchy (h1 → h2 → h3, no skips)
- ✅ Link purpose (link text describes destination)
- ✅ Button purpose (button text describes action)
- ✅ Keyboard-only workflow (all interactions without mouse)
- ✅ Lighthouse a11y audit score ≥ 80%

### Manual Testing Checklist

```bash
# 1. Keyboard-only test
- Tab through the page
- Test Enter, Space, Escape, Arrow keys
- Verify focus is visible and logical
- Check that all interactive elements are reachable

# 2. Screen reader test (NVDA, JAWS, or VoiceOver)
- Enable screen reader
- Navigate page with arrow keys
- Verify headings, landmarks, form labels are announced
- Check error messages are read aloud
- Confirm button/link purposes are clear

# 3. Browser DevTools accessibility panel
- Check computed accessibility tree
- Verify role, name, state, and properties
- Look for contrast issues and missing labels

# 4. Lighthouse audit
- Run in Chrome DevTools > Lighthouse
- Check accessibility score (target ≥ 85%)
- Review specific failed items
```

---

## 9. Assisted Technology We Test With

| Technology | Version | Platform | Testing Status |
| :--- | :--- | :--- | :--- |
| **NVDA (Screen Reader)** | Latest | Windows | ⚠️ Planned |
| **JAWS (Screen Reader)** | Latest | Windows | ⚠️ Planned |
| **VoiceOver** | Latest | macOS / iOS | ⚠️ Planned |
| **Voice Control** | Built-in | macOS / iOS | ⚠️ Planned |
| **Keyboard only** | N/A | All platforms | ✅ Current |
| **Zoom / Text resize** | Browser settings | All platforms | ⚠️ Planned |

---

## 10. Definition of Done (for Accessibility)

A feature or bug fix is **not done** until:

- [ ] All form fields have accessible labels and error associations.
- [ ] Keyboard navigation is fully functional (no mouse required).
- [ ] Screen reader can announce field purpose, value, and errors.
- [ ] Color is not the only means of conveying information.
- [ ] Contrast meets WCAG AA standards (4.5:1 for text).
- [ ] Tests include keyboard and/or screen reader interactions.
- [ ] Lighthouse a11y score is ≥ 85%.
- [ ] No ESLint jsx-a11y violations (or documented exceptions).
- [ ] Accessibility comments are added to PR for reviewers.

---

## 11. Resources & References

### Primero-Specific Guidance

- 📖 **[Form Accessibility Best Practices](./doc/examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md)** – Detailed form patterns, validation, and error handling.
- 📖 **[Keyboard Accessibility Best Practices](./doc/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)** – Navigation, focus management, and interaction patterns.
- 📖 **[Manual Accessibility Testing Guide](./doc/examples/MANUAL_ACCESSIBILITY_TESTING_GUIDE.md)** – Step-by-step testing with keyboard and screen readers.
- 🛠️ **[AGENTS.md](./AGENTS.md)** – AI assistant instructions for respecting a11y standards.

### External Standards & Tools

- **[WCAG 2.2 Overview](https://www.w3.org/WAI/WCAG22/Overview/)** – Official standards documentation (Web Accessibility Initiative)
- **[ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)** – Component patterns and ARIA usage
- **[axe DevTools](https://www.deque.com/axe/devtools/)** – Free accessibility testing browser extension
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** – Chrome DevTools accessibility audit
- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)** – ESLint rules for React accessibility

### Procurement & Policy

- **[Section 508 Requirements](https://www.section508.gov/)** – U.S. government accessibility standards
- **[EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)** – European accessibility standard for ICT

---

## 12. How to Report & Contribute

### Found an Accessibility Issue?

1. **File a GitHub issue** with the label `accessibility`.
2. **Describe the barrier:** What task can't you complete? What device or software were you using?
3. **Provide steps to reproduce:** Include page URL, form name, or component.
4. **Suggest a fix** if you can (optional).

**Example issue:**
```
Title: "Date input not keyboard accessible"
Description:
- Device: Windows 10, NVDA screen reader
- Problem: Cannot type dates in date fields; picker only works with mouse.
- Expected: Able to type dates directly and navigate with arrow keys.
```

### Want to Contribute a Fix?

1. **Read** [`CONTRIBUTING.md`](./CONTRIBUTING.md) for general guidelines.
2. **Review** the relevant best practice guide (form, keyboard, etc.).
3. **Follow the Definition of Done** (Section 10).
4. **Open a PR** with the label `accessibility`.
5. **Request a11y review** from maintainers familiar with accessible coding.

---

## 13. Governance & Maintenance

### Role Definitions

- **Accessibility Champion:** Coordinates a11y strategy, reviews PRs, maintains this document.
  - **[Assign to: @mgifford]**(TBD)
- **QA / Manual Testing:** Conducts keyboard and screen reader testing.
  - **[Assign to: Team TBD]**
- **Automated Testing:** Owns CI/CD a11y workflows and tooling.
  - **[Assign to: DevOps TBD]**

### Review Cadence

- **Monthly:** Review open a11y issues, triage new reports, update metrics.
- **Quarterly:** Conduct full accessibility audit; update remediation plan.
- **Annually:** Review against updated WCAG standards; publish progress report.

---

## 14. Acknowledgments

This `ACCESSIBILITY.md` is modeled on [ACCESSIBILITY.md](https://github.com/mgifford/ACCESSIBILITY.md) by [Mike Gifford](https://github.com/mgifford), with customizations for Primero's React/Rails architecture and humanitarian use case.

---

## Questions?

Reach out to the Primero team:
- 💬 **Community Slack:** [#accessibility channel](TBD)
- 📧 **Email:** accessibility@primerohq.org (TBD)
- 📋 **GitHub Discussions:** [Accessibility topic](https://github.com/primeroIMS/primero/discussions)
