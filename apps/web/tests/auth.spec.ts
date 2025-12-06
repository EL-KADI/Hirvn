import { test, expect } from '@playwright/test';

test('should allow a user to register', async ({ page }) => {
  await page.goto('/en/register');
  await page.fill('input[id="name"]', 'Test User');
  await page.fill('input[id="email"]', 'test@example.com');
  await page.fill('input[id="password"]', 'password');
  await page.selectOption('select', 'CLIENT');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/en/login');
});
