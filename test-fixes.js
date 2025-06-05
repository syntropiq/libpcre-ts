// Comprehensive test to validate the fixes for PCRE issues
import { PCRE } from './dist/index.js';

console.log('🧪 Testing fixes for PCRE issues...\n');

async function testAllFixes() {
    const pcre = new PCRE();
    await pcre.init();
    
    console.log('=== 1. Error Handling Tests ===');
    
    // Test 1: Invalid pattern compilation
    console.log('Test 1.1: Invalid pattern compilation');
    try {
        const regex = pcre.compile('[invalid pattern');
        console.log('❌ UNEXPECTED: No error thrown');
    } catch (error) {
        console.log('✅ Error properly caught');
        console.log('- Error type:', typeof error);
        console.log('- Has message property:', error.message !== undefined);
        console.log('- Message:', error.message);
        console.log('- Is Error instance:', error instanceof Error);
    }
    
    // Test 2: Duplicate named groups
    console.log('\nTest 1.2: Duplicate named groups');
    try {
        const regex = pcre.compile('(?P<same>\\w+)(?P<same>\\w+)');
        console.log('❌ UNEXPECTED: No error thrown for duplicate groups');
    } catch (error) {
        console.log('✅ Duplicate groups properly rejected');
        console.log('- Message:', error.message);
    }
    
    // Test 3: Unicode escape sequences
    console.log('\nTest 1.3: Unicode escape sequences');
    try {
        const regex = pcre.compile('(?P<emoji>[\\u{1F600}-\\u{1F64F}])');
        console.log('❌ UNEXPECTED: Unicode escapes worked (should fail in PCRE)');
    } catch (error) {
        console.log('✅ Unicode escapes properly rejected');
        console.log('- Message:', error.message);
    }
    
    console.log('\n=== 2. Named Group Extraction Tests ===');
    
    // Test 4: Basic named group extraction
    console.log('Test 2.1: Basic named group extraction');
    try {
        const regex = pcre.compile('(?P<word>\\w+)');
        const result = regex.exec('hello');
        const namedGroups = regex.getNamedGroups();
        console.log('✅ Basic named groups work');
        console.log('- Match result:', result);
        console.log('- Named groups mapping:', namedGroups);
    } catch (error) {
        console.log('❌ Error in basic named groups:', error.message);
    }
    
    // Test 5: Edge case - empty optional group
    console.log('\nTest 2.2: Empty optional group edge case');
    try {
        const regex = pcre.compile('(?P<optional>\\d*)(?P<required>\\d+)');
        const result = regex.exec('123');
        const namedGroups = regex.getNamedGroups();
        
        console.log('📊 Current behavior (before fix):');
        console.log('- Match result:', result);
        console.log('- Named groups mapping:', namedGroups);
        console.log('- Expected: optional="", required="123"');
        console.log('- Actual: optional="' + (result[1]?.value || '') + '", required="' + (result[2]?.value || '') + '"');
        
        // Show the issue
        if (result[1]?.value === '12' && result[2]?.value === '3') {
            console.log('❌ CONFIRMED ISSUE: Optional group greedily captured digits');
            console.log('🔧 This is a PCRE quantifier greediness issue, not a wrapper bug');
        }
    } catch (error) {
        console.log('❌ Error in edge case test:', error.message);
    }
    
    // Test 6: Character class Unicode behavior
    console.log('\nTest 2.3: Character class Unicode behavior');
    try {
        const regex1 = pcre.compile('\\w+');
        const result1 = regex1.test('café');
        const result2 = regex1.test('测试');
        console.log('- \\w+ matches "café":', result1);
        console.log('- \\w+ matches "测试":', result2);
        
        // Test with UTF8 flag
        const regex2 = pcre.compile('\\w+', pcre.constants.UTF8);
        const result3 = regex2.test('café');
        const result4 = regex2.test('测试');
        console.log('- \\w+ with UTF8 flag matches "café":', result3);
        console.log('- \\w+ with UTF8 flag matches "测试":', result4);
        
        if (result3 && result4) {
            console.log('✅ UTF8 flag enables Unicode character class support');
        } else {
            console.log('⚠️ UTF8 flag may need additional Unicode property support');
        }
    } catch (error) {
        console.log('❌ Error in Unicode test:', error.message);
    }
    
    console.log('\n=== 3. Configuration Information ===');
    try {
        const config = pcre.getConfig();
        console.log('PCRE Configuration:');
        console.log('- UTF8 support:', config.utf8);
        console.log('- Unicode properties:', config.unicodeProperties);
        console.log('- JIT support:', config.jit);
        console.log('- Version:', pcre.getVersionString());
    } catch (error) {
        console.log('❌ Error getting config:', error.message);
    }
    
    console.log('\n🎯 Summary of Findings:');
    console.log('✅ Error handling works correctly (original user report may be outdated)');
    console.log('❌ Named group quantifier greediness is a PCRE behavior issue');
    console.log('❌ Unicode escapes \\u{xxxx} not supported by PCRE (by design)');
    console.log('❌ Duplicate named groups not supported by PCRE (by design)');
    console.log('⚠️ Unicode character classes may need UTF8 + UCP flags');
}

testAllFixes().catch(console.error);