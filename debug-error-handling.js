// Debug script to test error handling behavior
import { PCRE } from './dist/index.js';

console.log('🔍 Starting error handling diagnostics...\n');

async function testErrorHandling() {
    const pcre = new PCRE();
    await pcre.init();
    
    console.log('1. Testing invalid pattern compilation...');
    try {
        const regex = pcre.compile('[invalid pattern');
        console.log('❌ UNEXPECTED: No error thrown');
    } catch (error) {
        console.log('✓ Error caught');
        console.log('Error type:', typeof error);
        console.log('Error constructor:', error.constructor.name);
        console.log('Error value:', error);
        console.log('Error message property:', error.message);
        console.log('Error toString():', error.toString());
        console.log('Error keys:', Object.keys(error));
        console.log('Error prototype:', Object.getPrototypeOf(error));
        console.log('Is Error instance:', error instanceof Error);
        console.log('---');
    }
    
    console.log('\n2. Testing another invalid pattern...');
    try {
        const regex = pcre.compile('(?P<duplicate>test)(?P<duplicate>test)');
        console.log('❌ UNEXPECTED: No error thrown for duplicate groups');
    } catch (error) {
        console.log('✓ Error caught for duplicate groups');
        console.log('Error type:', typeof error);
        console.log('Error value:', error);
        console.log('Error message:', error.message);
        console.log('---');
    }
    
    console.log('\n3. Testing named group extraction...');
    try {
        const regex = pcre.compile('(?P<test>\\d+)');
        const result = regex.exec('123');
        console.log('Match result:', result);
        const namedGroups = regex.getNamedGroups();
        console.log('Named groups:', namedGroups);
        console.log('---');
    } catch (error) {
        console.log('❌ Error in named group test:', error);
    }
    
    console.log('\n4. Testing edge case: empty optional group...');
    try {
        const regex = pcre.compile('(?P<optional>\\d*)(?P<required>\\d+)');
        const result = regex.exec('123');
        console.log('Match result for "123":', result);
        const namedGroups = regex.getNamedGroups();
        console.log('Named groups mapping:', namedGroups);
        console.log('---');
    } catch (error) {
        console.log('❌ Error in empty group test:', error);
    }
}

testErrorHandling().catch(console.error);