# Cloudplus next engineering steps

This source snapshot has no Git metadata or configured Cloudplus remote. Do not push it to an inferred repository. No deployment or publication was authorized.

## Before release

1. Restore JavaScript dependencies and the Rust/Android toolchains; run the E2E, static, and build checks in `TESTING.md`.
2. Implement and test the dedicated Telegram Storage Channels flow, including public/private connection, access/post permission checks, multiple destinations, default selection, account-scoped persistence, real upload routing, browsing, and failure recovery.
3. Complete and validate the requested mobile navigation/dashboard redesign on supported Android devices while preserving accessibility, performance, and reduced-motion behavior.
4. Supply an authorized Cloudplus HTTPS update feed and matching public signing key before re-enabling desktop update checks.
5. Build Android locally with owner-held signing material; verify the signature and upgrade compatibility on devices. Publish only the compiled APK and checksum as separate binary release assets.
6. Identify and authorize the actual Cloudplus repository/branch before any Git operation that publishes changes. Keep Android source out of GitHub and run the repository's publication guard before any push.

The sponsor-removal approval does not authorize production Worker changes, PayPal activity, deployment, or release publication. Preserve historical entitlements and recovery according to `SUPPORTER_AD_REMOVAL_MIGRATION.md`.
