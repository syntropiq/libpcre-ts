#!/bin/bash

# Build script for libpcre-ts WebAssembly (Cloudflare Worker target)

set -e

# Check for Emscripten
if ! command -v emcc &> /dev/null; then
    echo "❌ Emscripten not found. Please install and activate emsdk."
    exit 1
fi

# Check for CMake
if ! command -v cmake &> /dev/null; then
    echo "❌ CMake not found. Please install CMake 3.20+"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."
cd "$ROOT_DIR"

mkdir -p build
cd build

echo "⚙️  Configuring with CMake for Cloudflare Worker..."
emcmake cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DTARGET_CLOUDFLARE=ON \
    -DPCRE_BUILD_PCRE8=ON \
    -DPCRE_BUILD_PCRE16=ON \
    -DPCRE_BUILD_PCRE32=ON \
    -DPCRE_BUILD_PCRECPP=OFF \
    -DPCRE_SUPPORT_UTF=ON \
    -DPCRE_SUPPORT_UNICODE_PROPERTIES=ON \
    -DPCRE_SUPPORT_JIT=OFF \
    -DPCRE_BUILD_PCREGREP=OFF \
    -DPCRE_BUILD_TESTS=OFF \
    -DPCRE_SHOW_REPORT=OFF \
    -DBUILD_SHARED_LIBS=OFF

echo "🔨 Building WebAssembly module for Cloudflare..."
emmake make -j$(nproc 2>/dev/null || echo 4)

cd "$ROOT_DIR"

if [ -f "build/libpcre-cf.js" ] && [ -f "build/libpcre-cf.wasm" ]; then
    echo "✅ Cloudflare WebAssembly build successful!"
    mkdir -p dist
    cp build/libpcre-cf.js dist/
    cp build/libpcre-cf.wasm dist/
    echo "🎉 Cloudflare build complete!"
else
    echo "❌ Cloudflare build failed - output files not found"
    exit 1
fi
