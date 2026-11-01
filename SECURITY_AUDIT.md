# Security audit

Audit date: 2026-11-01. Static inspection only; this is not a penetration test, Android device review, or secret scan.

## Existing protections observed

- Rust backend handles Telegram and transfer operations; API credentials are not intended to be bundled as shared secrets. README instructs each user to supply a Telegram API ID/hash locally.
- Source includes a platform API-secret module and Android security module. README describes Android Keystore use and secure migration of legacy API hashes.
- Telegram session, encryption vault, transfer/catalog state, and account-specific paths have dedicated backend code. The catalog includes session/account scoping.
- TDENC2 uses streaming authenticated encryption components and vault/session controls. Encryption is opt-in and does not change Telegram's visibility of transport metadata.
- Upload/download route code uses streaming paths, Telegram size checks, and download verification/temporary-file handling in documented flows.
- GitHub workflow and scripts include dependency/security assurance, release preflight, checksums/SBOM/provenance, and Android-publication guards.
- `AGENTS.md` requires E2E-only behavioral coverage, preserves security and account isolation, and prohibits publishing Android source.

## Risks / follow-up

1. No automated secret scan was run; archives contain a public signing-key file but no private key should be distributed. Run the repository's approved checks against the intended final source and inspect all archive members.
2. No Android device audit confirmed Keystore-backed secret handling, backup exclusions, lock-screen behavior, secure temporary-file cleanup, or process-death recovery.
3. No real Telegram login/upload/download/channel operation was executed. Invite links, permissions, rate limits, and private-channel access need authorized-account tests.
4. The local REST/WebDAV surfaces need deployment/runtime binding, origin, authentication, and port exposure review before any product changes; README says these are local application services and capability links must remain protected.
5. Supporter signing, recovery tokens, credential identifiers, and existing purchaser compatibility remain protected. Sponsor removal was explicitly approved with a migration plan; preserve the Worker, signing keys, token format, credentials, entitlements, recovery, and device limit.
6. Android source publication guard has pending-owner-review entries. The owner directed Android source to remain local; pending entries are not approval. Preserve the guard and use a locally signed APK with binary-only release assets.
7. The former Telegram Drive update endpoints were removed to prevent a rebranded app from consuming an unrelated product feed. Update checks are intentionally disabled until an authorized Cloudplus HTTPS endpoint and corresponding signing configuration are supplied.

## Required security gates before release

- Run `node scripts/check-app-security.cjs`, dependency assurance, Rust advisory checks, npm audit policy, workflow pin checks, and release preflight as defined by the repository.
- Run `node scripts/check-android-publication.cjs` for every proposed push and inspect every outgoing commit.
- Run the E2E suites mandated by `AGENTS.md` and `TESTING.md`; perform authorized real-device Telegram and Android acceptance separately.
- Verify signing identity and APK signature without exposing keystore or passwords; calculate and publish SHA-256 only for reviewed release binaries.
