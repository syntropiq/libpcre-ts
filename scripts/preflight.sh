#!/bin/bash
set -e

# Preflight: Check and install build dependencies (git, cmake >= 3.16, emcc)

# Check for git
if ! command -v git &> /dev/null; then
  echo "❌ git is not installed. Installing..."
  sudo apt-get update && sudo apt-get install -y git
else
  echo "✅ git is installed."
fi

# Check for cmake >= 3.16
CMAKE_OK=false
if command -v cmake &> /dev/null; then
  CMAKE_VERSION=$(cmake --version | head -n1 | awk '{print $3}')
  CMAKE_MAJOR=$(echo $CMAKE_VERSION | cut -d. -f1)
  CMAKE_MINOR=$(echo $CMAKE_VERSION | cut -d. -f2)
  if [ "$CMAKE_MAJOR" -gt 3 ] || { [ "$CMAKE_MAJOR" -eq 3 ] && [ "$CMAKE_MINOR" -ge 16 ]; }; then
    CMAKE_OK=true
  fi
fi
if [ "$CMAKE_OK" = false ]; then
  echo "❌ cmake >= 3.16 is not installed. Installing latest cmake..."
  sudo apt-get update && sudo apt-get remove -y cmake || true
  sudo apt-get install -y wget tar
  TMP_CMAKE_DIR="/tmp/cmake3"
  sudo rm -rf "$TMP_CMAKE_DIR"
  mkdir -p "$TMP_CMAKE_DIR"
  wget -qO "$TMP_CMAKE_DIR/cmake.tar.gz" https://github.com/Kitware/CMake/releases/download/v3.29.3/cmake-3.29.3-linux-x86_64.tar.gz
  tar -xzf "$TMP_CMAKE_DIR/cmake.tar.gz" -C "$TMP_CMAKE_DIR"
  sudo cp -r "$TMP_CMAKE_DIR"/cmake-3.29.3-linux-x86_64/bin/* /usr/local/bin/
  sudo cp -r "$TMP_CMAKE_DIR"/cmake-3.29.3-linux-x86_64/share/* /usr/local/share/
  sudo cp -r "$TMP_CMAKE_DIR"/cmake-3.29.3-linux-x86_64/doc/* /usr/local/doc/ 2>/dev/null || true
  sudo cp -r "$TMP_CMAKE_DIR"/cmake-3.29.3-linux-x86_64/man/* /usr/local/man/ 2>/dev/null || true
  hash -r
else
  echo "✅ cmake >= 3.16 is installed."
fi

# Check for emcc (Emscripten)
if ! command -v emcc &> /dev/null; then
  echo "❌ emcc (Emscripten) is not installed. Installing emsdk..."
  git clone https://github.com/emscripten-core/emsdk.git "$HOME/emsdk" || true
  cd "$HOME/emsdk"
  ./emsdk install latest
  ./emsdk activate latest
  source ./emsdk_env.sh
  cd -
  if ! command -v emcc &> /dev/null; then
    echo "❌ emcc still not found after installation. Please check your environment."
    exit 1
  fi
else
  echo "✅ emcc is installed."
fi

echo "✅ Preflight check complete. All build dependencies are installed."
