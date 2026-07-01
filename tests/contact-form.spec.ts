import { test, expect } from "@playwright/test";
import { ContactPage, valid, nonsense } from "../pages/ContactPage";

test.describe("Contact form — Request a call back", () => {
  let form: ContactPage;

  test.beforeEach(async ({ page }) => {
    form = new ContactPage(page);
    await form.open();
  });

  test("valid data reaches thank-you page", async ({ page }) => {
    await form.fill(valid);
    await page.screenshot({ path: "before-submit.png", fullPage: true });
    await form.submit();
    await form.expectSuccess();
    console.log("Reached the thank you page ✅");
  });

  test("empty required field is blocked", async () => {
    await form.fill({ ...valid, name: "" });
    await form.submit();
    await form.expectBlocked(form.name);
    await expect(form.name).toHaveJSProperty("validity.valueMissing", true);
  });

  test("malformed email is blocked", async () => {
    await form.fill({ ...valid, email: "notanemail" });
    await form.submit();
    await form.expectBlocked(form.email);
    await expect(form.email).toHaveJSProperty("validity.typeMismatch", true);
  });

  test("invalid website url is blocked", async () => {
    await form.fill({ ...valid, website: "jd" });
    await form.submit();
    await form.expectBlocked(form.website);
    await expect(form.website).toHaveJSProperty("validity.typeMismatch", true);
  });

  test("junk data should be rejected", async () => {
    test.fail();
    await form.fill(nonsense);
    await form.submit();
    await form.expectBlocked(form.name);
  });

  test("bonus: employees changes from 1-10 to 51-500", async () => {
    await expect(form.employees).toHaveValue("1-10");
    await form.fill(valid);
    await form.employees.selectOption("51-500");
    await expect(form.employees).toHaveValue("51-500");
    await form.submit();
    await form.expectSuccess();
  });
});
