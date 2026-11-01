import { expect, test } from '@playwright/test';
import { desktopFixture, nativeCalls, openSettings } from './desktop-fixture';

test('authentication no longer offers donation or crypto payment links', async ({ page }) => {
  await desktopFixture(page, { signedOut: true });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /donate|support the project/i })).toHaveCount(0);
  await expect(page.locator('a[href*="trustwallet.com"], img[src*="/donation/"]')).toHaveCount(0);
});

test('legacy supporter terms remain reachable without new checkout offers', async ({ page }) => {
  await desktopFixture(page, { supporterState: 'inactive' });
  await page.goto('/');
  await expect(page.getByText('Holiday folder photo.jpg', { exact: true })).toBeVisible();
  await openSettings(page);
  await page.getByRole('button', { name: /Lifetime (?:License|license purchased)/ }).click();
  const section = page.locator('#desktop-supporter-section');
  await section.getByRole('button', { name: 'Read full terms', exact: true }).click();
  await expect.poll(async () => (await nativeCalls(page, 'plugin:shell|open')).some(call => call.args.path === 'https://example.invalid/terms')).toBe(true);
  await expect(section.getByRole('button', { name: /restore/i })).toBeVisible();
  await expect(section.getByRole('button', { name: /checkout|purchase|pay/i })).toHaveCount(0);
  expect(await nativeCalls(page, 'cmd_begin_supporter_checkout')).toHaveLength(0);
});


test('storage insights show when their retained inventory is partial', async ({ page }) => {
  await desktopFixture(page);
  await page.goto('/');
  await expect(page.getByText('Holiday folder photo.jpg', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Large files', exact: true }).click();
  await expect(page.getByText('1200 indexed results · partial inventory', { exact: true })).toBeVisible();
});
