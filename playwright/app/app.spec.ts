import { test } from '@playwright/test';

test.describe('App', () => {
  test('App test 01', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Campaign name').fill('Test campaign name');
    await page.getByText('Campaign description').fill('Test campaign description');
    await page.getByText('Create campaign').click();
    await page.getByText('Delete').click();
  });
});