# Dual ESM/CJS Build & Submodule Plan for @syntropiq/libpcre-ts

## Overview
This plan describes how to add dual ESM and CommonJS (CJS) support to the package, improve submodule handling, and keep changes minimal and well-confined to the build system and configuration. The goal is to maximize compatibility with Node.js, VSCode, and browser environments, while maintaining a clean and maintainable codebase.

---

## 1. Dual ESM/CJS Build Output

### Why?
- Enables both ESM and CJS consumers (Node.js, VSCode, bundlers, etc.) to use the library without hacks.
- Future-proofs for VSCode web and other environments.
- Solves the specific issue with VSCode web extensions trying to use this library.

### What to Change?
- Output both ESM and CJS builds (e.g., to `dist/esm/` and `dist/cjs/`).
- Update `package.json` to use conditional exports for ESM and CJS entry points.
- Update build scripts to build both formats. This will involve ensuring the ES6 WASM module (libpcre-npm.js) is correctly imported by both the ESM and CJS wrapper code. For CJS, this will likely require using dynamic `import()`.

---

## 2. Submodule Handling

### Why?
- Ensures all dependencies (e.g., PCRE source from the libpcre submodule) are present before building, especially in CI or fresh clones.
- The project relies on the libpcre git submodule, which needs to be properly initialized before building.

### What to Change?
- Add a script to recursively initialize and update git submodules.
- Call this script at the start of the build process.
- Ensure the build fails gracefully if submodules are not properly initialized.

---

## 3. Minimal, Confined Changes
- No changes to library code (since there is no Node.js-specific code).
- Only touch build scripts, output structure, and `package.json`.
- Ensure WebAssembly build process remains intact and functional.

---

## 4. Steps Summary

1. Add a script to initialize submodules and ensure they are properly set up before building.
2. Add TypeScript configs for both ESM and CJS outputs.
3. Modify the build script to generate both ESM and CJS versions of the package.
4. Update directory structure to output to `dist/esm/` and `dist/cjs/`.
5. Update `package.json` with `exports`, `main`, and `module` fields.
6. Update the type definitions handling to work with dual output.
7. Document the changes and usage in the README.

---

## 5. What’s Next?
- Follow the TODO.md for step-by-step implementation.
- When ready, update the README and test the new build outputs in both ESM and CJS environments.
