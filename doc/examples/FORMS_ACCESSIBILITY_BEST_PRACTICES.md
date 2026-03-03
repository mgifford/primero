# Forms Accessibility Best Practices

> **All Primero form fields must be accessible to users with disabilities, regardless of device, assistive technology, or connectivity.**

This document defines field-level and form-level requirements for accessible form design, validation, error handling, and testing in Primero. Apply these guidelines to all form components in `app/javascript/components/form/fields/`.

---

## 1. Core Principle

**Every form control must have:**
- ✅ A programmatically associated label
- ✅ A clear, descriptive name (not placeholder text)
- ✅ Keyboard accessibility (no mouse required)
- ✅ Clear error messaging linked to the field
- ✅ Visible focus indicator
- ✅ Appropriate input type for the data

**Who must test:**
- Users with screen readers (NVDA, JAWS, VoiceOver)
- Users navigating via keyboard only
- Users with low vision (zoom, high contrast)
- Users with cognitive disabilities (clear instructions, no time limits)

---

## 2. Labels and Instructions

### 2.1 Associating Labels with Form Controls

**Requirement:** Every form control must have a `<label>` element associated via `for` attribute (HTML) or `htmlFor` prop (React).

#### ✅ Good: Explicit Label Association

**HTML:**
```html
<label for="given-name">Given Name</label>
<input id="given-name" type="text" name="given_name" required />
```

**React (Formik + JSX):**
```jsx
export const TextInput = ({ label, name, isRequired, ...props }) => {
  const [field] = useField(name);
  const id = `form-${name}`;

  return (
    <>
      <label htmlFor={id}>
        {label}
        {isRequired && <span aria-label="required">*</span>}
      </label>
      <input id={id} {...field} {...props} required={isRequired} />
    </>
  );
};
```

#### ❌ Bad: Placeholder-Only Labels

```html
<!-- WRONG: No label element -->
<input type="text" placeholder="Given Name" />

<!-- WRONG: Floating label without association -->
<input type="text" />
<span>Given Name</span>
```

**Why:** Screen readers don't announce placeholders reliably. Placeholder text disappears when users start typing, leaving them unsure what to enter.

---

### 2.2 Required Field Indicators

**Requirement:** Mark required fields in text AND visually; never use color alone.

#### ✅ Good: Text + Visual Indicator

```jsx
<label htmlFor="age">
  Age <span className="required" aria-label="required">*</span>
</label>
<input id="age" type="number" required aria-required="true" />
```

**CSS:**
```css
.required {
  color: #d32f2f;  /* Red visual marker */
  font-weight: bold;
  margin-left: 0.25em;
}
```

#### ❌ Bad: Color Alone

```jsx
<!-- WRONG: Red asterisk with no text alternative -->
<label htmlFor="age" style={{ color: "red" }}>Age *</label>
```

---

### 2.3 Instructions & Hints

**Requirement:** For complex fields or validation rules, provide clear instructions before the control.

#### ✅ Good: Clear Instructions Above Field

```jsx
<fieldset>
  <legend>Phone Number</legend>
  <p className="instructions">Format: +1 (234) 567-8900</p>
  <input 
    id="phone" 
    type="tel" 
    pattern="[0-9\-\+\(\)\s]+" 
    aria-describedby="phone-format"
  />
  <small id="phone-format">Hyphens, spaces, and parentheses are optional.</small>
</fieldset>
```

#### ❌ Bad: Buried Instructions

```jsx
<!-- WRONG: Instructions in placeholder, too late -->
<input placeholder="Call: +1 (234) 567-8900 / Mobile: +1 (234) 567-8901" />
```

---

### 2.4 Custom Fieldsets for Radio & Checkbox Groups

**Requirement:** Group related controls (radio buttons, checkboxes) with `<fieldset>` and `<legend>`.

#### ✅ Good: Grouped with Legend

**HTML:**
```html
<fieldset>
  <legend>What is the primary income source?</legend>
  <div>
    <input id="income-formal" type="radio" name="income_source" value="formal" />
    <label for="income-formal">Formal employment</label>
  </div>
  <div>
    <input id="income-informal" type="radio" name="income_source" value="informal" />
    <label for="income-informal">Informal/Self-employed</label>
  </div>
  <div>
    <input id="income-none" type="radio" name="income_source" value="none" />
    <label for="income-none">No income</label>
  </div>
</fieldset>
```

