# PLAN: ESM/CJS Build Automation for VSCode Compatibility

## Background
The previous issue involved ensuring the libpcre submodule and WASM build process were robust and automated. That work is now complete. However, as a result, we discovered that the ESM/CJS packaging and import handling were not fully compatible with VSCode (especially web), due to:
- Incorrect file extensions for CJS output
- Use of `import.meta.url` in CJS
- Missing or incorrect `browser` and `exports` fields in `package.json`
- Node.js built-ins leaking into web builds

## Current Objective
Automate and future-proof the build process to support both ESM and CJS outputs, ensure compatibility with VSCode (desktop and web), and minimize manual intervention. All steps below relate to this goal.

---

## Steps

1. Analyze current Vite and TypeScript build outputs for CJS/ESM
2. Update Vite/tsc configs for correct file extensions (.cjs/.js)
3. Ensure CJS builds use __dirname, ESM builds use import.meta.url
4. Write post-build Node.js script for:
    - Renaming CJS files to .cjs
    - Replacing import.meta.url with __dirname in .cjs files
    - Patching package.json (browser field, entry points)
5. Update package.json exports for dual ESM/CJS/browser
6. Ensure web build avoids Node.js built-ins
7. Test all build outputs (Node.js, VSCode desktop/web, browser)
8. Document process in README.md and PLAN.md

---

## References
- [VSCode ESM/CJS compatibility issue](https://github.com/microsoft/vscode/issues/130367#issuecomment-2768741248)
- [oniguruma-to-es PR for reference](https://github.com/slevithan/oniguruma-to-es/pull/28)

---

**This plan supersedes previous submodule/WASM build plans, which are now archived below for reference.**
