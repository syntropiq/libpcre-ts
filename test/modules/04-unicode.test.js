import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Unicode Support', () => {
  let pcre;
  
  beforeAll(async () => {
    try {
      pcre = new PCRE();
      await pcre.init();
    } catch (error) {
      console.error('FATAL: Failed to initialize PCRE:', error);
      throw error;
    }
  });

  test('should handle UTF-8 strings', () => {
    try {
      const regex = pcre.compile('café');
      const result = regex.exec('I love café');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('café');
    } catch (error) {
      console.error('FATAL ERROR in UTF-8 strings test:', error);
      throw error;
    }
  });

  test('should handle Unicode property escapes', () => {
    try {
      const regex = pcre.compile('\\p{L}+'); // Unicode letters
      const result = regex.exec('Hello мир 世界');
      expect(result).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in Unicode property escapes test:', error);
      throw error;
    }
  });

  test('should handle emoji', () => {
    try {
      const regex = pcre.compile('😀');
      const result = regex.exec('Hello 😀 world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('😀');
    } catch (error) {
      console.error('FATAL ERROR in emoji test:', error);
      throw error;
    }
  });

  test('should handle mixed Unicode and ASCII', () => {
    try {
      const regex = pcre.compile('[a-z\\p{L}]+');
      const result = regex.exec('test测试тест');
      expect(result).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in mixed Unicode/ASCII test:', error);
      throw error;
    }
  });
});
