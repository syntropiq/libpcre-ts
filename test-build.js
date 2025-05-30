#!/usr/bin/env node

const PCRE = require('./build/libpcre.js');

async function test() {
    try {
        console.log('Loading PCRE WebAssembly module...');
        const pcre = await PCRE();
        console.log('✓ PCRE module loaded successfully');
        
        // Test that our PCRE class exists
        if (pcre.PCRE) {
            console.log('✓ PCRE class is available');
            
            // Try to create a simple regex
            try {
                const regex = new pcre.PCRE('[a-z]+', 0);
                console.log('✓ Successfully created regex object');
                
                // Test a simple match
                const result = regex.exec('hello world', 0);
                console.log('✓ Regex execution completed');
                console.log('Match result:', result);
                
                regex.delete(); // Clean up
                console.log('✓ All tests passed!');
            } catch (err) {
                console.error('✗ Error testing regex:', err.message);
            }
        } else {
            console.error('✗ PCRE class not found in module');
        }
    } catch (err) {
        console.error('✗ Failed to load PCRE module:', err.message);
    }
}

test();
