import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

async function saveScreenshot(page, filename) {
  const outDir = path.join(process.cwd(), "artifacts", "screenshots");
  ensureDir(outDir);
  const outPath = path.join(outDir, filename);
  await page.screenshot({ path: outPath, fullPage: true });
  return outPath;
}

test("happy path: search → send → react → quick reply", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await expect(page.getByTestId("chat-view")).toBeVisible();
  await saveScreenshot(page, "desktop-chat.png");

  await page.getByLabel("Search conversations").fill("Mina");
  await expect(page.getByTestId("conversation-c2")).toBeVisible();
  await expect(page.getByTestId("conversation-c1")).toHaveCount(0);

  await page.getByTestId("conversation-c2").click();
  await expect(page.locator("#activeTitle")).toHaveText("Mina Chen");

  await page.getByTestId("composer-input").fill("Hello Mina");
  await page.getByTestId("composer-input").press("Enter");
  await expect(page.getByTestId("message-list").getByText("Hello Mina")).toBeVisible();

  await page.getByTestId("reaction-c2-m6-wow").click();
  await expect(page.getByTestId("reaction-c2-m6-wow")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("reaction-c2-m6-wow").locator(".count")).toHaveText("2");

  await page.getByTestId("quick-thanks").click();
  await expect(page.getByTestId("message-list").getByText("Thanks!")).toBeVisible();
});

test("negative: empty search shows no results state", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search conversations").fill("zzzz-nope");
  await expect(page.getByTestId("no-conversations")).toHaveText("No conversations found");
});

test("negative: Shift+Enter does not send", async ({ page }) => {
  await page.goto("/");

  const messages = page.getByTestId("message-list").locator("li");
  const before = await messages.count();

  await page.getByTestId("composer-input").click();
  await page.getByTestId("composer-input").type("Line 1");
  await page.getByTestId("composer-input").press("Shift+Enter");
  await page.getByTestId("composer-input").type("Line 2");

  await expect(page.getByTestId("composer-input")).toHaveValue("Line 1\nLine 2");
  await expect(messages).toHaveCount(before);
});

test("negative: refresh resets in-memory messages + mobile screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 820 });
  await page.goto("/");

  const unique = `persist-check-${Date.now()}`;
  await page.getByTestId("composer-input").fill(unique);
  await page.getByTestId("composer-input").press("Enter");
  await expect(page.getByTestId("message-list").getByText(unique)).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("message-list").getByText(unique)).toHaveCount(0);

  await saveScreenshot(page, "mobile-stacked.png");

  const hasNoHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= window.innerWidth + 1;
  });
  expect(hasNoHorizontalScroll).toBeTruthy();
});

test("screenshot: empty state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/?empty=1");
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await saveScreenshot(page, "empty-state.png");
});