**React:**
```jsx
export const RadioGroup = ({ legend, name, options, isRequired, ...props }) => {
  const [field] = useField(name);

  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map(({ value, label }) => (
        <div key={value}>
          <input
            id={`${name}-${value}`}
            type="radio"
            name={name}
            value={value}
            checked={field.value === value}
            {...props}
          />
          <label htmlFor={`${name}-${value}`}>{label}</label>
        </div>
      ))}
    </fieldset>
  );
};
```

#### ❌ Bad: No Semantic Grouping

```jsx
<!-- WRONG: No fieldset, legend, or clear grouping -->
<h3>Income Source</h3>
<input type="radio" name="income" /> Formal
<input type="radio" name="income" /> Informal
<input type="radio" name="income" /> None
```

---

## 3. Input Types & Autocomplete

### 3.1 Semantic Input Types

**Requirement:** Use appropriate `type` attributes to provide context and enable correct keyboard/pickers.

#### ✅ Good: Semantic Types

```html
<input type="email" name="user_email" />         <!-- Shows @ on mobile keyboards -->
<input type="tel" name="phone" />                 <!-- Shows numeric keypad -->
<input type="date" name="birth_date" />           <!-- Date picker UI -->
<input type="number" name="age" min="0" />        <!-- Numeric spinner -->
<input type="text" name="family_name" />          <!-- Standard text -->
```

#### ❌ Bad: Generic Text Inputs

```html
<!-- WRONG: Loses context for assistive tech and mobile users -->
<input type="text" name="email" />
<input type="text" name="phone" />
<input type="text" name="birth_date" />
<input type="text" name="age" />
```

---

### 3.2 Autocomplete Attributes

**Requirement:** Enable browser autofill for common user data (improves UX + accessibility).

#### ✅ Good: Autocomplete Enabled

```jsx
<input 
  type="email" 
  name="email" 
  autoComplete="email"
  aria-label="Email address"
/>
<input 
  type="tel" 
  name="phone" 
  autoComplete="tel"
  aria-label="Phone number"
/>
<input 
  type="text" 
  name="family_name" 
  autoComplete="family-name"
  aria-label="Family name"
/>
```

**Approved values (HTML autocomplete):**
- `email`, `tel`, `number`
- `given-name`, `family-name`, `name`
- `street-address`, `address-line1`, `city`, `postal-code`, `country`
- `username`, `password`
- `cc-number`, `cc-exp`, `cc-csc`

---

### 3.3 Avoid Pattern Attributes That Block Paste

**Requirement:** Don't restrict paste/keyboard input with patterns that break copy-paste workflows.

#### ✅ Good: Flexible Input with Server-Side Validation

```jsx
<input 
  type="tel" 
  name="phone" 
  placeholder="+1 (234) 567-8900"
  aria-describedby="phone-format"
/>
<small id="phone-format">
  Enter hyphens, spaces, and parentheses as you type.
</small>
// Server-side validation handles various formats
```

#### ❌ Bad: Restrictive Patterns

```jsx
<!-- WRONG: Blocks paste, only allows exact format -->
<input 
  type="tel" 
  pattern="\+1\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}" 
  placeholder="+1 (234) 567-8900"
/>
```

---

## 4. Validation & Error Messaging

### 4.1 Validation Timing

**Requirement:** Validate on form submit (minimum). Real-time validation is acceptable only if done carefully.

#### ✅ Good: Submit-Time Validation (Preferred)

```jsx
const handleSubmit = async (values) => {
  const errors = validateForm(values); // Server-side preferred
  if (Object.keys(errors).length > 0) {
    setFieldTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    setStatus({ error: "Please correct the errors below." });
  } else {
    submitForm(values);
  }
};
```

#### ⚠️ Real-Time Validation (If Used, Be Careful)

```jsx
// Only after field is blurred (not on each keystroke)
const handleBlur = (e) => {
  const { name, value } = e.target;
  const error = validateField(name, value);
  if (error) {
    // Announce error to screen reader, don't block submission
    announceToScreenReader(`Error in ${name}: ${error}`);
  }
};
```

---

### 4.2 Error Message Specificity

**Requirement:** Errors must be specific, actionable, and written in plain language.

#### ✅ Good: Specific, Actionable Messages

```
❌ "Invalid input" → ✅ "Email must be in the format example@domain.com"
❌ "Wrong" → ✅ "Date of birth must be in the past"
❌ "Error" → ✅ "Phone number must be 10 digits"
❌ "Required" → ✅ "Family name is required to register"
```

