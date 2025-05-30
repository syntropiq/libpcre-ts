import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Unicode Support', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should handle UTF-8 strings', () => {
    const regex = pcre.compile('café');
    const result = regex.exec('I love café');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('café');
  });

  test('should handle Unicode property escapes', () => {
    const regex = pcre.compile('\\p{L}+'); // Unicode letters
    const result = regex.exec('Hello мир 世界');
    expect(result).toBeTruthy();
  });

  test('should handle emoji', () => {
    const regex = pcre.compile('😀');
    const result = regex.exec('Hello 😀 world');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('😀');
  });

  test('should handle mixed Unicode and ASCII', () => {
    const regex = pcre.compile('[a-z\\p{L}]+');
    const result = regex.exec('test测试тест');
    expect(result).toBeTruthy();
  });
});
