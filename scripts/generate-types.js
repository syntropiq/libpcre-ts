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

// Compile and copy TypeScript wrapper
const tsSource = path.join(__dirname, '..', 'src', 'index.ts');
const jsDest = path.join(distDir, 'index.js');

if (fs.existsSync(tsSource)) {
    // First, copy the WASM file to src directory temporarily for compilation
    const wasmSrc = path.join(distDir, 'libpcre-npm.js');
    const wasmTempDest = path.join(__dirname, '..', 'src', 'libpcre-npm.js');
    
    try {
        const { execSync } = await import('child_process');
        
        // Copy WASM file temporarily to src for compilation
        if (fs.existsSync(wasmSrc)) {
            fs.copyFileSync(wasmSrc, wasmTempDest);
        }
        
        // Use TypeScript compiler to compile the file directly and generate type definitions
        console.log('🔨 Compiling TypeScript wrapper and generating type definitions...');
        
        // Use tsc with specific configuration for this single file, generating declarations
        const tscCommand = `npx tsc "${tsSource}" --outDir "${distDir}" --target ES2020 --module ESNext --moduleResolution node --allowSyntheticDefaultImports --esModuleInterop --skipLibCheck --allowJs --noEmitOnError false --declaration --declarationMap`;
        execSync(tscCommand, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
        
        // Clean up temporary file
        if (fs.existsSync(wasmTempDest)) {
            fs.unlinkSync(wasmTempDest);
        }
        
        // Rename the generated .d.ts file to libpcre.d.ts for consistency
        const generatedDts = path.join(distDir, 'index.d.ts');
        const finalDts = path.join(distDir, 'libpcre.d.ts');
        if (fs.existsSync(generatedDts)) {
            fs.renameSync(generatedDts, finalDts);
            console.log('✅ TypeScript wrapper compiled and type definitions generated');
        } else {
            throw new Error('Type definitions were not generated');
        }
    } catch (error) {
        console.warn('⚠️  TypeScript compilation failed, copying source file...');
        console.warn('Error:', error.message);
        
        // Clean up temporary file if it exists
        if (fs.existsSync(wasmTempDest)) {
            fs.unlinkSync(wasmTempDest);
        }
        
        // Fallback: just copy the TypeScript file as .js (for development)
        fs.copyFileSync(tsSource, jsDest);
        console.log('✅ TypeScript wrapper copied to dist/ (as fallback)');
    }
} else {
    console.error('❌ src/index.ts not found');
    process.exit(1);
}

// Check if WASM files exist (they should already be copied by build.sh)
const wasmFiles = ['libpcre-npm.js']; // Single file with embedded WASM

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
