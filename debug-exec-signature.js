// Debug script to validate PCRERegex.exec signature issue
import { PCRE } from './dist/index.js';

async function debugExecSignature() {
    console.log('🔍 Debugging PCRERegex.exec signature...');
    
    try {
        const pcre = new PCRE();
        await pcre.init();
        console.log('✅ PCRE module initialized successfully');
        
        const regex = pcre.compile('test');
        console.log('✅ Pattern compiled successfully');
        console.log('📋 regex.exec function signature:', regex.exec.toString());
        
        // Test calling exec with 1 argument (current test approach)
        console.log('\n🧪 Testing exec with 1 argument...');
        try {
            const result1 = regex.exec('test string');
            console.log('✅ exec(string) worked:', result1);
        } catch (error) {
            console.error('❌ exec(string) failed:', error.message);
        }
        
        // Test calling exec with 2 arguments (expected by WASM)
        console.log('\n🧪 Testing exec with 2 arguments...');
        try {
            const result2 = regex.exec('test string', 0);
            console.log('✅ exec(string, offset) worked:', result2);
        } catch (error) {
            console.error('❌ exec(string, offset) failed:', error.message);
        }
        
        // Test calling exec with different offset
        console.log('\n🧪 Testing exec with different offset...');
        try {
            const result3 = regex.exec('test string', 5);
            console.log('✅ exec(string, 5) worked:', result3);
        } catch (error) {
            console.error('❌ exec(string, 5) failed:', error.message);
        }
        
    } catch (error) {
        console.error('💥 Initialization failed:', error);
    }
}

debugExecSignature();