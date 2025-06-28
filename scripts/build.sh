#!/bin/bash

# Build script for libpcre-ts WebAssembly

set -e

echo "🏗️  Building libpcre-ts WebAssembly module..."

# Always run from project root, create build directory in root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."
cd "$ROOT_DIR"

# Initialize submodules before anything else
"$ROOT_DIR/scripts/init-submodules.sh"

echo "📁 Creating build directory..."
mkdir -p build
cd build

# Ensure output_test directory exists for artifact copy
mkdir -p output_test

# Check if emsdk is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Emscripten not found. Running preflight to install dependencies..."
    "$ROOT_DIR/scripts/preflight.sh"
    if ! command -v emcc &> /dev/null; then
        echo "❌ Emscripten still not found after preflight. Aborting."
        exit 1
    fi
fi

# Check if CMake is available
if ! command -v cmake &> /dev/null; then
    echo "❌ CMake not found. Running preflight to install dependencies..."
    "$ROOT_DIR/scripts/preflight.sh"
    if ! command -v cmake &> /dev/null; then
        echo "❌ CMake still not found after preflight. Aborting."
        exit 1
    fi
fi

# Configure with CMake (ESM)
echo "⚙️  Configuring with CMake (ESM)..."
emcmake cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
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

# Build the project (ESM)
echo "🔨 Building WebAssembly module (ESM)..."
emmake make -j$(nproc 2>/dev/null || echo 4)

# Configure with CMake (CJS)
echo "⚙️  Configuring with CMake (CJS)..."
EXPORT_CJS=1 emcmake cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
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

# Build the project (CJS)
echo "🔨 Building WebAssembly module (CJS)..."
emmake make -j$(nproc 2>/dev/null || echo 4)

cd "$ROOT_DIR"

# Build ESM and CJS TypeScript outputs
npm run build:esm
npm run build:cjs

echo "📦 Creating CJS package.json..."
echo '{"type": "commonjs"}' > dist/cjs/package.json

# Copy WASM output to both ESM and CJS dist directories
echo "📝 Preparing distribution files..."
cp build/libpcre-npm.js dist/esm/libpcre-npm.js
cp build/libpcre-npm.cjs dist/cjs/libpcre-npm.js

# Check if the build was successful
if [ -f "dist/cjs/libpcre-npm.js" ]; then
    echo "✅ WebAssembly build successful!"
    echo "📦 Generated files:"
    ls ./dist/ -R
    
    echo "🎉 Build complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Test with: npm test"
    echo "  2. Publish with: npm publish"
else
    echo "❌ Build failed - output files not found"
    exit 1
fi