---

### 4.3 Associating Errors with Fields

**Requirement:** Programmatically link error messages to form controls.

#### ✅ Good: Error Associated via aria-describedby

```jsx
export const TextInput = ({ label, name, isRequired, ...props }) => {
  const [field, meta] = useField(name);
  const id = `form-${name}`;
  const errorId = meta.error ? `${id}-error` : null;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...field}
        {...props}
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
        aria-describedby={errorId}
        required={isRequired}
      />
      {meta.error && (
        <div id={errorId} className="error" role="alert">
          {meta.error}
        </div>
      )}
    </>
  );
};
```

#### ❌ Bad: Error Not Associated

```jsx
<!-- WRONG: Error floats separately, no link to field -->
<input name="email" />
<div className="error">Email is required</div>  <!-- Not connected! -->
```

---

### 4.4 Visual Error Indicators

**Requirement:** Use multiple visual cues (color + icon/border) to indicate errors; never color alone.

#### ✅ Good: Color + Icon + Border

```jsx
const errorStyles = meta.error ? {
  borderColor: '#d32f2f',  // Red border
  backgroundColor: '#ffebee' // Light red background
} : {};

return (
  <>
    <label htmlFor={id}>{label}</label>
    <input id={id} {...field} style={errorStyles} aria-invalid={!!meta.error} />
    {meta.error && (
      <div className="error-icon-text">
        <span className="error-icon">⚠️</span> {/* Visual icon */}
        <span id={`${id}-error`} role="alert">{meta.error}</span>
      </div>
    )}
  </>
);
```

#### ❌ Bad: Color Alone

```jsx
<!-- WRONG: Red text won't be visible to colorblind users -->
<input style={{ border: "1px solid red" }} />
<span style={{ color: "red" }}>Error</span>
```

---

## 5. Error Summary Pattern (Multi-Error Forms)

**Requirement:** For forms with multiple fields, show an error summary near the top after failed submission.

### Implementation

```jsx
export const FormErrorSummary = ({ errors }) => {
  if (Object.keys(errors).length === 0) return null;

  const errorEntries = Object.entries(errors);

  return (
    <div className="error-summary" role="region" aria-live="polite" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title" className="error-summary-title">
        {errorEntries.length} error{errorEntries.length > 1 ? "s" : ""} prevented form submission
      </h2>
      <ul className="error-summary-list">
        {errorEntries.map(([fieldName, errorMessage]) => (
          <li key={fieldName}>
            <a href={`#form-${fieldName}`}>
              {fieldName}: {errorMessage}
            </a>  {/* Link jumps focus to field */}
          </li>
        ))}
      </ul>
    </div>
  );
};

// In form component:
const handleSubmit = (values) => {
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    // Move focus to error summary
    document.getElementById('error-summary-title').focus();
  }
};
```

**CSS:**
```css
.error-summary {
  border: 2px solid #d32f2f;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
  background-color: #ffebee;
}

.error-summary-title {
  margin-top: 0;
  color: #c62828;
  font-size: 1.1rem;
}

.error-summary-list {
  margin: 0.5rem 0 0 1.5rem;
  padding-left: 0;
}

.error-summary-list li {
  margin-bottom: 0.5rem;
}

.error-summary-list a {
  color: #1976d2;
  text-decoration: underline;
}

.error-summary-list a:hover {
  text-decoration: none;
}
```

---

## 6. Async Feedback & Status Updates

### 6.1 Live Regions for Validation

**Requirement:** Announce validation feedback to screen readers without blocking form interaction.

#### ✅ Good: Async Validation with Live Region

```jsx
export const EmailInput = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const [validationStatus, setValidationStatus] = useState(null);
  const id = `form-${name}`;
  const liveRegionId = `${id}-status`;

  const handleBlur = async (e) => {
    field.onBlur(e);
    const value = e.target.value;
    if (value) {
      setValidationStatus("Checking email availability...");
      const isAvailable = await checkEmailAvailability(value);
      setValidationStatus(
        isAvailable ? "Email is available" : "This email is already in use"
      );
      // Remove after 3 seconds
      setTimeout(() => setValidationStatus(null), 3000);
    }
  };

  return (
    <>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        {...field}
        {...props}
        onBlur={handleBlur}
        aria-describedby={liveRegionId}
      />
      <div
        id={liveRegionId}
        className="sr-only"  /* Screen reader only */
        aria-live="polite"
        aria-atomic="true"
      >
        {validationStatus}
      </div>
    </>
  );
};
```

---

### 6.2 Save Status Announcements

**Requirement:** Announce form submission status (saving, saved, error) to screen readers.

#### ✅ Good: Polite Live Region for Status

```jsx
const [saveStatus, setSaveStatus] = useState(null);

