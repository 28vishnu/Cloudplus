# Cloud+ rebuild status (source handoff)

This archive is a conservative Cloud+ adaptation of the supplied Telegram Drive source. It is **not** represented as a fully completed or device-certified replacement.

## Changes in this handoff
- Rebranded the Tauri product/window title and page title to Cloud+.
- Updated the common app title in the shipped locale catalogues.
- Removed the post-login sponsor gateway: successful Telegram session restoration and login now open the app directly.
- Disabled sponsor ad placements and new supporter-purchase prompts through the shared visibility policy. Existing entitlement and recovery code is retained for compatibility; no existing activation data is intentionally deleted.
- Added a progressive iOS-style Liquid Glass visual layer with readable frosted surfaces, stronger blur/saturation, safe-area-aware compact mobile navigation, light/dark variants, and reduced-motion/accessibility fallbacks.
- Preserved the existing Tauri bundle identifier `com.cameronamer.telegramdrive` so this rebrand does not silently change Android app identity.

## Important gaps that remain
1. **Private per-user Telegram channel storage is not implemented.** The original application uses its existing Telegram folder/message storage model. This archive does not create a `Cloud+ Private` channel per account, migrate old Saved Messages files, or route all transfers to such a channel. Do not treat it as completed.
2. **The supplied source archive does not contain the Android native override sources required by its own build checks.** `app/android-overrides/` is absent. The project script `app/scripts/check-android-jni-contract.cjs` requires custom Kotlin bridges, Gradle overrides and R8 rules. It also expects `app/src-tauri/src/android_updates.rs`, which is absent. The checked-in Android release runbook says Android builds are currently local-only and Android project sources are intentionally excluded from GitHub.
3. A GitHub Actions workflow cannot produce a reliable functional APK from this source alone. Updating `android-actions/setup-android` from v3 to v4 fixes the obsolete SDK `tools` package error, but does not supply the missing native code. A workflow that skips those checks could create an APK with broken JNI/native features, so this handoff does not pretend that it is a valid APK pipeline.
4. The Liquid Glass work is a visual enhancement to the existing React interface, not a complete redesign of every screen. Real-device visual/accessibility testing is still required.
5. Upload concurrency/chunking/resume behavior has not been changed or benchmarked. No upload-speed claim is made.

## Verification performed for this handoff
- ZIP integrity of the original user-provided archive was checked before editing.
- Modified JSON locale and Tauri configuration files were parsed after editing.
- Static checks confirmed the login sponsor gateway references were removed and the sponsor visibility policy now returns false.
- No Android build, Telegram account sign-in, Telegram upload/download, media playback, or physical-device acceptance test was run in this environment.

## Required next engineering inputs
To finish a GitHub Actions APK pipeline safely, the maintainer must provide the missing Android native override bundle and the matching `android_updates.rs` implementation (or authorize a reviewed reconstruction of those native bridges from the complete upstream source). To implement per-user private channels, the storage layer must be redesigned around channel creation, persisted per-account channel IDs, permissions, retries, migration and recovery; this needs Telegram integration testing with a real test account.
