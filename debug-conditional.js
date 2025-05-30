import { PCRE } from './dist/index.js';

const pcre = new PCRE();
await pcre.init();

const regex = pcre.compile('(foo)?(?(1)bar|baz)');

console.log('foobar:', regex.exec('foobar'));
console.log('baz:', regex.exec('baz'));
console.log('foobaz:', regex.exec('foobaz'));
