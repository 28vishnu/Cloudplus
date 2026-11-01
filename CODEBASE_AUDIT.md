# Codebase audit

Audit date: 2026-11-01. Scope: static inspection of the three supplied ZIP archives. No authenticated Telegram account, Android device, Git history, or configured remote was available during this audit. Source inspection is not runtime verification.

## Project identity and architecture

The supplied `Cloudplus-main.zip` was branded **Telegram Drive** (package metadata version 4.1.2) at intake. The local transformation now brands the app Cloudplus, removes advertising, and preserves the existing app identifier `com.cameronamer.telegramdrive` to avoid breaking app data and signing continuity. It is a Tauri 2 application with a React/TypeScript frontend, Rust backend, `grammers` MTProto client, SQLite-backed metadata, and platform-specific mobile UI. The mobile UI is React/Tauri, not a standalone Jetpack Compose Android app. The archive contains no Git metadata, so branch, history, remotes, and outgoing commits cannot be audited.

The supplied Telegram Drive archive has matching hashes for the README, package manifest, Cargo manifest, and core REST route module. These representative files match exactly; `App.tsx` differs, so the archives are not byte-for-byte identical. Cloudplus and Telegram Drive each contain 114 Rust source files and 204 TypeScript/TSX/CSS files in the inspected source trees. The “functional reference” is therefore closely related to the main project rather than an independent implementation for these sampled components.

BitChord is a separate Android multi-target Kotlin/Gradle project. Its Android app includes Compose UI. It is suitable for visual study only; its music domain, backend, and account flows do not map to Cloudplus.

## Telegram implementation found

- Rust backend uses `grammers` client/session/types crates pinned to a Git revision in `app/src-tauri/Cargo.toml`.
- Authentication and Telegram commands are grouped under `app/src-tauri/src/commands/`; credential and API-secret handling are separated into backend modules. The README documents local API ID/hash entry, phone login, login code, optional Telegram cloud password, and QR login.
- `api_catalog.rs` models Saved Messages and channel folders; `api_routes.rs` contains HTTP upload/download and file operations. Upload uses streaming file upload and sends a Telegram message; downloads use streamed iterators. Routes include folder selection and channel identifiers.
- Desktop uses durable transfer engines and queue behavior. Mobile UI exposes transfer queues and Android foreground-transfer/environment status. UI copy says some queues resume after reopening; that is not evidence of guaranteed OS-managed execution after process death.
- Frontend has distinct desktop and mobile dashboards, search, file browser, media viewers, settings, and transfer controls. The README describes image/video/document previews, archive tools, external file handling, and optional encryption.
- Channel support already exists as Telegram channel folders. The inspected code does not establish the pasted request's proposed separate multi-channel “storage destinations” product flow, invite-link onboarding, per-folder assignment, or a verified channel-post permission workflow for every channel type. These require dedicated tracing and end-to-end validation.

## Security and persistence observations

The source includes an encrypted TDENC2 file format and vault/session controls, account/session-scoped catalog logic, Android security code, secure API-secret storage code, signing/public-key handling, and extensive security documentation. The README states Android API hash storage uses Android Keystore and that legacy plaintext migration occurs only after secure migration succeeds. These are source-level observations, not proof of device-level security. Review `SECURITY.md`, `SUPPORTER_LICENSE_INVARIANTS.md`, and platform-specific credential paths before any change.

## Sponsorship and protected compatibility

At intake, source contained desktop/mobile advertising and a published $5 lifetime ad-free promise. The repository owner's explicit approval and migration plan were received on 2026-11-01. The local transformation removes advertising placements, network serving, and new purchase UI while retaining historical entitlement refresh, recovery, and pending-checkout resolution. No Worker, payment database, credential ID, token key, or entitlement policy was changed. The migration is documented in `SUPPORTER_AD_REMOVAL_MIGRATION.md`. Security warnings, licenses, privacy disclosures, and historical legal terms remain protected.

## Release and publication

The repository includes desktop release and quality workflows. They run the Android publication guard. The owner confirmed on 2026-11-01 that Android source must remain local and any Android release must use a locally signed APK and binary-only release asset. No source-publication rule or guard was changed. The local signing configuration, APK, and compatibility signature have not been verified.

## Audit limits

The source archives do not provide repository Git metadata. No API credentials, signing keys, Telegram test account/channel, Android device/emulator result, or configured Cloudplus GitHub remote were supplied. Runtime functionality, release signing, remote identity, and outgoing commits remain unverified. Project dependencies are not installed in the available environment, which may prevent build/E2E verification.
