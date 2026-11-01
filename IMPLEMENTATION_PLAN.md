# Implementation plan

This plan follows the source audit and respects `AGENTS.md`. It is not a claim that the listed work is complete.

## Phase 1: resolve owner-controlled decisions

1. Owner approved sponsor removal on 2026-11-01. A backward-compatible local migration removes placements and new purchase UI while preserving existing entitlement refresh, recovery, device limits, stored credentials, accepted terms, and pending-checkout resolution. Validate these paths with mandated E2E before release.
2. Owner directed Android source to remain local and chose a locally signed APK with binary-only release assets. Keep the source-publication guard and policy unchanged.
3. Identify the intended Cloudplus GitHub repository and target branch. The archives contain no `.git` metadata, so do not guess or push.

## Phase 2: reproduce and baseline

1. Restore dependencies using the pinned Node/Rust versions and lockfiles.
2. Run repository static checks and policy checks, then the mandated E2E journeys in `TESTING.md`.
3. Capture a baseline of application screenshots, Android build output, supporter checks, and the Android publication guard. Label unavailable device/account tests explicitly.
4. Trace auth, channel discovery/permissions, uploads, downloads, media streaming, Android queues, and storage settings from UI event through backend request to Telegram operation.

## Phase 3: Cloudplus identity and visual design

1. Preserve the current package identifier unless a separately reviewed migration proves Android upgrade/signature compatibility and data preservation.
2. Finish Cloudplus branding across metadata, icons, localized strings, legal copy, documentation, and release assets while retaining historical legal text and necessary protocol identifiers.
3. Implement a platform-appropriate premium visual system using existing frontend architecture; use BitChord only as a visual reference. Add theme, translucent surfaces, restrained blur, navigation, and interaction states with accessibility and low-end device fallbacks.
4. Add screenshot/E2E regression coverage before changing user-visible flows.

## Phase 4: channel destination parity

1. Specify supported public/private link forms against Telegram/grammers capabilities.
2. Implement channel resolution, membership/access checks, posting-permission verification, explicit connect/disconnect, channel metadata, default destination, and per-upload destination selection.
3. Persist destination IDs scoped to the account; never treat a URL in preferences as a connected storage destination.
4. Trace upload confirmation and persist Telegram message/channel identifiers. Browse and preview from that peer. Add cancellation, retry, invalid-link, no-membership, and insufficient-permission E2E journeys.
5. Consider migration only after the new upload is confirmed and integrity can be checked; keep originals until then.

## Phase 5: Android reliability

1. Verify actual foreground service / notification behavior and Android lifecycle recovery against supported OS versions.
2. Use device E2E to test picker permissions, process recreation, reboot, network changes, cancellation, video streaming/seeking, secure storage, and install-over-upgrade.
3. Fix observed failures with the existing Tauri/Rust architecture unless evidence justifies native changes.

## Phase 6: release and packaging

1. Preserve local Android source and binary-only APK release under the owner decision.
2. Validate local signed release APK creation using private owner-held signing credentials; never include credentials in source or ZIP.
3. Add/update documentation and checksums; create source ZIP excluding caches, sessions, secrets, and generated artifacts.
4. Before any remote action, inspect remote, target branch, staged files, full outgoing history, secrets, and publication guard. Publish only with verified repository authorization.
