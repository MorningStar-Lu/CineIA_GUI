# CineIA GUI

A cross-platform desktop GUI for [CineIA CLI](https://github.com/izwb003/CineIA_CLI) — converting IMF IAB (.mxf) to DCP IAB (.mxf).

![License](https://img.shields.io/badge/license-MIT-blue)
![Electron](https://img.shields.io/badge/Electron-40-47848F?logo=electron)

[简体中文](/README.CN.md)

## Features

- **Drag & Drop** — drag `.mxf` files directly into the input field
- **Real-time Progress** — frame-by-frame progress bar with ETA
- **Bilingual UI** — Chinese / English, switchable at runtime
- **Cancel Support** — stop conversion at any time
- **Custom CLI Path** — configure the CineIA binary location in Settings
- **Dark Theme** — macOS-native look with backdrop blur and glow effects

## Download

Download the latest `.dmg` (macOS) or `.exe` (Windows) from [Releases](https://github.com/MorningStar-Lu/CineIA_GUI/releases).

## Development

### Prerequisites

- Node.js >= 18
- CineIA CLI binary (build from [CineIA_CLI_Source](./CineIA_CLI_Source/) or download)

### Setup

```bash
git clone --recursive https://github.com/MorningStar-Lu/CineIA_GUI.git
cd CineIA_GUI
npm install
```

### Run

```bash
npm start
```

### Build

```bash
# macOS
npm run dist

# Windows
npm run dist
```

Output is in the `dist/` directory.

### Build CineIA CLI (from source)

```bash
cd CineIA_CLI_Source
mkdir build && cd build
cmake ..
make -j$(nproc)
```

The binary will be at `build/bin/cineia`. Place it in `bin/mac/` or `bin/win/` for the GUI to find automatically.

## Project Structure

```
CineIA_GUI/
├── main.js              # Electron main process
├── preload.js           # Secure IPC bridge
├── renderer.js          # UI logic (progress, i18n, drag-drop)
├── index.html           # App layout
├── styles.css           # Dark theme styles
├── package.json         # Electron + electron-builder config
├── bin/                 # Bundled CLI binaries
│   ├── mac/
│   └── win/
└── CineIA_CLI_Source/   # C++ CLI source (submodule)
    ├── cineia.cpp       # Core conversion logic
    ├── cineia.h
    ├── main.cpp         # CLI entry point
    └── CMakeLists.txt
```

## Security

- `contextIsolation: true` — renderer cannot access Node.js APIs
- `nodeIntegration: false` — no direct require() in renderer
- `Content-Security-Policy` — restricts script/style sources
- Minimal API surface via `preload.js` (selectFile, runCineia, cancelCineia)

## License

[MIT License](./CineIA_CLI_Source/LICENSE) — Copyright (c) 2026 IZWB-003

## Acknowledgements

- [IABLib](https://github.com/DTSProAudio/iab-renderer) — IAB parsing/packing
- [asdcplib](https://github.com/cinecert/asdcplib) — MXF read/write
- [indicators](https://github.com/p-ranav/indicators) — CLI progress bar
