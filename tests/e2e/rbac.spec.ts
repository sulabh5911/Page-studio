import { test, expect } from '@playwright/test';

test.describe('RBAC', () => {
  test('viewer cannot access studio', async ({ page }) => {
    await page.goto('/api/auth?role=viewer&redirect=/');
    await Promise.all([
      page.waitForURL('/'),
      page.goto('/studio/home'),
    ]);
  });

  test('editor cannot publish via API', async ({ page }) => {
    await page.goto('/api/auth?role=editor&redirect=/');
    const response = await page.request.post('/api/publish', {
      data: {
        page: {
          pageId: 'mock',
          slug: 'home',
          title: 'Test',
          sections: [],
        },
      },
    });
    expect(response.status()).toBe(403);
  });

  test('publisher can access studio and sees publish button', async ({ page }) => {
    await page.goto('/api/auth?role=publisher&redirect=/studio/home');
    await expect(page.getByRole('button', { name: 'Publish page' })).toBeVisible();
  });
});
