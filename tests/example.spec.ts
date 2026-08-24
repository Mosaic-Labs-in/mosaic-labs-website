import { test, expect } from '@playwright/test';

test.describe('Mosaic Labs Website', () => {
  test('home page loads with correct title and sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mosaic Labs/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('data operations page loads', async ({ page }) => {
    await page.goto('/data-operations');
    await expect(page.locator('body')).toContainText(/Data Operations/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('market intelligence page loads', async ({ page }) => {
    await page.goto('/market-intelligence');
    await expect(page.locator('body')).toContainText(/Market Intelligence/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('inquiry page loads and displays contact form', async ({ page }) => {
    await page.goto('/inquiry');
    await expect(page.locator('h1')).toBeVisible();
  });
});
