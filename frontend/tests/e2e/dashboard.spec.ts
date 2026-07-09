import { test, expect } from '@playwright/test';

test.describe('Dashboard AI Operations', () => {
  test('should load dashboard, display heatmap, and execute AI recommendation', async ({ page }) => {
    // 1. Dashboard loads successfully
    await page.goto('/');
    await expect(page.getByText('AegisFlow')).toBeVisible();

    // 2. Stadium heatmap renders
    const heatmap = page.getByText('Live Stadium Heatmap');
    await expect(heatmap).toBeVisible();
    await expect(page.getByRole('button', { name: /Sector North Gate 1/i, includeHidden: true })).toBeVisible();

    // 3. AI recommendation appears
    await expect(page.getByText(/AI Copilot is analyzing telemetry/i)).toBeVisible();
    // Wait for mock data to resolve (1.5s delay)
    await expect(page.getByText('INC-2026-004')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Root Cause')).toBeVisible();
    await expect(page.getByText('AI Reasoning Engine')).toBeVisible();

    // Expand Reasoning Panel
    await page.getByText('AI Reasoning Engine').click();
    await expect(page.getByText('Simultaneous arrival of 3 metro trains')).toBeVisible();

    // 4. Operator clicks Approve
    const approveBtn = page.getByRole('button', { name: /Approve Execution/i });
    await expect(approveBtn).toBeEnabled();
    await approveBtn.click();

    // 5. Success notification / state updates
    // Waiting for executing state to resolve
    await expect(page.getByText(/Execution Status: completed/i, { exact: false })).toBeVisible({ timeout: 5000 });
    
    // 6. Recommendation state updates
    await expect(page.getByRole('button', { name: /Executed/i })).toBeDisabled();
  });
});
