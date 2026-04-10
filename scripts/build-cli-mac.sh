#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLI_DIR="$ROOT_DIR/vendor/CineIA_CLI"
BUILD_DIR="$CLI_DIR/build"
OUTPUT_DIR="$ROOT_DIR/bin/mac"

if [[ ! -d "$CLI_DIR" ]]; then
  echo "Missing vendor/CineIA_CLI submodule."
  echo "Run: git submodule update --init --recursive vendor/CineIA_CLI"
  exit 1
fi

# The upstream CLI depends on nested submodules for its third-party libraries.
git -C "$CLI_DIR" submodule update --init --recursive

cmake -S "$CLI_DIR" -B "$BUILD_DIR" -DCMAKE_BUILD_TYPE=Release
cmake --build "$BUILD_DIR" --config Release --parallel

SOURCE_BIN="$BUILD_DIR/cineia"
if [[ ! -f "$SOURCE_BIN" ]]; then
  SOURCE_BIN="$BUILD_DIR/Release/cineia"
fi

if [[ ! -f "$SOURCE_BIN" ]]; then
  echo "Built cineia binary not found."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
cp "$SOURCE_BIN" "$OUTPUT_DIR/cineia"
chmod +x "$OUTPUT_DIR/cineia"

echo "Updated $OUTPUT_DIR/cineia"
