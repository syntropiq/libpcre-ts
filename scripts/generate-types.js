#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy type definitions
const typesSource = path.join(__dirname, '..', 'types.d.ts');
const typesDest = path.join(distDir, 'libpcre.d.ts');

if (fs.existsSync(typesSource)) {
    fs.copyFileSync(typesSource, typesDest);
    console.log('✅ TypeScript definitions copied to dist/');
} else {
    console.error('❌ types.d.ts not found');
    process.exit(1);
}

// Copy JavaScript implementation
const jsSource = path.join(__dirname, '..', 'src', 'index.js');
const jsDest = path.join(distDir, 'index.js');

if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsDest);
    console.log('✅ JavaScript implementation copied to dist/');
} else {
    console.error('❌ src/index.js not found');
    process.exit(1);
}

// Check if WASM files exist from build
const wasmFiles = ['libpcre.js', 'libpcre.wasm'];
const buildDir = path.join(__dirname, '..', 'build');

let wasmFilesFound = 0;
wasmFiles.forEach(file => {
    const sourcePath = path.join(buildDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ ${file} copied to dist/`);
        wasmFilesFound++;
    } else {
        console.warn(`⚠️  ${file} not found in build/ - you may need to run the build first`);
    }
});

if (wasmFilesFound === wasmFiles.length) {
    console.log('🎉 All files successfully prepared for distribution!');
} else {
    console.log('📝 Some WASM files are missing. Run npm run build:wasm first.');
}

// Create a package.json for the dist directory
const packageInfo = {
    "name": "libpcre-ts",
    "version": "1.0.0",
    "description": "WebAssembly build of libpcre with TypeScript bindings",
    "main": "index.js",
    "types": "libpcre.d.ts",
    "files": ["*.js", "*.wasm", "*.d.ts"],
    "keywords": ["pcre", "regex", "webassembly", "wasm", "typescript"]
};

fs.writeFileSync(
    path.join(distDir, 'package.json'), 
    JSON.stringify(packageInfo, null, 2)
);

console.log('✅ Distribution package.json created');
