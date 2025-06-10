# TODO for ESM/CJS Build Automation

- [ ] Refactor any source code that uses import.meta.url or __dirname to use a runtime helper for environment detection.
- [ ] Ensure Vite config outputs .cjs for CJS and .js for ESM (done).
- [ ] Remove or ignore dist/cjs/index.js for CJS consumers; use only index.cjs.
- [ ] Update scripts (e.g., generate-types.js) to reference index.cjs for CJS, not index.js.
- [ ] Ensure package.json points to the correct entry points for all environments.
- [ ] Only add post-build scripts if a true edge case is found.
- [ ] Ensure web build avoids Node.js built-ins
- [ ] Test all build outputs (Node.js, VSCode desktop/web, browser)
- [ ] Document process in README.md and PLAN.md

---

## Background
The previous submodule/WASM build issue is now resolved. The current focus is on ESM/CJS packaging and VSCode compatibility, which became apparent after the WASM build was automated. All steps below relate to the new packaging and compatibility requirements.

---

**Each step should be committed separately for clarity.**
