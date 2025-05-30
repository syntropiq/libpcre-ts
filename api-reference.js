import { PCRE } from './dist/index.js';

const pcre = new PCRE();
await pcre.init();

console.log('=== PCRE API REFERENCE ===');
console.log('Available methods:', Object.getOwnPropertyNames(pcre).filter(name => typeof pcre[name] === 'function'));
console.log('Available constants:', Object.keys(pcre.constants || {}));

// Test basic compilation and execution
const regex = pcre.compile('test');
console.log('Compiled regex type:', typeof regex);
console.log('Regex methods:', Object.getOwnPropertyNames(regex).filter(name => typeof regex[name] === 'function'));

const result = regex.exec('testing');
console.log('Result type:', typeof result);
console.log('Result:', result);
