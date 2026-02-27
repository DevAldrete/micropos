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

  const [request] = await Promise.all([
    page.waitForRequest((req) => req.method() === "POST"),
    page.click('button[type="submit"]'),
  ]);

  console.log("Request intercepted:", request.url());

  await page.waitForTimeout(2000);

  const content = await page.content();
  if (content.includes("Could not connect to the server")) {
    console.log("Error shown: Could not connect to the server");
  } else {
    console.log("No known error shown on page");
  }

  await browser.close();
}

test().catch(console.error);
