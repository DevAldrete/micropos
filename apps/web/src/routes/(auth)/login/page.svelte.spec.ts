import { page } from "vitest/browser";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import LoginPage from "./+page.svelte";

describe("(auth)/login/+page.svelte", () => {
  it("renders email and password fields", async () => {
    render(LoginPage, { props: { form: null } });

    await expect.element(page.getByLabelText(/email/i)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the sign in button", async () => {
    render(LoginPage, { props: { form: null } });

    await expect
      .element(page.getByRole("button", { name: /authenticate/i }))
      .toBeInTheDocument();
  });

  it("shows a global error banner when form has a non-field error", async () => {
    render(LoginPage, {
      props: {
        form: {
          email: "bad@example.com",
          error: "Invalid email or password.",
          field: undefined,
        },
      },
    });

    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Invalid email or password.");
  });

  it("pre-fills the email field from returned form data", async () => {
    render(LoginPage, {
      props: {
        form: {
          email: "jane@example.com",
          error: "Invalid email or password.",
          field: undefined,
        },
      },
    });

    const emailInput = page.getByLabelText(/email/i);
    await expect.element(emailInput).toHaveValue("jane@example.com");
  });
});
