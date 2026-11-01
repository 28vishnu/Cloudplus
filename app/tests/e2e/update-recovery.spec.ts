import { expect, test } from '@playwright/test';
import { desktopFixture, nativeCalls, openSettings } from './desktop-fixture';
import { INITIAL_UPDATE_CHECK_DELAY_MS, UPDATE_RECHECK_INTERVAL_MS } from '../../src/services/updatePolicy';

test('no unconfigured or upstream update feed is contacted', async ({ page }) => {
  await page.clock.install();
  await desktopFixture(page);
  await page.goto('/');
  await expect(page.getByText('Holiday folder photo.jpg', { exact: true })).toBeVisible({ timeout: 30_000 });
  await page.clock.fastForward(INITIAL_UPDATE_CHECK_DELAY_MS + UPDATE_RECHECK_INTERVAL_MS);
  expect(await nativeCalls(page, 'plugin:updater|check')).toHaveLength(0);

  await openSettings(page);
  const settings = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Settings', exact: true }) });
  await settings.getByRole('button', { name: 'Check for Updates', exact: true }).click();
  await expect(page.getByText(/Cloudplus updates are unavailable until an authorized update feed is configured/)).toBeVisible();
  expect(await nativeCalls(page, 'plugin:opener|open_url')).toHaveLength(0);
});

test('automatic update preference remains respected while no feed is configured', async ({ page }) => {
  await page.clock.install();
  await desktopFixture(page, { settings: { autoUpdate: false } });
  await page.goto('/');
  await expect(page.getByText('Holiday folder photo.jpg', { exact: true })).toBeVisible({ timeout: 30_000 });
  await page.clock.fastForward(UPDATE_RECHECK_INTERVAL_MS + INITIAL_UPDATE_CHECK_DELAY_MS);
  expect(await nativeCalls(page, 'plugin:updater|check')).toHaveLength(0);
});
