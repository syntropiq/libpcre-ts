# TODO for ESM/CJS Build Automation

- [ ] Analyze current Vite and TypeScript build outputs for CJS/ESM
- [ ] Update Vite/tsc configs for correct file extensions (.cjs/.js)
- [ ] Ensure CJS builds use __dirname, ESM builds use import.meta.url
- [ ] Write post-build Node.js script for:
    - [ ] Renaming CJS files to .cjs
    - [ ] Replacing import.meta.url with __dirname in .cjs files
    - [ ] Patching package.json (browser field, entry points)
- [ ] Update package.json exports for dual ESM/CJS/browser
- [ ] Ensure web build avoids Node.js built-ins
- [ ] Test all build outputs (Node.js, VSCode desktop/web, browser)
- [ ] Document process in README.md and PLAN.md

---

## Background
The previous submodule/WASM build issue is now resolved. The current focus is on ESM/CJS packaging and VSCode compatibility, which became apparent after the WASM build was automated. All steps below relate to the new packaging and compatibility requirements.

---

**Each step should be committed separately for clarity.**
