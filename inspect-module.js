#!/usr/bin/env node

import PCRE from './build/libpcre.js';

async function inspect() {
    try {
        console.log('Loading PCRE WebAssembly module...');
        const pcre = await PCRE();
        console.log('✓ PCRE module loaded successfully');
        
        console.log('\nAvailable properties:');
        Object.keys(pcre).forEach(key => {
            console.log(`  ${key}: ${typeof pcre[key]}`);
        });
        
        console.log('\nTesting ccall availability:');
        if (pcre.ccall) {
            console.log('✓ ccall is available');
            try {
                const version = pcre.ccall('pcre_version', 'string', [], []);
                console.log('PCRE version:', version);
            } catch (err) {
                console.log('Error calling pcre_version:', err.message);
            }
        }
        
    } catch (err) {
        console.error('✗ Failed to load PCRE module:', err.message);
    }
}

inspect();
