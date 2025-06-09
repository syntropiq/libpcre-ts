#!/bin/bash
set -e

# Preflight: Check and install build dependencies (git, cmake, emcc)

# Check for git
if ! command -v git &> /dev/null; then
  echo "❌ git is not installed. Installing..."
  sudo apt-get update && sudo apt-get install -y git
else
  echo "✅ git is installed."
fi

# Check for cmake
if ! command -v cmake &> /dev/null; then
  echo "❌ cmake is not installed. Installing..."
  sudo apt-get update && sudo apt-get install -y cmake
else
  echo "✅ cmake is installed."
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
