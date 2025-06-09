#!/bin/bash
set -e
echo "ℹ️ Initializing libpcre submodule..."
git submodule update --init --recursive

if [ ! -f "libpcre/CMakeLists.txt" ]; then # Check for a key file
  echo "❌ ERROR: libpcre submodule not properly initialized or key files are missing. Please check your git repository and submodule status."
  exit 1
fi

echo "✅ Submodules successfully initialized."