const handleSubmit = async (values) => {
  setSaveStatus("Saving record...");
  try {
    await submitForm(values);
    setSaveStatus("Record saved successfully");
    setTimeout(() => setSaveStatus(null), 3000);
  } catch (error) {
    setSaveStatus(`Error saving: ${error.message}`);
  }
};

return (
  <form>
    {/* Fields... */}
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {saveStatus}
    </div>
  </form>
);
```

---

## 7. Special Form Field Types

### 7.1 Date Inputs

**Current Issue in Primero:** Date fields (e.g., "Date of Birth") may not support direct text entry in all browsers.

#### ✅ Good: Allow Multiple Input Methods

```jsx
export const DateInput = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  const id = `form-${name}`;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="date"
        {...field}
        {...props}
        aria-describedby={`${id}-format`}
      />
      <small id={`${id}-format`}>
        Format: YYYY-MM-DD. You can type directly or use the date picker.
      </small>
    </>
  );
};
```

---

### 7.2 Select Dropdowns

**Requirement:** Labeled selects with clear options.

#### ✅ Good: Proper Select Structure

```jsx
export const SelectInput = ({ label, name, options, isRequired, ...props }) => {
  const [field, meta] = useField(name);
  const id = `form-${name}`;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...field}
        {...props}
        required={isRequired}
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
        aria-describedby={meta.error ? `${id}-error` : null}
      >
        <option value="">-- Select {label} --</option>
        {options.map(({ value, label: optionLabel }) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
      {meta.error && (
        <div id={`${id}-error`} className="error" role="alert">
          {meta.error}
        </div>
      )}
    </>
  );
};
```

#### ❌ Bad: Placeholder as Option

```jsx
<!-- WRONG: Placeholder not an accessible label -->
<select>
  <option disabled selected>Choose an option</option>
  <option>Option 1</option>
</select>
```

---

### 7.3 Checkbox Groups

**Requirement:** Group checkboxes with `<fieldset>` and `<legend>`.

#### ✅ Good: Fieldset + Legend

```jsx
export const CheckboxGroup = ({ legend, name, options, ...props }) => {
  const [field] = useField(name);
  const id = `form-${name}`;

  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map(({ value, label }) => (
        <div key={value}>
          <input
            id={`${id}-${value}`}
            type="checkbox"
            name={name}
            value={value}
            checked={(field.value || []).includes(value)}
            {...props}
          />
          <label htmlFor={`${id}-${value}`}>{label}</label>
        </div>
      ))}
    </fieldset>
  );
};
```

---

## 8. Testing Expectations

### Before Opening a PR with Form Changes:

#### 1. Keyboard Navigation Test

```bash
- Tab through every field (forward and backward with Shift+Tab)
- Open select/date picker with Space or Enter
- Close modal/dropdown with Escape
- Submit form with Enter
- Verify focus is visible at all times
```

#### 2. Screen Reader Test (NVDA / VoiceOver)

Use a free tool:
- **Windows:** NVDA (free, open source)
- **Mac:** VoiceOver (built-in, Cmd+F5)
- **Chrome:** ChromeVox extension

**Checklist:**
- [ ] All labels are announced
- [ ] Required fields are identified
- [ ] Input types are clear (e.g., "email field")
- [ ] Error messages are read immediately
- [ ] Form field group purposes are clear (or use `aria-label`)
- [ ] Buttons describe their action ("Submit", "Save", "Delete")

#### 3. Browser DevTools Accessibility Check

**Chrome DevTools > Accessibility > Audit:**
- [ ] No "Missing label" warnings
- [ ] No "Color contrast" warnings
- [ ] No orphaned `aria-describedby` or `aria-labelledby`

#### 4. Jest Spec with Keyboard Interactions

```jsx
import { render, screen, fireEvent } from "@testing-library/react";

