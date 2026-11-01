# Astera Studio

Astera Studio is a premium Adobe-inspired creative studio app designed for layout, design, branding, and image work.

## Branding

- Product name: Astera Studio
- Publisher: Astera Labs
- App ID: com.astera.studio
- Version: 1.0.0
- Category: Graphics Design
- Bundle identity: premium dark studio, geometric A monogram, cyan-to-violet palette

## App icon direction

The app icon uses a dark graphite background with a geometric monogram “A” in a cyan-to-violet gradient. The design is intentionally simple, premium, and Adobe-like in tone without copying Adobe branding or proprietary assets.

## Installer naming convention

- Windows: `Astera-Studio-1.0.0-win-x64.exe`
- macOS: `Astera-Studio-1.0.0-mac-x64.dmg`
- Generic release pattern: `Astera-Studio-${version}-${platform}-${arch}`

## Versioning

Semantic versioning is recommended:

- 1.0.0 = stable release
- 1.1.0 = feature release
- 1.1.1 = hotfix
- 1.0.0-beta.1 = preview release

## Final release checklist

- [ ] Final app name and legal publisher info confirmed
- [ ] Icon set exported in PNG, ICO, and ICNS formats
- [ ] App window launches without runtime errors
- [ ] Text tool works
- [ ] Rectangle and circle tools work
- [ ] Image import works
- [ ] Export PNG works
- [ ] Splash screen appears cleanly
- [ ] Build runs in development mode
- [ ] Production build passes
- [ ] Windows installer builds successfully
- [ ] macOS installer builds successfully
- [ ] Public sign/notarize is completed if needed

## Local build commands

```bash
cd creative-studio
npm install
npm run build
npm run desktop
```

## Desktop packaging commands

Windows:

```bash
cd creative-studio
npm install
npm run dist:win
```

macOS:

```bash
cd creative-studio
npm install
npm run dist:mac
```

## Notes

This app is already configured with:
- premium dark UI styling
- Adobe-inspired layout hierarchy
- Electron desktop wrapper
- desktop packaging setup for Windows and macOS
- splash screen during startup

For public distribution, sign and notarize macOS builds and code-sign Windows packages.
