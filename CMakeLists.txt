cmake_minimum_required(VERSION 3.16)
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

# Create a wrapper library that will be compiled to WebAssembly
add_executable(pcre-wasm
    # Our wrapper source files
    wasm-wrapper.cpp
)

# Link all PCRE libraries into our WebAssembly module
target_link_libraries(pcre-wasm 
    pcre 
    pcreposix
    pcre16
    pcre32
)

set(EMSCRIPTEN_ENV "web,webview,worker,node")
set(OUTPUT_NAME "libpcre-npm")

if ($ENV{EXPORT_CJS})
    set(EXPORT_ES6 0)
else()
    set(EXPORT_ES6 1)
endif()

set(EMSCRIPTEN_LINK_FLAGS
    "-sEXPORT_ES6=${EXPORT_ES6}"
    "-sMODULARIZE=1"
    "-sENVIRONMENT=${EMSCRIPTEN_ENV}"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sINITIAL_MEMORY=16MB"
    "-sMAXIMUM_MEMORY=2GB"
    "-sSTACK_SIZE=1MB"
    "-sEXPORTED_RUNTIME_METHODS=[\"ccall\",\"cwrap\",\"getValue\",\"setValue\",\"UTF8ToString\",\"stringToUTF8\",\"allocate\",\"ALLOC_NORMAL\"]"
    "-sEXPORTED_FUNCTIONS=[\"_malloc\",\"_free\"]"
    "-sEXPORT_NAME=createPCREModule"
    "-sFORCE_FILESYSTEM=0"
    "-sNO_EXIT_RUNTIME=1"
    "-sASSERTIONS=1"
    "-sNO_DISABLE_EXCEPTION_CATCHING"
    "-sSINGLE_FILE=1"
    "--bind"
)

if ($ENV{EXPORT_CJS})
    set(SUFFIX "cjs")
else()
    set(SUFFIX "js")
endif()

# Set target properties for the WASM output
set_target_properties(pcre-wasm PROPERTIES
    OUTPUT_NAME "${OUTPUT_NAME}"
    SUFFIX ".${SUFFIX}"
)

# Add link options for Emscripten
target_link_options(pcre-wasm PRIVATE ${EMSCRIPTEN_LINK_FLAGS})

# Include directories for our wrapper
target_include_directories(pcre-wasm PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/libpcre
    ${CMAKE_CURRENT_BINARY_DIR}/libpcre
)
