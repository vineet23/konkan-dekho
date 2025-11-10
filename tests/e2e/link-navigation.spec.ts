import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Hyperlink navigation", () => {
  test("should navigate to a plot page from homepage", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.click("a[href*='/sea-nest-villa-panaromic-sea-view']");
    await page.waitForURL("**/sea-nest-villa-panaromic-sea-view-ratnagiri");
    expect(page.url()).toContain("/sea-nest-villa-panaromic-sea-view-ratnagiri");
  });

  test("should navigate to a blog post page from blogs page", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/blogs`);
    await page.click(
      "a[href*='/blogs/Hidden-homestays-in-konkan-you-did-not-know-about']"
    );
    await page.waitForURL(
      "**/blogs/Hidden-homestays-in-konkan-you-did-not-know-about"
    );
    expect(page.url()).toContain(
      "/blogs/Hidden-homestays-in-konkan-you-did-not-know-about"
    );
  });

  test("should navigate to a featured location page", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/explore/featured-locations`);
    await page.click("a[href*='/explore/all-plots?location=Ratnagiri']");
    await page.waitForURL("**/explore/all-plots?location=Ratnagiri");
    expect(page.url()).toContain("?location=Ratnagiri");
  });

  test("should navigate to the blogs page from the navbar", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.click("nav a[href='/blogs']");
    await page.waitForURL("**/blogs");
    expect(page.url()).toContain("/blogs");
  });
});
