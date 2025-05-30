import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Character Classes', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should handle digit character class', () => {
    const regex = pcre.compile('\\d+');
    const result = regex.exec('test123test');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('123');
  });

  test('should handle word character class', () => {
    const regex = pcre.compile('\\w+');
    const result = regex.exec('hello-world!');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('hello');
  });

  test('should handle whitespace character class', () => {
    const regex = pcre.compile('\\s+');
    const result = regex.exec('hello\t\n world');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('\t\n ');
  });

  test('should handle custom character classes', () => {
    const regex = pcre.compile('[a-z]+');
    const result = regex.exec('Hello World');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('ello');
  });
});
