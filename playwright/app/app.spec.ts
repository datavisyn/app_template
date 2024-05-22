import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('App test 01', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('My first campaign')).toBeVisible();
  });
});