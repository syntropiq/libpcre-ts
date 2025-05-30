import { PCRE } from './dist/index.js';

const pcre = new PCRE();
await pcre.init();

const invalidPatterns = [
  '([abc',        // Unclosed group
  '*abc',         // Invalid quantifier
  '(?P<>test)',   // Empty group name
  '\\k<missing>', // Reference to non-existent group
  '(?-)',         // Invalid flag
  '(?#',          // Unclosed comment
  '\\Q',          // Unclosed quote
];

invalidPatterns.forEach(pattern => {
  try {
    const regex = pcre.compile(pattern);
    console.log(`${pattern}: compiled successfully (unexpected)`);
  } catch (error) {
    console.log(`${pattern}: failed as expected`);
  }
});
