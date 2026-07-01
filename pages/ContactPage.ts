import { Page, Locator, expect } from "@playwright/test";

export const URL = "https://test.netlify.app/";

export const valid = {
  name: "John Doe",
  email: "test@example.com",
  phone: "0500000000",
  company: "John Doe Real-Estate",
  website: "https://johnrealestate.com",
  employees: "1-10",
};

export const nonsense = {
  name: "j",
  email: "j@d.c",
  phone: "00",
  company: "jd",
  website: "https://j",
};

type FormData = Partial<typeof valid>;

export class ContactPage {
  name: Locator;
  email: Locator;
  phone: Locator;
  company: Locator;
  website: Locator;
  employees: Locator;
  button: Locator;

  constructor(public page: Page) {
    this.name = page.getByRole("textbox", { name: "Name *" });
    this.email = page.getByRole("textbox", { name: "Email *" });
    this.phone = page.getByRole("textbox", { name: "Phone *" });
    this.company = page.getByRole("textbox", { name: "Company" });
    this.website = page.getByRole("textbox", { name: "Website" });
    this.employees = page.getByLabel("Number of Employees");
    this.button = page.getByRole("button", { name: "Request a call back" });
  }

  async open() {
    await this.page.goto(URL);
  }

  async fill(data: FormData) {
    if (data.name !== undefined) await this.name.fill(data.name);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.phone !== undefined) await this.phone.fill(data.phone);
    if (data.company !== undefined) await this.company.fill(data.company);
    if (data.website !== undefined) await this.website.fill(data.website);
    if (data.employees !== undefined) await this.employees.selectOption(data.employees);
  }

  async submit() {
    await this.button.click();
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL(/thank-you/);
    await expect(this.page.getByText("Thank You!")).toBeVisible();
  }

  async expectBlocked(field: Locator) {
    await expect(this.page).toHaveURL(URL);
    await expect(field).toHaveJSProperty("validity.valid", false);
  }
}
