# Snow Desktop 0.2 — native edition

The downloadable native build implements snow settling onto visible app window tops and the macOS Dock, sliding and scattering from moved windows, falling when windows close/minimize, and cursor sweeping. Native Metal on macOS and DirectComposition/Direct3D on Windows replace the Electron renderer in distributed native builds.

## Download and use
In GitHub Actions, open **Native Snow Desktop**, select a successful run, and download the artifact for your OS.

- **Mac:** macOS 14+, universal Intel/Apple Silicon DMG. Drag Snow Desktop to Applications, open it, then use the snowflake in the top menu bar. This is a menu-bar utility with no permanent Dock icon.
- **Windows:** Windows 10/11 x64. Run `SnowDesktop-Setup.exe`, or run the portable `SnowDesktop.exe`. Use the snowflake in the system tray near the clock (possibly inside the hidden-icons arrow).
- Enable **Accumulate** and **Snow on Windows**. Use **Steady** or **Heavy** snowfall. The first-run welcome holds some snow for you to scatter.
- **Behind Windows** puts the effect behind application windows; leave it off when you want snow visible on top of their edges. **Behind Taskbar** on Windows places the ground under the taskbar; it is visible there only with a transparent taskbar. The app does not modify taskbar transparency.
- Use **Clear Snow**, **Off**, or **Quit** from the menu. **Open at Login** is opt-in.

The effect necessarily uses transparent click-through rendering surfaces. Unlike the old full-screen particle prototype, the native version tracks real window geometry and desktop layering. Exclusive fullscreen and OS-specific window behavior still need hands-on testing.

## Origin and changes
Adapted from [Snowhush](https://github.com/mbezruchko/Snowhush), commit `20261048b09f67d30dd07924ee115ca4d8a6252f`, by Mykhailo Bezruchko. Original MIT license retained in LICENSE and included with built packages. This is a fork, not an independent reimplementation or an endorsement by the original author.

Snow Desktop uses separate bundle identifiers, registry settings, installation folders, and process names. Sparkle and Windows HTTP update code are excluded/replaced with offline implementations. No automatic relocation or quarantine removal. Seasonal effects are off by default. Snow is visible in screenshots by default; exclusion remains an explicit menu option. No analytics/account services have been added.

Window tracking reads window geometry and pointer position. Wallpaper colors are sampled from local wallpaper files for lighting. Settings and logs are local. Open at Login changes the current user's login configuration only when selected. The Windows installer registers an uninstaller and shortcut for the current user; it does not request administrator rights.

Builds are ad-hoc signed on Mac and unsigned on Windows, not notarized or publisher-certified. This source review is not an independent malware certification. Some native macOS window behavior uses undocumented system APIs inherited from upstream and may change with OS updates.

## Build and validation
`bash native/build-mac.sh` builds the universal Mac DMG. The native workflow builds the Windows executable and installer with Cargo. `cargo test --locked --manifest-path native/core/Cargo.toml` exercises accumulation, closing and dragging windows, sweeping, and simulation stability. Both OS builds must pass before downloading; actual desktop behavior requires device testing.

The original Electron files remain available as a prototype but are not used by this native workflow. Do not use the older **Build desktop apps** artifacts for window-aware snow.
