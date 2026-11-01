# Release plan

## Current repository evidence

The supplied archive includes desktop GitHub release automation, quality workflows, release preflight, dependency assurance, checksums/SBOM tooling, and an Android publication guard. The main release workflow runs `scripts/check-android-publication.cjs --tracked-only`. The source policy says Android project/build/source files remain local and only compiled APKs may be attached to a separate Android GitHub Release.

The archive has no Git metadata or configured remote, so the current remote, branch, outgoing commits, ownership, and release permissions are unknown. No release workflow was run and no APK was built or signed in this audit.

## Android build policy

The owner confirmed on 2026-11-01: keep Android source local and use a locally signed APK with binary-only release assets. Do not disable the guard, add Android files to the permitted list, or create a workflow that uploads Android source.

## Safe binary-only path under current policy

1. Build Android locally from the authorized source tree using the pinned toolchain.
2. Sign with owner-controlled signing material kept outside the repository and protected by the local environment.
3. Verify APK package identity, version, signature, install/upgrade behavior, and SHA-256.
4. Run the publication guard against the exact repository state and all outgoing commits before any repository push. This source snapshot has no Git metadata, so the tracked-file check remains unverified here.
5. Publish only the reviewed compiled APK and checksum as assets in the separate Android release, after the owner confirms the target repository/tag and release authorization. No publication was authorized in this task.

## Hosted release

Hosted Android source builds are outside the current owner-approved policy. Revisit only if the owner explicitly changes it and the publication guard, policy data, workflows, and release process receive a reviewed update. Never commit keys/passwords.

## Release acceptance evidence to attach

- Toolchain versions, build command and result.
- APK package/version/ABI metadata and signature verification result.
- SHA-256 checksum.
- Static checks and E2E results with fixture-based vs real Telegram coverage distinguished.
- Device/OS matrix, install/upgrade and auth/transfer/media results.
- Publication guard result, verified remote/tag, and owner authorization.
