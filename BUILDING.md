# Snow Desktop

Fresh implementation inspired by the desktop snowfall idea in Snowhush. No Snowhush source code or assets are included. This is not a malware audit or claim about that project.

## Run
Install Node.js 22 or newer, download this repository, then run `npm install` and `npm start` from its folder.

## Download builds
Open the repository's Actions tab, select a successful **Build desktop apps** run, and download the Windows or macOS artifact. Unzip it to find the Windows installer or Mac disk image. GitHub requires sign-in for artifact downloads. The workflow builds on both operating systems; native desktop testing is still required.

Use `npm run dist` on Windows to create an NSIS installer, or on macOS to create Intel and Apple Silicon DMGs. Output goes into `dist/`. These initial builds are unsigned. Windows SmartScreen or macOS Gatekeeper may warn until the publisher configures trusted signing and Apple notarization. Do not disable security tools. No auto-update or remote downloads run in the app.

## Features
- Transparent, click-through snowfall on every connected display.
- Tray/menu-bar controls, pause, clear, and explicit Quit.
- Flake count, speed, size, wind, color, opacity, and frame rate.
- Screen-edge accumulation with gradual melting and a fixed height cap.
- Settings stored in Electron's per-user application data folder as `settings.json`.
- Pauses animation during screen lock and system suspension.

This first version does not detect window edges, collect on windows, scatter from the cursor, hide from screenshots, or register at login. On macOS it appears across Spaces where the OS permits. Exclusive fullscreen applications may cover it. Electron uses more memory than Snowhush's native implementation; no performance numbers are claimed.

## Privacy and security
No analytics, account, ads, shell commands, startup registration, administrator request, accessibility access, screen recording, or file scanning. The app only reads and writes its own settings. Its session blocks network requests, uses sandboxed renderers with context isolation, and exposes narrowly scoped settings actions. Closing Settings leaves the tray app running; **Quit app** ends it.

## Test
`npm test` checks preference validation. Test installation, display scaling, monitor hotplug, Spaces, click-through behavior, lock/resume, and tray Quit on actual Windows and macOS computers before distributing a release. The Linux development environment cannot validate native desktop behavior.
