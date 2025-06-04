#!/bin/bash

# Build script for libpcre-ts WebAssembly

set -e

echo "🏗️  Building libpcre-ts WebAssembly module..."

# Check if emsdk is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Emscripten not found. Please install and activate emsdk:"
    echo "   git clone https://github.com/emscripten-core/emsdk.git"
    echo "   cd emsdk && ./emsdk install latest && ./emsdk activate latest"
    echo "   source ./emsdk_env.sh"
    exit 1
fi

# Check if CMake is available
if ! command -v cmake &> /dev/null; then
    echo "❌ CMake not found. Please install CMake 3.20+"
    exit 1
fi


# Always run from project root, create build directory in root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."
cd "$ROOT_DIR"

echo "📁 Creating build directory..."
mkdir -p build
cd build

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
