# Cloud+ — upload and build notes

## Upload this source to your GitHub repository

If you already have the repository cloned on your PC, copy the contents of this archive into that working tree (do not nest the `Telegram-Drive-main` folder inside another folder). Then, from the repository root:

```powershell
git status
git add .
git commit -m "Rebrand Telegram Drive as Cloud+"
git push origin main
```

If you are starting with a new GitHub repository:

```powershell
git init
git add .
git commit -m "Cloud+ source baseline"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository URL. Never commit Telegram session files, API hashes, `.env` files, keystores, signing passwords or private keys.

## Frontend check

From the `app` directory:

```powershell
npm ci
npm run build
```

## Android APK status

This archive does not include a GitHub Actions APK workflow because the original source tree is missing required Android native bridge sources (`app/android-overrides/` and `app/src-tauri/src/android_updates.rs`). The repository's own JNI contract checker requires them. A successful Vite build is only a frontend build; it is not an Android APK.

The original `Docs/ANDROID_SIDELOAD_RELEASE.md` also states that Android builds are currently local-only and that Android project sources are intentionally not committed. The Android SDK setup failure (`Failed to find package 'tools'`) can be corrected by using `android-actions/setup-android@v4`, but that alone does not restore the missing native code.

Do not skip the JNI contract checks or create empty Kotlin/Rust placeholders. That could yield a broken APK. Obtain the matching native override source bundle and the matching `android_updates.rs` implementation first. After those are restored and tested, a GitHub Actions workflow can safely run `npm run tauri -- android build` and upload the generated APK artifact.

## Cloud+ features in this handoff

The supplied source has been rebranded and given a first-pass Liquid Glass visual layer. The post-login sponsor gateway is removed, sponsor visibility and new purchase prompts are disabled, and existing entitlement/recovery data code is retained for compatibility.

The private per-user Telegram channel storage model, Google Photos-style gallery redesign, upload-speed engine changes, and complete native Android acceptance testing are not yet implemented. See `CLOUDPLUS_REBUILD_STATUS.md` for the exact scope and remaining engineering inputs.
