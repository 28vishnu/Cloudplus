# Cloud+ source merge report

This package was assembled from the two source archives supplied in this conversation:

- Official base: `Telegram-Drive-main(3).zip`
- User's Cloud+ fork: `Cloudplus-main.zip`

The user's Cloud+ fork contains the complete official repository file set, plus 28 modified common files and two Cloud+ handoff documents. This package uses the official archive as the base and overlays the user's fork files, preserving the Cloud+ modifications.

## Included Cloud+ changes

- Cloud+ product/window/page branding.
- Existing Tauri application identifier preserved as `com.cameronamer.telegramdrive`.
- Login flow no longer shows the post-login sponsor gateway.
- Sponsor placements and new supporter-purchase prompts are disabled through the shared visibility policy.
- Existing entitlement/recovery code is retained for compatibility.
- First-pass Liquid Glass styling and safe-area-aware mobile navigation.

## Important build status

This is a complete source-tree handoff, **not a verified Android release**.

The supplied official and Cloud+ archives both omit:
- `app/android-overrides/`
- `app/src-tauri/src/android_updates.rs`

The repository's own Android JNI contract checker requires Kotlin bridge classes, Gradle/R8 overrides, and Rust JNI calls. The repository's Android release runbook also documents a local-only Android release process. Therefore this package does not claim to generate a complete, fully functional Android APK as-is, and it intentionally does not include a workflow that skips native checks.

The first-pass Liquid Glass layer is not a complete redesign of every screen. Per-user private Telegram channel storage and upload-engine performance changes are also not implemented.

## Safe upload

Extract the contents of this package into a clean clone of `https://github.com/28vishnu/Cloudplus` (do not replace or delete the hidden `.git` directory). Review `git status` and `git diff` before committing. Never upload Telegram session data, API credentials, `.env` files, Android signing keys, passwords, or private certificates.
