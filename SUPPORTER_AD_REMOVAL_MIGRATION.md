# Sponsor removal and legacy supporter migration

Status: authorized by the repository owner in the Codex task conversation on 2026-11-01. No production service or repository release action is authorized by that approval.

## Product change

New Cloudplus builds are ad-free for every user. Remove ad placements, external advertiser scripts/requests, ad-specific local server routes, advertising tracking, and new purchase promotions. All application features remain available without payment.

## Existing lifetime supporters

This is a presentation and new-sales change; it does not revoke, rewrite, or migrate stored supporter data. Preserve the existing signed token format, Ed25519 verification key, device-key binding, Android Keystore/desktop credential service, stable account identifiers, recovery codes, up-to-three-device allowance, terms records, and explicit revocation behavior. Keep status refresh, recovery-code activation, and help/terms access. Continue accepting and resolving a checkout that was already pending on an older build; do not initiate a new checkout from the new application.

Existing purchases remain lifetime purchases. Every build continues to be ad-free whether the entitlement is active, offline-grace, expired, unavailable, or revoked. A former purchaser's entitlement and recovery path remain available for compatibility, support, and account history. Do not present entitlement restoration as necessary to remove ads.

## Service and data handling

No Worker, PayPal, D1, R2, signing-key, token, schema, or production configuration change is part of this migration. Keep the existing service available for legacy activation recovery, refresh, revocation, and any already-started checkout. Decommissioning the service would require a separate reviewed plan that guarantees existing purchasers retain a supported recovery/verification path.

No user or payment records are deleted. No migration mutates local settings or secure credentials. Remove only obsolete display state after verifying it is not used by another feature; preserve recovery and pending-checkout state.

## Rollback

The code change is reversible by restoring the previous application source. No database or secure-storage rollback is required. Before any rollback that reintroduces advertising, review the current product promise and protect all existing active/offline-grace entitlements; do not rely on app-side suppression as the only enforcement.

## Verification

- Browser E2E: no sponsor placement, advertising gateway, advertiser network request, or new checkout action; old recovery and refresh UI remains reachable.
- Native E2E: media loopback no longer serves `/ad-banner` or `/ad-script`; ordinary media streaming remains functional.
- Existing supporter-service E2E/security checks: unchanged schemas, capture rules, token signing, recovery, refresh, device limit, and revocation.
- Real Android/desktop upgrade acceptance: install over prior supported releases and confirm secure legacy activation/recovery state is preserved. Device acceptance is separate from fixture-based E2E.

## Release boundary

Android project/source remains local. Use the local signed APK and binary-only Android release path. No GitHub push, hosted Android source build, or production service deployment is part of this migration.
