export const SUPPORTER_PROMPT_INTERVAL_MS = 7 * 24 * 60 * 60 * 1_000;
export const SPONSOR_AD_INTERVAL_MS = 15 * 60 * 1_000;
export const SUPPORTER_VALUE_MOMENT_EVENT = 'telegram-drive-supporter-value-moment';

export type SupporterValueMoment = 'upload_completed' | 'download_completed';
export type SupporterPromptTrigger = 'weekly' | 'ad_dismissed' | SupporterValueMoment;

interface SupporterVisibilityStatus {
  state: string;
  ad_free: boolean;
  recovery_code_saved?: boolean;
  checkout_pending?: boolean;
}

export function shouldShowSponsorContent(status: SupporterVisibilityStatus): boolean {
  // Cloud+ is permanently sponsor-free. Keep the status argument for
  // backwards-compatible callers and legacy entitlement migration.
  void status;
  return false;
}

export function sponsorAdCooldownRemaining(
  dismissedAt: number | null,
  now = Date.now(),
): number {
  if (dismissedAt === null || !Number.isFinite(dismissedAt) || dismissedAt <= 0) return 0;
  const elapsed = now - dismissedAt;
  if (elapsed < 0) return 0;
  return Math.max(0, SPONSOR_AD_INTERVAL_MS - elapsed);
}

export function shouldOfferNewSupporterPurchase(status: SupporterVisibilityStatus): boolean {
  // Cloud+ does not sell paid upgrades. Existing activation/recovery data is
  // intentionally retained so old installations are not invalidated.
  void status;
  return false;
}

export function announceSupporterValueMoment(moment: SupporterValueMoment): void {
  window.dispatchEvent(new CustomEvent(SUPPORTER_VALUE_MOMENT_EVENT, { detail: { moment } }));
}

export function isSupporterPromptDue(
  status: SupporterVisibilityStatus,
  lastShownAt: number,
  now = Date.now(),
): boolean {
  void status;
  void lastShownAt;
  void now;
  return false;
}

export function shouldShowSupporterPrompt(
  status: SupporterVisibilityStatus,
  lastShownAt: number,
  now = Date.now(),
): boolean {
  if (status.checkout_pending) return false;
  return isSupporterPromptDue(status, lastShownAt, now);
}
