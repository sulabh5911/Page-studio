import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

interface AxeReportEntry {
  page: string;
  violations: unknown[];
  criticalCount: number;
}

test.describe('Accessibility', () => {
  const report: AxeReportEntry[] = [];

  test.afterAll(() => {
    const reportDir = path.join(process.cwd(), 'a11y-report');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

    const summary = {
      generatedAt: new Date().toISOString(),
      pages: report,
      criticalViolations: report.reduce((sum, entry) => sum + entry.criticalCount, 0),
    };

    fs.writeFileSync(
      path.join(reportDir, 'a11y-report.json'),
      JSON.stringify(summary, null, 2)
    );
  });

  test('preview page passes a11y checks', async ({ page }) => {
    await page.goto('/preview/home');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    report.push({
      page: '/preview/home',
      violations: accessibilityScanResults.violations,
      criticalCount: criticalViolations.length,
    });

    expect(criticalViolations).toEqual([]);
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('studio page passes a11y checks', async ({ page }) => {
    await page.goto('/api/auth?role=editor&redirect=/studio/home');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    report.push({
      page: '/studio/home',
      violations: accessibilityScanResults.violations,
      criticalCount: criticalViolations.length,
    });

    expect(criticalViolations).toEqual([]);
  });

  test('home page passes a11y checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    report.push({
      page: '/',
      violations: accessibilityScanResults.violations,
      criticalCount: criticalViolations.length,
    });

    expect(criticalViolations).toEqual([]);
  });
});
