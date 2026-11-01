import { expect, test } from '@playwright/test';

// Browser fixture: supporter status is controlled; no payment or Telegram service is called.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { __TAURI_INTERNALS__: {
      invoke: async (command: string) => {
        const purchased = new URLSearchParams(location.search).get('license') === 'purchased';
        if (command === 'cmd_get_supporter_status') return {
          state: purchased ? 'active' : 'inactive', ad_free: purchased, message: 'Legacy supporter status.',
          terms_version: '2026-08-11', terms_url: 'https://example.invalid/terms',
          expires_at: purchased ? Date.now() / 1000 + 86400 : null,
          offline_until: purchased ? Date.now() / 1000 + 86400 * 8 : null,
          recovery_code_saved: purchased, checkout_pending: false,
        };
        throw new Error(`Unavailable fixture command: ${command}`);
      },
    } });
  });
});

for (const locale of ['en', 'de', 'ar', 'ja', 'hi']) {
  test(`legacy license recovery remains readable in ${locale} without a sales prompt`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await page.goto(`/?a11y-fixture=supporter&purchase=mobile&locale=${locale}`);
    const card = page.locator('[aria-labelledby="android-supporter-title"]');
    await expect(card).toBeVisible();
    await expect(card).not.toContainText('$5');
    await expect(card.getByText(/restore/i)).toBeVisible();
    await expect(card).not.toContainText('supporter_license.');
    expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  });
}

test('an inactive account can restore a legacy activation without a new checkout', async ({ page }) => {
  await page.addInitScript(() => {
    const previous = window.__TAURI_INTERNALS__;
    if (!previous) return;
    const invoke = previous.invoke;
    (window as any).__supporterCalls = [];
    previous.invoke = async (command: string, ...args: unknown[]) => {
      (window as any).__supporterCalls.push(command);
      return invoke?.(command, ...args);
    };
  });
  await page.goto('/?a11y-fixture=supporter&purchase=desktop');
  const section = page.locator('#desktop-supporter-section');
  await expect(section).toBeVisible();
  await expect(section).not.toContainText('$5');
  await expect(section.getByRole('button', { name: /restore/i })).toBeVisible();
  const commands = await page.evaluate(() => (window as any).__supporterCalls as string[]);
  expect(commands).not.toContain('cmd_begin_supporter_checkout');
});

test('previous purchasers retain status refresh and recovery details', async ({ page }) => {
  await page.goto('/?a11y-fixture=supporter&purchase=desktop&license=purchased');
  await expect(page.getByRole('heading', { name: 'Lifetime license purchased' })).toBeVisible();
  const details = page.locator('#desktop-supporter-section details');
  await details.locator('summary').click();
  await expect(details.getByRole('button', { name: 'Refresh verification' })).toBeVisible();
  await expect(details.getByText(/recovery/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /get lifetime.*\$5/i })).toHaveCount(0);
});
