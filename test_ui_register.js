import { chromium } from "playwright";

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://localhost:5173/register");

  await page.fill('input[name="fullName"]', "John Doe");
  await page.fill('input[name="email"]', "test2@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.fill('input[name="password_confirmation"]', "password123");

  console.log("Clicking submit...");
  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);

  const content = await page.content();
  if (content.includes("Could not connect to the server")) {
    console.log("Error shown: Could not connect to the server");
  } else if (content.includes("Validation failed")) {
    console.log("Error shown: Validation failed");
  } else if (content.includes("An unexpected error occurred")) {
    console.log("Error shown: An unexpected error occurred");
  } else {
    console.log("No known error shown on page");
  }

  await browser.close();
}

test().catch(console.error);
