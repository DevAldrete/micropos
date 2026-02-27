import { chromium } from "playwright";

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://localhost:5173/login");

  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "wrongpassword");

  await page.click('button[type="submit"]');

  // Wait for network idle or 3 seconds
  await page.waitForTimeout(3000);

  // Check what the page shows
  const content = await page.content();
  if (content.includes("Could not connect to the server")) {
    console.log("Error shown: Could not connect to the server");
  } else if (content.includes("Invalid email or password")) {
    console.log("Error shown: Invalid email or password");
  } else if (content.includes("An unexpected error occurred")) {
    console.log("Error shown: An unexpected error occurred");
  } else {
    console.log("No known error shown on page");
  }

  await browser.close();
}

test().catch(console.error);
