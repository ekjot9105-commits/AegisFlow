import { test, expect } from '@playwright/test';

test.describe('AegisFlow Core Journey', () => {
  test('User navigates from landing to dashboard and triggers AI Copilot', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/AegisFlow/);
    
    // Find and click the dashboard link/button
    const enterDashboard = page.getByRole('link', { name: /Dashboard/i });
    if (await enterDashboard.isVisible()) {
      await enterDashboard.click();
    } else {
      await page.goto('/dashboard');
    }

    // 2. Dashboard
    // Wait for the URL to change to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // 3. Heatmap Rendering
    // Wait for the Stadium Heatmap to be visible (we look for the SVG map)
    const heatmapSvg = page.locator('svg.w-full.h-full');
    await expect(heatmapSvg).toBeVisible({ timeout: 15000 });

    // 4. AI Copilot
    // Ensure the Copilot input exists
    const chatInput = page.getByPlaceholder(/Ask Copilot/i);
    await expect(chatInput).toBeVisible();

    // Trigger AI Copilot
    await chatInput.fill('What is the crowd status at North Gate?');
    await chatInput.press('Enter');

    // 5. Recommendation rendering
    // Wait for the AI to respond (in our mock setup, it's instant or near-instant)
    const botResponse = page.locator('.bg-slate-800', { hasText: /AI Recommendation|recommendation|North Gate/i }).first();
    await expect(botResponse).toBeVisible({ timeout: 10000 });
  });
});
