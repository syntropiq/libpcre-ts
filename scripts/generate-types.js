#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy TypeScript definitions
const typesSource = path.join(__dirname, '..', 'types.d.ts');
const typesDest = path.join(distDir, 'libpcre.d.ts');

if (fs.existsSync(typesSource)) {
    fs.copyFileSync(typesSource, typesDest);
    console.log('✅ TypeScript definitions copied to dist/');
} else {
    console.error('❌ types.d.ts not found');
    process.exit(1);
}

// Copy JavaScript wrapper
const jsSource = path.join(__dirname, '..', 'src', 'index.js');
const jsDest = path.join(distDir, 'index.js');

if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsDest);
    console.log('✅ JavaScript wrapper copied to dist/');
} else {
    console.error('❌ src/index.js not found');
    process.exit(1);
}

// Check if WASM files exist (they should already be copied by build.sh)
const wasmFiles = ['libpcre.js', 'libpcre.wasm'];

let wasmFilesFound = 0;
wasmFiles.forEach(file => {
    const distPath = path.join(distDir, file);
    
    if (fs.existsSync(distPath)) {
        console.log(`✅ ${file} found in dist/`);
        wasmFilesFound++;
    } else {
        console.warn(`⚠️  ${file} not found in dist/ - should be copied by build script`);
    }
});

if (wasmFilesFound === wasmFiles.length) {
    console.log('🎉 All files successfully prepared for distribution!');
} else {
    console.log('📝 Some WASM files are missing. Run npm run build first.');
}

// Create a minimal package.json for the dist directory (not needed for scoped packages)
console.log('✅ Distribution preparation complete');
