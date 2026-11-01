/** First automatic update check after launch, once startup work has settled. */
export const INITIAL_UPDATE_CHECK_DELAY_MS = 5_000;

/** Set true only when the Tauri config has an authorized Cloudplus feed. */
export const CLOUDPLUS_UPDATE_FEED_CONFIGURED = false;

/**
 * The app often stays open in the tray for days. Automatic checks repeat on
 * this interval, and run when a window hidden for at least this long is shown.
 */
export const UPDATE_RECHECK_INTERVAL_MS = 6 * 60 * 60 * 1_000;
