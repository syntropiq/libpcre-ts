import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Quick Methods Integration', () => {
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

  test('should work with match method (first match only)', () => {
    try {
      const results = pcre.match('\\d+', '123 456 789');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].value).toBe('123');
    } catch (error) {
      console.error('FATAL ERROR in match test:', error);
      throw error;
    }
  });

  test('should work with globalMatch method (all matches)', () => {
    try {
      const regex = pcre.compile('\\d+');
      const results = regex.globalMatch('123 456 789');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(3);
      expect(results[0][0].value).toBe('123');
      expect(results[1][0].value).toBe('456');
      expect(results[2][0].value).toBe('789');
    } catch (error) {
      console.error('FATAL ERROR in globalMatch test:', error);
      throw error;
    }
  });

  test('should work with test method', () => {
    try {
      const result1 = pcre.test('\\d+', '123');
      const result2 = pcre.test('\\d+', 'abc');
      
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    } catch (error) {
      console.error('FATAL ERROR in test test:', error);
      throw error;
    }
  });

  test('should work with replace method', () => {
    try {
      const regex = pcre.compile('\\d+');
      const result = regex.replace('123 456', 'X', true);
      expect(result).toBe('X X');
    } catch (error) {
      console.error('FATAL ERROR in replace test:', error);
      throw error;
    }
  });
});
