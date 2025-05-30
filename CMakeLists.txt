cmake_minimum_required(VERSION 3.20)
project(libpcre-wasm)

# Set Emscripten as the target
if(NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    set(CMAKE_TOOLCHAIN_FILE "$ENV{EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake")
endif()

# Enable all PCRE features we need
set(PCRE_BUILD_PCRE8 ON CACHE BOOL "Build 8-bit PCRE library")
set(PCRE_BUILD_PCRE16 ON CACHE BOOL "Build 16-bit PCRE library") 
set(PCRE_BUILD_PCRE32 ON CACHE BOOL "Build 32-bit PCRE library")
set(PCRE_BUILD_PCRECPP OFF CACHE BOOL "Disable C++ library for WebAssembly")
set(PCRE_SUPPORT_UTF ON CACHE BOOL "Enable UTF support")
set(PCRE_SUPPORT_UNICODE_PROPERTIES ON CACHE BOOL "Enable Unicode properties")
set(PCRE_SUPPORT_JIT OFF CACHE BOOL "Disable JIT for WebAssembly")
set(PCRE_SUPPORT_PCREGREP_JIT OFF CACHE BOOL "Disable JIT for pcregrep")
set(PCRE_BUILD_PCREGREP OFF CACHE BOOL "Don't build pcregrep for WASM")
set(PCRE_BUILD_TESTS OFF CACHE BOOL "Don't build tests for WASM")
set(PCRE_SHOW_REPORT OFF CACHE BOOL "Don't show build report")
set(BUILD_SHARED_LIBS OFF CACHE BOOL "Build static libraries for WASM")

# Disable optional dependencies that cause warnings
set(PCRE_SUPPORT_LIBBZ2 OFF CACHE BOOL "Disable BZip2 support for WebAssembly")
set(PCRE_SUPPORT_LIBZ OFF CACHE BOOL "Disable ZLIB support for WebAssembly") 
set(PCRE_SUPPORT_LIBREADLINE OFF CACHE BOOL "Disable Readline support for WebAssembly")
set(PCRE_SUPPORT_LIBEDIT OFF CACHE BOOL "Disable Editline support for WebAssembly")

# Add the libpcre subdirectory
add_subdirectory(libpcre)

# Create a wrapper library that combines all PCRE libraries
add_library(pcre-combined STATIC
    # We'll add our wrapper source files here
    wasm-wrapper.cpp
)

# Link all PCRE libraries into our combined library
target_link_libraries(pcre-combined 
    pcre 
    pcreposix
    pcre16
    pcre32
)

# Set up Emscripten-specific options
set(EMSCRIPTEN_LINK_FLAGS
    "-s EXPORT_ES6=1"
    "-s MODULARIZE=1" 
    "-s USE_ES6_IMPORT_META=0"
    "-s ENVIRONMENT=web,webview,worker,node"
    "-s ALLOW_MEMORY_GROWTH=1"
    "-s INITIAL_MEMORY=16MB"
    "-s MAXIMUM_MEMORY=2GB"
    "-s STACK_SIZE=1MB"
    "-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','getValue','setValue','UTF8ToString','stringToUTF8','allocate','ALLOC_NORMAL']"
    "-s EXPORTED_FUNCTIONS=['_malloc','_free']"
    "--bind"
)

# Set target properties for the WASM output
set_target_properties(pcre-combined PROPERTIES
    LINK_FLAGS "${EMSCRIPTEN_LINK_FLAGS}"
    OUTPUT_NAME "libpcre"
    SUFFIX ".js"
)

# Include directories for our wrapper
target_include_directories(pcre-combined PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/libpcre
    ${CMAKE_CURRENT_BINARY_DIR}/libpcre
)
