import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Basic Pattern Matching', () => {
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

  test('should match simple strings', () => {
    try {
      const regex = pcre.compile('hello');
      const result = regex.exec('hello world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('hello');
    } catch (error) {
      console.error('FATAL ERROR in match simple strings test:', error);
      throw error;
    }
  });

  test('should return null for non-matches', () => {
    try {
      const regex = pcre.compile('xyz');
      const result = regex.exec('hello world');
      expect(result).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in non-matches test:', error);
      throw error;
    }
  });

  test('should handle case sensitivity', () => {
    try {
      const caseSensitive = pcre.compile('Hello');
      const caseInsensitive = pcre.compile('Hello', pcre.constants.CASELESS);
      expect(caseSensitive.exec('hello')).toBeNull();
      expect(caseInsensitive.exec('hello')).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in case sensitivity test:', error);
      throw error;
    }
  });

  test('should provide match details', () => {
    try {
      const regex = pcre.compile('world');
      const result = regex.exec('hello world');
      expect(result[0]).toHaveProperty('value');
      expect(result[0]).toHaveProperty('index');
      expect(result[0]).toHaveProperty('length');
      expect(result[0].index).toBe(6);
    } catch (error) {
      console.error('FATAL ERROR in match details test:', error);
      throw error;
    }
  });
});
