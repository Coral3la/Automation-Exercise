# Jones Automation Exercise — Contact Form Tests

Playwright + TypeScript automation for the contact form at https://test.netlify.app/.

## What this covers

The suite tests the "Request a call back" form using a Page Object Model structure:
filling the form, submitting valid data, verifying validation on invalid input, and
documenting a validation gap found in the form.

## Project structure

```
pages/ContactPage.ts          Page Object: selectors, actions, and shared test data (constants)
tests/contact-form.spec.ts    Test scenarios
playwright.config.ts          Config: reporters, trace, screenshots, video
```

All field selectors and reusable actions live in `ContactPage.ts`, so the tests stay
short and readable and there is a single place to update if the form changes.

## Test scenarios

1. **Valid data reaches thank-you page** — happy path. Fills all fields with valid
   data, takes a screenshot before submit, clicks the button, and confirms the
   thank-you page is reached.
2. **Empty required field is blocked** — leaves a required field empty and confirms
   submission is blocked (`validity.valueMissing`).
3. **Malformed email is blocked** — enters an email with no `@` and confirms it is
   rejected (`validity.typeMismatch`).
4. **Invalid website URL is blocked** — enters a value with no protocol and confirms
   it is rejected (`validity.typeMismatch`).
5. **Accepts nonsense data (documents weak validation)** — see bug note below.
6. **Bonus: 51-500 employees** — selects the non-default dropdown option and confirms
   the value before submitting.

## Bug found

The form relies only on native HTML5 validation (`required`, `type="email"`,
`type="url"`). It enforces *structural* validity but not *sensible* values: input like
name `j`, email `gg@j.j`, and phone `00` is accepted and reaches the thank-you page.
Test 5 documents this gap on purpose — it passes because the form accepts the bad data.
If validation were later tightened, that test would fail and flag the change.

## How to run

```bash
npm install
npx playwright test            # run all tests
npx playwright show-report     # open the HTML report
```

## Artifacts

On failure the config captures a trace (`on-first-retry`), a screenshot, and a video.
View a trace with:

```bash
npx playwright show-trace test-results/<path-to-trace.zip>
```
