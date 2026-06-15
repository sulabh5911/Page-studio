import { test, expect } from '@playwright/test';

test.describe('Studio e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth?role=editor&redirect=/studio/home');
  });

  test('can load studio and see mock data', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Welcome to Page Studio' })).toBeVisible();
    await expect(page.getByText('hero', { exact: true })).toBeVisible();
    await expect(page.getByText('featureGrid', { exact: true })).toBeVisible();
  });

  test('can add a new section', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Call to action' }).click();

    await expect(page.getByText('cta', { exact: true })).toBeVisible();
  });

  test('CTA interaction in live preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Call to action' }).click();

    const previewLink = page.locator('section a', { hasText: 'Get Started' }).first();
    await expect(previewLink).toBeVisible();
    await expect(previewLink).toHaveAttribute('href', '/studio/home');
  });
});
