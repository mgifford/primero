# VS Code Extensions for Accessibility Development

> **These extensions help Primero developers build, test, and validate accessible code without leaving their editor.**

This guide recommends free and commercial extensions for accessibility-focused development in VS Code, organized by use case.

---

## 🔝 Top Recommended Extensions

### 1. **ESLint** (Required)
- **ID:** `dbaeumer.vscode-eslint`
- **Purpose:** Lints JavaScript/JSX code for accessibility violations via `eslint-plugin-jsx-a11y`
- **Why:** Catches inaccessible patterns in React components before runtime
- **Primero-Specific:** Already recommended in [ACCESSIBILITY.md](../../ACCESSIBILITY.md#4-contributor-requirements-the-guardrails)

**Setup in Primero:**
```json
{
  "eslint.validate": ["javascript", "javascriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

### 2. **axe DevTools** (Recommended)
- **ID:** None (browser extension, not VS Code)
- **Download:** [Google Chrome / Brave](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnkpklempisson/), [Edge](https://microsoftedge.microsoft.com/addons/detail/axe-devtools-web-accessibility-testing/kclellecolfeomtpi34intcdeombccga)
- **Purpose:** Scans live web pages for WCAG/ARIA violations; shows accessibility audit in DevTools panel
- **Why:** Tests your running Primero instance against accessibility rules; integrates with CI
- **Workflow:** 
  1. Open Primero in browser
  2. Open DevTools (F12)
  3. Click "axe DevTools" tab
  4. Click "Scan ALL of my page"
  5. Review violations; drill into affected form fields, links, headings

**Primero Use Case:**
Great for testing form accessibility in real time. Run before PR submission.

---

### 3. **WAVE** (Recommended)
- **ID:** None (browser extension, not VS Code)
- **Download:** [WebAIM WAVE](https://wave.webaim.org/extension/)
- **Purpose:** Visual feedback on page structure, labels, errors, contrast issues
- **Why:** Shows accessibility info overlaid on the page (easier to spot missing labels, bad contrast)
- **Workflow:**
  1. Open Primero page in browser
  2. Click WAVE icon
  3. Red/yellow icons mark issues; hover for details

**Primero Use Case:**
Best for visual inspection of form labels, headings, and color contrast.

---

### 4. **Lighthouse** (Built-In)
- **ID:** N/A (built into Chrome DevTools)
- **Purpose:** Full page audits including accessibility, performance, SEO
- **Why:** Official Google tool; generates detailed accessibility reports
- **Workflow:**
  1. Open Primero in Chrome
  2. F12 → Lighthouse tab
  3. Select "Accessibility" category
  4. Click "Analyze page load"

**Primero Use Case:**
Run regularly on form pages; target accessibility score ≥ 85%.

---

## 🧰 Detailed Extension Recommendations by Use Case

### A. **Accessibility Auditing in VS Code**

#### **1. Accessibility Insights for Web** (Microsoft)
- **ID:** `Microsoft.accessibility-insights-web`
- **Purpose:** Web accessibility scanning directly in VS Code via FastPass automated checks
- **Cost:** Free
- **Setup:** Open Command Palette (Cmd+Shift+P) → "Accessibility Insights: Scan"

---

### B. **ESLint & React a11y Linting**

#### **1. ESLint** (Required)
- **ID:** `dbaeumer.vscode-eslint`
- **Plugin:** `eslint-plugin-jsx-a11y` (npm)
- **Rules Covered:**
  - ✅ Missing labels on form inputs
  - ✅ Missing alt text on images
  - ✅ Incorrect ARIA usage
  - ✅ Semantic HTML misuse (e.g., `<div>` instead of `<button>`)
  - ✅ Click handlers on non-interactive elements

**Primero Setup:**
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

**.eslintrc.js:**
```js
module.exports = {
  extends: ['plugin:jsx-a11y/recommended'],
  plugins: ['jsx-a11y'],
};
```

**In VS Code, you'll see inline squiggles:**
```jsx
// Squiggle: "Missing 'alt' attribute on img"
<img src="logo.png" />

// Squiggle: "Missing label for input"
<input type="text" />
```

---

### C. **HTML & Semantic Validation**

#### **1. HTMLHint**
- **ID:** `HTMLHint.vscode-htmlhint`
- **Purpose:** Validates semantic HTML, catches non-semantic patterns
- **Cost:** Free
- **Rules:**
  - ✅ Missing `<title>` tags
  - ✅ Improper heading hierarchy (h1 → h3 skip)
  - ✅ Empty headings, links, buttons
  - ✅ Deprecated HTML elements

**Primero Use Case:** Catch malformed Rails views and ERB templates.

---

#### **2. Web Accessibility** (Maxim Mazurok)
- **ID:** `MaximilianMazurok.html-validate`
- **Purpose:** HTML-Validate integration; deep semantic HTML analysis
- **Cost:** Free
- **Rules:**
  - ✅ Proper `lang` attribute on `<html>`
  - ✅ Correct use of `<form>`, `<fieldset>`, `<legend>`
  - ✅ No nested `<button>` or `<a>` elements
  - ✅ Image alt text validation

---

### D. **Color Contrast & Vision Simulation**

#### **1. A11ify Color Contrast Checker**
- **ID:** None (Browser extension)
- **Download:** [Chrome WebStore](https://chrome.google.com/webstore/detail/a11ify-color-contrast-che/gdalkkkchikejjpbaaakflldpocmmone)
- **Purpose:** WCAG AA/AAA contrast ratio checker for text/background
- **Workflow:** Right-click any text → "Check Color Contrast"
- **Target:** 4.5:1 for normal text (AA), 7:1 for AAA

---

#### **2. Vision Simulator (Chrome DevTools)**
- **Built-In:** DevTools → Rendering → Emulate CSS media feature vision-impairment
- **Types:** Blurred vision, Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind)
- **Workflow:**
  1. F12 → Three dots (more tools) → Rendering tab
  2. Under "Emulate CSS media feature", select vision type
  3. See how form labels, error colors, buttons appear to color-blind users

---

### E. **Keyboard Navigation Testing**

#### **1. Keyboard Accessibility Checker** (No VS Code extension, but good workflow)
- **Manual Test:** Use `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape` only
- **Workflow:**
  1. Unplug mouse (or disable trackpad)
  2. Open Primero in browser
  3. Tab through entire form
  4. Test menu navigation, modal close, focus indicators

#### **2. Focus Indicator Inspector** (Custom Chrome DevTools)
- **Workflow:** F12 → Console
  ```js
  // Highlight all focusable elements
  document.querySelectorAll('button, [href], input, select, textarea, [tabindex]').forEach(el => {
    el.style.outline = '2px solid blue';
  });
  ```

---

### F. **Screen Reader Testing Setup**

#### **1. NVDA (Windows)**
- **Download:** [NV Access](https://www.nvaccess.org/)
- **Cost:** Free, open source
- **Workflow:**
  1. Install NVDA
  2. Open Primero in Chrome
  3. Start NVDA (Insert+Q or App key)
  4. Navigate with arrow keys, H (headings), T (tables), F (form fields)
  5. Listen for announcements (labels, required state, errors, button purpose)

#### **2. VoiceOver (macOS/iOS)**
- **Built-In:** Cmd+F5 to toggle
- **Workflow:**
  1. Open Safari (Chrome support via rotor)
  2. Start VoiceOver
  3. VO (Caps Lock) + Right Arrow to navigate
  4. VO + U to open rotor (headings, form controls, landmarks)

---

### G. **Type Checking & Runtime Safety**

#### **1. TypeScript** (if Primero adopts)
- **ID:** Built-in support
- **Benefits for a11y:**
  - Strict prop types for React components (ensures `label`, `aria-*` props are included)
  - Enum types for ARIA values (`"true" | "false" | "mixed"`)

**Example TypeScript component:**
```tsx
interface FormFieldProps {
  label: string;                    // Required label
  name: string;
  isRequired?: boolean;
  errorMessage?: string;
  "aria-describedby"?: string;      // Type-safe ARIA
  "aria-invalid"?: "true" | "false";
}

const FormField: React.FC<FormFieldProps> = ({ label, name, ...props }) => {
  // TypeScript ensures no missing labels
};
```

---

## 📋 Recommended Extensions Bundle

### Copy this to `.vscode/extensions.json` in Primero root:

```json
{
  "recommendations": [
    // Core a11y testing
    "dbaeumer.vscode-eslint",
    "Microsoft.accessibility-insights-web",
    
    // HTML/semantic validation
    "HTMLHint.vscode-htmlhint",
    "MaximilianMazurok.html-validate",
    
    // Helpful utilities
    "bradlc.vscode-tailwindcss",        // CSS class intellisense (if Primero uses Tailwind)
    "esbenp.prettier-vscode",            // Code formatting (helps readability)
    "ms-vscode.vscode-typescript-next",  // TypeScript support (future-proofing)
    
    // Testing
    "firsttris.vscode-jest-runner",      // Jest test runner (for a11y specs)
    "orta.vscode-jest",                  // Jest in sidebar
    
    // Documentation
    "yzhang.markdown-all-in-one",        // Markdown linting (for doc examples)
  ]
}
```

**Primero team members** can install all at once:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension Microsoft.accessibility-insights-web
code --install-extension HTMLHint.vscode-htmlhint
# ... etc
```

---

## 🧪 Testing Workflow Checklist

### Before Submitting a Form PR:

- [ ] **ESLint passes locally**
  ```bash
  npm run lint:a11y
  # No jsx-a11y errors
  ```

- [ ] **Keyboard navigation tested**
  - [ ] Tab through form (forward and backward)
  - [ ] Test Enter, Space, Escape keys
  - [ ] Focus visible on all interactive elements

- [ ] **Screen reader tested** (pick one)
  - [ ] NVDA (Windows) or
  - [ ] VoiceOver (macOS) or
  - [ ] Chrome DevTools (Accessibility tree check)

- [ ] **Color contrast checked**
  - [ ] Error states ≥ 4.5:1
  - [ ] Normal text ≥ 4.5:1
  - [ ] Focus indicators visible and contrasted

- [ ] **Jest spec includes keyboard tests**
  ```javascript
  fireEvent.keyDown(input, { key: 'Tab' });
  fireEvent.keyDown(input, { key: 'Enter' });
  ```

- [ ] **axe DevTools scan passes** (in browser)
  - [ ] No critical violations
  - [ ] No serious violations in form area

- [ ] **Lighthouse audit score ≥ 85%** (if full page)

---

## References

### Official Resources

- **[WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/Overview/)** – Web Accessibility Initiative
- **[ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)** – WAI-ARIA patterns
- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)** – React a11y linting rules

### Related Primero Documentation

- **[ACCESSIBILITY.md](../../ACCESSIBILITY.md)** – Project accessibility commitment
- **[FORMS_ACCESSIBILITY_BEST_PRACTICES.md](./FORMS_ACCESSIBILITY_BEST_PRACTICES.md)** – Form field requirements
- **[KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md](./KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)** – Navigation guidelines

---

## Questions?

- 📋 **File an issue:** [GitHub](https://github.com/primeroIMS/primero/issues)
- 💬 **Slack:** #accessibility channel
- 📧 **Email:** accessibility@primerohq.org
