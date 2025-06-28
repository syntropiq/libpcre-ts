import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Character Classes', () => {
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

  test('should handle digit character class', () => {
    try {
      const regex = pcre.compile('\\d+');
      const result = regex.exec('test123test');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('123');
    } catch (error) {
      console.error('FATAL ERROR in digit character class test:', error);
      throw error;
    }
  });

  test('should handle word character class', () => {
    try {
      const regex = pcre.compile('\\w+');
      const result = regex.exec('hello-world!');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('hello');
    } catch (error) {
      console.error('FATAL ERROR in word character class test:', error);
      throw error;
    }
  });

  test('should handle whitespace character class', () => {
    try {
      const regex = pcre.compile('\\s+');
      const result = regex.exec('hello\t\n world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('\t\n ');
    } catch (error) {
      console.error('FATAL ERROR in whitespace character class test:', error);
      throw error;
    }
  });

  test('should handle custom character classes', () => {
    try {
      const regex = pcre.compile('[a-z]+');
      const result = regex.exec('Hello World');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('ello');
    } catch (error) {
      console.error('FATAL ERROR in custom character class test:', error);
      throw error;
    }
  });
});
