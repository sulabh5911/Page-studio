import { test, expect } from '@playwright/test';

test.describe('Publish flow', () => {
  test('publisher can publish and preview reflects release', async ({ page }) => {
    const uniqueHeading = `Published at ${Date.now()}`;

    await page.goto('/api/auth?role=publisher&redirect=/studio/home');

    await page.getByText('hero', { exact: true }).click();
    await page.locator('#heading').fill(uniqueHeading);

    await page.getByRole('button', { name: 'Publish page' }).click();
    await page.getByRole('button', { name: 'Confirm Publish' }).click();

    await expect(page.getByText(/Published version \d+\.\d+\.\d+/)).toBeVisible({ timeout: 10000 });

    await page.goto('/preview/home', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: uniqueHeading })).toBeVisible();
  });

  test('republishing identical draft is idempotent', async ({ page }) => {
    await page.goto('/api/auth?role=publisher&redirect=/');

    const pagePayload = {
      pageId: 'mock-page-1',
      slug: 'home',
      title: 'Welcome to Page Studio',
      sections: [
        {
          id: 'mock-hero-1',
          type: 'hero',
          props: {
            heading: 'Idempotent Test',
            subheading: 'Subheading',
            ctaText: 'Go',
            ctaUrl: '/go',
          },
        },
      ],
    };

    const first = await page.request.post('/api/publish', { data: { page: pagePayload } });
    expect(first.ok()).toBeTruthy();
    const firstBody = await first.json();
    expect(firstBody.version).toBeTruthy();

    const second = await page.request.post('/api/publish', { data: { page: pagePayload } });
    expect(second.ok()).toBeTruthy();
    const secondBody = await second.json();
    expect(secondBody.status).toBe('unchanged');
    expect(secondBody.version).toBe(firstBody.version);
  });
});
