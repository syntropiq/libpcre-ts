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

# Configure with CMake
echo "⚙️  Configuring with CMake..."
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

# Build the project
echo "🔨 Building WebAssembly module..."
emmake make -j$(nproc 2>/dev/null || echo 4)

cd "$ROOT_DIR"

# Copy WASM output to both ESM and CJS dist directories
mkdir -p dist/esm dist/cjs
cp build/libpcre-npm.js dist/esm/
cp build/libpcre-npm.js dist/cjs/

# Make WASM JS available to Vite (copy to src/ before Vite build)
cp build/libpcre-npm.js src/libpcre-npm.js

# Build ESM and CJS TypeScript outputs
npx tsc -p tsconfig.esm.json
npx tsc -p tsconfig.cjs.json

# Run Vite for production bundling (tree-shaking, minification, etc.)
npx vite build

# Clean up the copied WASM JS from src/ after Vite build
rm -f src/libpcre-npm.js

# Check if the build was successful
if [ -f "build/libpcre-npm.js" ]; then
    echo "✅ WebAssembly build successful!"
    echo "📦 Generated files:"
    echo "   - build/libpcre-npm.js (single file with embedded WASM)"
    
    # Create dist directory and copy distribution files
    echo "📝 Preparing distribution files..."
    mkdir -p dist
    
    # Copy WASM artifacts
    cp build/libpcre-npm.js dist/
    
    # Generate TypeScript definitions and copy JS wrapper
    node scripts/generate-types.js
    
    echo "🎉 Build complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Test with: npm test"
    echo "  2. Publish with: npm publish"
else
    echo "❌ Build failed - output files not found"
    exit 1
fi
