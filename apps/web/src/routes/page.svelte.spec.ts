import { page } from "vitest/browser";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

describe("/+page.svelte (landing page)", () => {
  it("renders the hero heading", async () => {
    render(Page, { props: { data: { user: null } } });

    const heading = page.getByRole("heading", { level: 1 });
    await expect.element(heading).toBeInTheDocument();
  });

  it("shows Get started and Sign in links when not logged in", async () => {
    render(Page, { props: { data: { user: null } } });

    await expect
      .element(page.getByRole("link", { name: /get started/i }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("link", { name: /sign in/i }))
      .toBeInTheDocument();
  });

  it("shows Go to dashboard link when user is logged in", async () => {
    render(Page, {
      props: {
        data: {
          user: { id: 1, email: "jane@example.com", fullName: "Jane Doe" },
        },
      },
    });

    await expect
      .element(page.getByRole("link", { name: /go to dashboard/i }))
      .toBeInTheDocument();
  });
});
