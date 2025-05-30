#!/usr/bin/env node

const PCRE = require('./build/libpcre.js');

async function testPCRE() {
    try {
        console.log('Loading PCRE WebAssembly module...');
        const pcre = await PCRE();
        console.log('✓ PCRE module loaded successfully');
        
        console.log('\n=== Testing PCRE Version ===');
        console.log('PCRE version:', pcre.getVersionString());
        
        console.log('\n=== Testing Quick Functions ===');
        
        // Test quick test function
        const hasMatch = pcre.quickTest('[a-z]+', 'hello world', 0);
        console.log('quickTest("[a-z]+", "hello world", 0):', hasMatch);
        
        // Test quick match function
        const match = pcre.quickMatch('[a-z]+', 'hello world', 0);
        console.log('quickMatch("[a-z]+", "hello world", 0):', match);
        
        console.log('\n=== Testing PCRERegex Class ===');
        
        // Create a regex object
        const regex = new pcre.PCRERegex('[a-z]+', 0);
        console.log('✓ Created PCRERegex object');
        
        // Test execution
        const result = regex.exec('hello world', 0);
        console.log('regex.exec("hello world", 0):', result);
        
        // Test with capture groups
        const regex2 = new pcre.PCRERegex('([a-z]+)\\s+([a-z]+)', 0);
        console.log('✓ Created regex with capture groups');
        
        const result2 = regex2.exec('hello world', 0);
        console.log('regex.exec("hello world", 0) with groups:', result2);
        
        // Test case insensitive
        const regex3 = new pcre.PCRERegex('[a-z]+', pcre.PCRE_CASELESS);
        console.log('✓ Created case insensitive regex');
        
        const result3 = regex3.exec('HELLO world', 0);
        console.log('case insensitive match:', result3);
        
        // Clean up
        regex.delete();
        regex2.delete();
        regex3.delete();
        
        console.log('\n✓ All tests completed successfully!');
        
    } catch (err) {
        console.error('✗ Error:', err.message);
        console.error(err.stack);
    }
}

testPCRE();
