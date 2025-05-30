import { PCRE } from './dist/index.js';

const pcre = new PCRE();
await pcre.init();

const phonePattern = '\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}';
const regex = pcre.compile(phonePattern);

const testCases = [
  '(555) 123-4567',
  '555-123-4567', 
  '555.123.4567',
  '5551234567'
];

testCases.forEach(phone => {
  const result = regex.exec(phone);
  console.log(`${phone}:`, result);
});
