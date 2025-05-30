#!/bin/bash

# Build script for libpcre-ts
# This script automates the entire build process for the PCRE WebAssembly module

set -e  # Exit on any error

echo "🔧 Building libpcre-ts WebAssembly module..."

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Error: Emscripten not found. Please install the Emscripten SDK first."
    echo "   Visit: https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

# Check if git submodules are initialized
if [ ! -f "libpcre/CMakeLists.txt" ]; then
    echo "📦 Initializing git submodules..."
    git submodule init
    git submodule update
fi

# Create build directory
echo "📁 Creating build directory..."
rm -rf build
mkdir build

# Configure with CMake
echo "⚙️  Configuring with CMake..."
cd build
emcmake cmake ..

# Build the libraries
echo "🔨 Building PCRE libraries..."
emmake make -j$(nproc)

# Go back to root directory
cd ..

# Compile to WebAssembly
echo "🌐 Compiling to WebAssembly..."
emcc -O2 -I build/libpcre -I libpcre \
  build/libpcre/libpcre.a build/libpcre/libpcreposix.a \
  wasm-wrapper.cpp -o build/libpcre.js \
  --bind -s MODULARIZE=1 -s EXPORT_NAME=PCRE \
  -s ENVIRONMENT=web,node -s ALLOW_MEMORY_GROWTH=1

# Verify the build
if [ -f "build/libpcre.js" ] && [ -f "build/libpcre.wasm" ]; then
    echo "✅ Build completed successfully!"
    echo "📄 Generated files:"
    echo "   - build/libpcre.js (JavaScript module)"
    echo "   - build/libpcre.wasm (WebAssembly binary)"
    echo ""
    echo "🚀 You can now use the PCRE library in your JavaScript/TypeScript projects!"
    echo "   Example: const PCRE = require('./build/libpcre.js');"
else
    echo "❌ Build failed! Check the output above for errors."
    exit 1
fi