describe("TextInput", () => {
  it("should be focusable and labeled", () => {
    render(<TextInput name="full_name" label="Full Name" />);
    
    const label = screen.getByText("Full Name");
    const input = screen.getByRole("textbox");
    
    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("should show error message and link to field", () => {
    render(<TextInput name="email" label="Email" error="Invalid email" />);
    
    const errorText = screen.getByText("Invalid email");
    const input = screen.getByRole("textbox");
    
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining("error"));
  });

  it("should be keyboard navigable", () => {
    render(<TextInput name="email" label="Email" />);
    const input = screen.getByRole("textbox");
    
    input.focus();
    expect(input).toHaveFocus();
    
    fireEvent.keyDown(input, { key: "Tab" });
    // Next field should receive focus
  });
});
```

---

## 9. Definition of Done (Form Fields)

A form field change is **complete** only when:

- [ ] **Label is associated:** Every input has a visible `<label>` with `htmlFor` (HTML) or `htmlFor` prop (React) matching input `id`.
- [ ] **Required state is clear:** Required fields marked with text (`aria-required="true"`) AND visual indicator (e.g., red asterisk).
- [ ] **Errors are specific:** Error messages are clear and actionable (not "Invalid input").
- [ ] **Errors are linked:** Error text is associated to field via `aria-describedby` or `aria-invalid`.
- [ ] **Input type is semantic:** Use `type="email"`, `type="tel"`, `type="date"`, not generic `type="text"`.
- [ ] **Keyboard navigation works:** Tab, Shift+Tab, Enter, Escape all work as expected.
- [ ] **Focus is visible:** `outline` or `:focus-visible` styling is present.
- [ ] **Screen reader test passed:** Tested with NVDA or VoiceOver.
- [ ] **Jest spec includes keyboard test:** Use `fireEvent.keyDown()` or `userEvent` to test interactions.
- [ ] **No ESLint jsx-a11y warnings:** Check `npm run lint:a11y` passes.
- [ ] **Lighthouse a11y score ≥ 85%** (if testing a full page).

---

## 10. Primero Form Components Reference

### Located in: `app/javascript/components/form/fields/`

| Component | Status | Notes |
| :--- | :--- | :--- |
| `text-input.jsx` | ⚠️ Review | Add aria-invalid, aria-describedby for errors |
| `date-input.jsx` | ⚠️ Review | Ensure text entry is supported (not picker-only) |
| `select-input.jsx` | ⚠️ Review | Check for proper ARIA attributes |
| `radio-input.jsx` | ⚠️ Review | Verify fieldset/legend structure |
| `checkbox-input.jsx` | ⚠️ Review | Verify fieldset/legend structure |
| `checkbox-group.jsx` | ⚠️ Review | Check fieldset/legend for grouping |
| `switch-input.jsx` | ⚠️ Review | Verify accessible toggle pattern (aria-pressed, role="switch") |
| `error-field.jsx` | ⚠️ Review | Check association to parent input via aria-describedby |
| `label.jsx` | ⚠️ Review | Ensure htmlFor always matches input id |

---

## 11. References & Tools

### Machine-Readable Standards

- [WCAG 2.2 Forms (W3C)](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [ARIA Form Patterns (WAI-ARIA APG)](https://www.w3.org/WAI/ARIA/apg/#form)
- [HTML Form Elements (HTML Living Standard)](https://html.spec.whatwg.org/multipage/forms.html)

### Tools

- **[axe DevTools](https://www.deque.com/axe/devtools/)** – Free browser extension for a11y testing
- **[WAVE (WebAIM)](https://wave.webaim.org/)** – Free browser extension
- **[NVDA Screen Reader](https://www.nvaccess.org/)** – Free, open source (Windows)
- **[VoiceOver](https://www.apple.com/accessibility/voiceover/)** – macOS / iOS built-in
- **[ChromeVox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoipkbf?hl=en)** – Chrome extension

### Primero Documentation

- **[ACCESSIBILITY.md](../../ACCESSIBILITY.md)** – Project-wide accessibility commitment
- **[KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md](./KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)** – Navigation and focus management
- **[MANUAL_ACCESSIBILITY_TESTING_GUIDE.md](./MANUAL_ACCESSIBILITY_TESTING_GUIDE.md)** – Step-by-step testing procedures

---

## Questions?

Reach out:
- 📋 **GitHub Issues:** [File an a11y issue](https://github.com/primeroIMS/primero/issues?q=is%3Aopen+label%3Aaccessibility)
- 💬 **Slack:** [#accessibility channel](TBD)
- 📧 **Email:** accessibility@primerohq.org (TBD)
