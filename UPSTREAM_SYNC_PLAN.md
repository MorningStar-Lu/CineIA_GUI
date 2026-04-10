# CineIA GUI Upstream Sync Guide

## 这份文档是干什么的

这个仓库不是上游 `izwb003/CineIA_CLI` 的源码镜像，而是一个 **Electron GUI**。

GUI 本身负责：

- 选择输入输出文件
- 组织参数
- 调用 `cineia` 可执行文件

真正做 IAB 转换的是上游 CLI。  
所以以后“同步上游”，正确的对象不是当前 GUI 分支本身，而是仓库里的上游 CLI 依赖。

## 当前仓库结构

当前已经按这个方向整理到了第一阶段：

```text
testCinelA_GUI/
├─ vendor/
│  └─ CineIA_CLI/        # 上游 CLI，作为 submodule 接入
├─ scripts/
│  └─ build-cli-mac.sh   # 重新构建 macOS CLI 并复制到 bin/mac
├─ bin/
│  └─ mac/
│     └─ cineia          # GUI 当前使用的 macOS CLI 二进制
├─ .gitmodules
├─ package.json
├─ main.js
├─ preload.js
├─ renderer.js
└─ index.html
```

## 现在应该怎么理解“同步上游”

以后不要再把这个 GUI 仓库当成普通 fork 去点 GitHub 的 `Sync fork`。

原因很简单：

- GitHub 比较的是“GUI 分支”和“CLI 上游分支”
- 这两个仓库的职责已经不同
- 直接 sync 会把 GUI 改动和 CLI 源码历史硬拧在一起

这里正确的更新方式是：

1. 更新 `vendor/CineIA_CLI`
2. 重新构建 `bin/mac/cineia`
3. 测试 GUI 是否还能正常调用新的 CLI

## 已经落地的第一阶段改动

这次已经做了这几件事：

1. 删除了原来错误的 `CineIA_CLI_Source` gitlink
2. 把上游 CLI 正式接到了 `vendor/CineIA_CLI`
3. 生成了根目录的 `.gitmodules`
4. 新增了 `scripts/build-cli-mac.sh`
5. 在 `package.json` 里增加了：

```sh
npm run build:cli:mac
```

这个命令会：

1. 初始化 `vendor/CineIA_CLI` 内部依赖
2. 用 CMake 构建上游 CLI
3. 把生成的二进制复制到 `bin/mac/cineia`

## 日常使用

### 第一次拉仓库

推荐：

```sh
git clone --recursive <your-gui-repo-url>
```

如果已经 clone 过但 submodule 没下来：

```sh
git submodule update --init --recursive
```

## 更新上游 CLI 的标准流程

### 1. 拉取上游最新提交

```sh
git -C vendor/CineIA_CLI fetch origin
```

### 2. 切到你要跟进的提交或标签

例如：

```sh
git -C vendor/CineIA_CLI checkout <commit-or-tag>
```

如果只是想跟到上游主分支当前最新：

```sh
git -C vendor/CineIA_CLI checkout origin/main
```

注意：

- 如果直接 checkout `origin/main`，会处于 detached HEAD
- 这对 submodule 来说是正常的，不是错误

### 3. 回到 GUI 根目录记录 submodule 指针变化

```sh
git add vendor/CineIA_CLI
```

### 4. 重新构建 GUI 内置 CLI

```sh
npm run build:cli:mac
```

### 5. 做最小验证

至少确认这两件事：

```sh
bin/mac/cineia -h
npm start
```

### 6. 提交这次升级

提交信息建议保持清晰，例如：

```text
chore(cli): bump vendor/CineIA_CLI to <short-sha>
```

## 这个仓库里什么该改，什么不该改

### 应该改的

- `vendor/CineIA_CLI` 的 submodule 指针
- `bin/mac/cineia`
- GUI 代码里和 CLI 参数对接有关的部分
- 构建脚本

### 不应该做的

- 不要直接把上游 CLI 源码 merge 进 GUI 主分支
- 不要再恢复 `CineIA_CLI_Source` 这种不完整 gitlink
- 不要用 GitHub `Sync fork` 来处理 GUI 与 CLI 的关系

## 当前已知限制

当前只补了 macOS 这一条构建链：

- 已有：`scripts/build-cli-mac.sh`
- 还没有：Windows 构建脚本
- 还没有：CI 自动构建和自动验证

所以现在这套结构已经适合继续维护，但还没有完全自动化。

## 下一步最合理的工作

如果继续往下做，建议顺序是：

1. 跑通一次 `npm run build:cli:mac`
2. 确认新的 `bin/mac/cineia` 能被 GUI 正常调用
3. 再补 `scripts/build-cli-win.ps1`
4. 最后再考虑 CI

## 一句话总结

这个仓库以后同步上游的正确方式不是“同步 GUI 分支”，而是：

**更新 `vendor/CineIA_CLI` -> 重建 `bin/mac/cineia` -> 验证 GUI。**
