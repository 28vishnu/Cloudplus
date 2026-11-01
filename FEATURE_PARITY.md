# Feature parity checklist

Statuses describe source evidence only, not verified runtime behavior. “Complete” means a code path was found in this static audit, not that real Telegram tests passed.

| Capability | Status | Evidence / remaining work |
|---|---|---|
| Telegram phone/code/password authentication | Needs improvement | Documented and backend command structure exists; real login, errors, expiry, and restoration need device E2E. |
| QR authentication | Needs improvement | README documents it; runtime paths not exercised. |
| Secure session and API-secret storage | Needs improvement | Platform secure storage code/docs exist; device security and migration require validation. |
| Saved Messages browsing | Complete | Catalog and folder routing explicitly model Saved Messages. |
| Telegram channel folders | Needs improvement | Channel catalog and folder IDs exist; link onboarding, private invite handling, permissions, and multi-destination UX need tracing/testing. |
| Upload and download | Needs improvement | Streaming Telegram upload and download code paths found; authorized-account journeys and failure/retry behavior unverified. |
| Multi-file and large-file transfers | Needs improvement | Queues, size checks, and stream paths exist; real large-file and Android process interruption tests required. |
| Rename, move, copy, delete, share | Needs improvement | Related commands and UI actions exist; Telegram-specific support and behavior vary by action and peer. |
| Search, sorting, filtering | Needs improvement | UI and backend search/catalog features exist; broad parity and pagination behavior need E2E review. |
| Image/video/audio/PDF previews | Needs improvement | Dedicated viewers and streaming routes exist; supported formats and seeking need device validation. |
| Archives and APK handling | Needs improvement | Archive browser/extraction and file categorization described; Android-specific restrictions need validation. |
| Transfer progress/cancel/retry | Needs improvement | Queue controls and cancellation state exist; background/process-death guarantees need Android E2E. |
| Android background execution | Needs improvement | UI describes foreground transfers and saved-queue recovery after reopening; durable OS scheduling/resumption is not established by static inspection. |
| Multiple channel storage destinations and defaults | Missing | Existing channel-as-folder functionality does not establish the requested destination selector and default/multiple-channel management flow. |
| iCloud/Liquid Glass Android redesign | Needs improvement | A responsive blur/gradient glass layer with light/dark variables and fallbacks is present, but the requested Home/Browse/Transfers/Channels/Settings flow and complete dashboard redesign are not implemented. Current mobile UI is React/Tauri, not Compose. |
| Cloudplus application branding | In progress | App UI and primary docs are rebranded; the legacy package identifier is retained for app-data/signature continuity. Historical terms and Telegram-specific identifiers remain. Upstream update feeds are removed pending authorized Cloudplus release configuration. |
| Sponsor removal | Implemented in local source; verification pending | Owner approved on 2026-11-01. Ads and new purchase UI are removed; historical entitlement refresh, recovery, and pending-checkout resolution remain. See `SUPPORTER_AD_REMOVAL_MIGRATION.md`. |
| Automated Android source build in GitHub Actions | Not planned under current owner decision | Owner directed Android source to remain local and use a locally signed APK with binary-only release assets. |
| Signed Android release APK | Not verified | Packaging scripts exist, but no APK was built and no local signing identity was available for verification. |
