import { expect, test } from '@playwright/test';
import { desktopFixture, nativeCalls } from './desktop-fixture';

for (const supporterState of ['inactive', 'active', 'needs_refresh'] as const) {
  test(`${supporterState} account uses the ad-free app without contacting sponsor services`, async ({ page }) => {
    const sponsorRequests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (/highperformanceformat\.com|adsterra|\/ad-banner|\/ad-script/i.test(url)) sponsorRequests.push(url);
    });

    await desktopFixture(page, { supporterState });
    await page.goto('/');
    await expect(page.getByText('Holiday folder photo.jpg', { exact: true })).toBeVisible({ timeout: 30_000 });

    await expect(page.locator('#adsterra-banner-container')).toHaveCount(0);
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.getByText(/Sponsored|Patrocinado|Sponsor/i)).toHaveCount(0);
    expect(sponsorRequests).toEqual([]);
    expect(await nativeCalls(page, 'cmd_begin_supporter_checkout')).toHaveLength(0);
  });
}

test('legacy supporter activation remains restorable without a new purchase offer', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { __TAURI_INTERNALS__: {
      invoke: async (command: string) => {
        if (command === 'cmd_get_supporter_status') return {
          state: 'inactive', ad_free: false, message: 'No verified supporter activation is stored on this device.',
          terms_version: '2026-08-11', terms_url: 'https://example.invalid/terms',
          expires_at: null, offline_until: null, recovery_code_saved: false, checkout_pending: false,
        };
        throw new Error(`Unavailable fixture command: ${command}`);
      },
    } });
  });
  await page.goto('/?a11y-fixture=supporter');
  const section = page.locator('#desktop-supporter-section');
  await expect(section).toBeVisible();
  await expect(section).toContainText(/restore/i);
  await expect(section).not.toContainText('$5');
  await expect(section.getByRole('button', { name: /restore/i })).toBeVisible();
}
