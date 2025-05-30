import { PCRE } from './dist/index.js';

const pcre = new PCRE();
await pcre.init();

const citationPattern = '(\\d+)\\s+([A-Z][a-z.\\s]+)\\s+(\\d+)';
const regex = pcre.compile(citationPattern);

const testCases = [
  '123 F.3d 456',
  '789 U.S. 012', 
  '456 Cal. App. 2d 789'
];

testCases.forEach(citation => {
  const result = regex.exec(citation);
  console.log(`${citation}:`, result);
});
