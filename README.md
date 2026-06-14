# CineIA GUI

[English](#english) | [简体中文](#简体中文)

![License](https://img.shields.io/badge/license-MIT-blue)
![Electron](https://img.shields.io/badge/Electron-40-47848F?logo=electron)

A cross-platform desktop GUI for [CineIA CLI](https://github.com/izwb003/CineIA_CLI) — converting IMF IAB (.mxf) to DCP IAB (.mxf).

---

<a id="english"></a>

## English

### Features

- **Drag & Drop** — drag `.mxf` files directly into the input field
- **Real-time Progress** — frame-by-frame progress bar with ETA
- **Bilingual UI** — Chinese / English, switchable at runtime
- **Cancel Support** — stop conversion at any time
- **Custom CLI Path** — configure the CineIA binary location in Settings
- **Dark Theme** — macOS-native look with backdrop blur and glow effects

### Download

Download the latest `.dmg` (macOS) or `.exe` (Windows) from [Releases](https://github.com/MorningStar-Lu/CineIA_GUI/releases).

### Development

#### Prerequisites

- Node.js >= 18
- CineIA CLI binary (build from [CineIA_CLI_Source](./CineIA_CLI_Source/) or download)

#### Setup

```bash
git clone --recursive https://github.com/MorningStar-Lu/CineIA_GUI.git
cd CineIA_GUI
npm install
```

#### Run

```bash
npm start
```

#### Build

```bash
npm run dist
```

Output is in the `dist/` directory.

#### Build CineIA CLI (from source)

```bash
cd CineIA_CLI_Source
mkdir build && cd build
cmake ..
make -j$(nproc)
```

The binary will be at `build/bin/cineia`. Place it in `bin/mac/` or `bin/win/` for the GUI to find automatically.

### Project Structure

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

### Security

- `contextIsolation: true` — renderer cannot access Node.js APIs
- `nodeIntegration: false` — no direct require() in renderer
- `Content-Security-Policy` — restricts script/style sources
- Minimal API surface via `preload.js` (selectFile, runCineia, cancelCineia)

### License

[MIT License](./CineIA_CLI_Source/LICENSE) — Copyright (c) 2026 IZWB-003

### Acknowledgements

- [IABLib](https://github.com/DTSProAudio/iab-renderer) — IAB parsing/packing
- [asdcplib](https://github.com/cinecert/asdcplib) — MXF read/write
- [indicators](https://github.com/p-ranav/indicators) — CLI progress bar

---

<a id="简体中文"></a>

## 简体中文

基于 [CineIA CLI](https://github.com/izwb003/CineIA_CLI) 的跨平台桌面 GUI — 将 IMF IAB (.mxf) 转换为 DCP IAB (.mxf)。

### 功能特性

- **拖放支持** — 直接将 `.mxf` 文件拖入输入框
- **实时进度** — 逐帧进度条 + 预计剩余时间
- **中英双语** — 运行时一键切换
- **取消转换** — 随时停止任务
- **自定义 CLI 路径** — 在设置中配置 CineIA 二进制文件位置
- **暗色主题** — macOS 原生风格，毛玻璃 + 光晕效果

### 下载

从 [Releases](https://github.com/MorningStar-Lu/CineIA_GUI/releases) 下载最新 `.dmg`（macOS）或 `.exe`（Windows）。

### 开发

#### 环境要求

- Node.js >= 18
- CineIA CLI 二进制文件（从 [CineIA_CLI_Source](./CineIA_CLI_Source/) 编译或下载）

#### 安装

```bash
git clone --recursive https://github.com/MorningStar-Lu/CineIA_GUI.git
cd CineIA_GUI
npm install
```

#### 运行

```bash
npm start
```

#### 打包

```bash
npm run dist
```

输出在 `dist/` 目录。

#### 编译 CineIA CLI（从源码）

```bash
cd CineIA_CLI_Source
mkdir build && cd build
cmake ..
make -j$(nproc)
```

编译产物在 `build/bin/cineia`。将其放到 `bin/mac/` 或 `bin/win/` 目录下，GUI 会自动识别。

### 项目结构

```
CineIA_GUI/
├── main.js              # Electron 主进程
├── preload.js           # 安全 IPC 桥接
├── renderer.js          # UI 逻辑（进度、i18n、拖放）
├── index.html           # 应用布局
├── styles.css           # 暗色主题样式
├── package.json         # Electron + electron-builder 配置
├── bin/                 # 内置 CLI 二进制
│   ├── mac/
│   └── win/
└── CineIA_CLI_Source/   # C++ CLI 源码（子模块）
    ├── cineia.cpp       # 核心转换逻辑
    ├── cineia.h
    ├── main.cpp         # CLI 入口
    └── CMakeLists.txt
```

### 安全

- `contextIsolation: true` — 渲染进程无法访问 Node.js API
- `nodeIntegration: false` — 渲染进程不可直接 require()
- `Content-Security-Policy` — 限制脚本/样式来源
- 最小 API 暴露面 — `preload.js` 仅暴露 selectFile、runCineia、cancelCineia

### 许可证

[MIT License](./CineIA_CLI_Source/LICENSE) — Copyright (c) 2026 IZWB-003

### 致谢

- [IABLib](https://github.com/DTSProAudio/iab-renderer) — IAB 解析/封装
- [asdcplib](https://github.com/cinecert/asdcplib) — MXF 读写
- [indicators](https://github.com/p-ranav/indicators) — CLI 进度条
