#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
swift build -c release --arch arm64 --arch x86_64
products="$(swift build -c release --arch arm64 --arch x86_64 --show-bin-path)"
app="build/Snow Desktop.app"
mkdir -p "$app/Contents/MacOS" "$app/Contents/Resources" dist
cp "$products/SnowDesktop" "$app/Contents/MacOS/"
cp Resources/Info.plist "$app/Contents/"
cp Resources/AppIcon.icns LICENSE "$app/Contents/Resources/"
codesign --force --deep --sign - "$app"
codesign --verify --deep --strict "$app"
mkdir -p build/dmg
cp -R "$app" build/dmg/
cp LICENSE build/dmg/
ln -s /Applications build/dmg/Applications
hdiutil create -volname "Snow Desktop" -srcfolder build/dmg -ov -format UDZO dist/Snow-Desktop-macOS-universal.dmg
