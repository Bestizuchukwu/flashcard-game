# Astera Studio Desktop Packaging

This project is configured for desktop packaging on Windows and macOS with Electron.

## Run the app in desktop mode

```bash
cd creative-studio
npm install
npm run desktop
```

## Build the packaged desktop app

On macOS:

```bash
cd creative-studio
npm run dist:mac
```

On Windows:

```bash
cd creative-studio
npm run dist:win
```

To build both Windows and macOS artifacts from a compatible machine:

```bash
cd creative-studio
npm run dist
```

## Notes
- The app is built with Next.js and wrapped in Electron.
- Production packaging starts the local Next.js server automatically and loads it in the desktop window.
- The output files are placed in the `dist` folder.
