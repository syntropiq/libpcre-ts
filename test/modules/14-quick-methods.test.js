import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

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

  test('should work with quickMatch method', () => {
    try {
      const results = pcre.quickMatch('\\d+', '123 456 789');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(3);
      expect(results[0].value).toBe('123');
      expect(results[1].value).toBe('456');
      expect(results[2].value).toBe('789');
    } catch (error) {
      console.error('FATAL ERROR in quickMatch test:', error);
      throw error;
    }
  });

  test('should work with quickTest method', () => {
    try {
      const result1 = pcre.quickTest('\\d+', '123');
      const result2 = pcre.quickTest('\\d+', 'abc');
      
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    } catch (error) {
      console.error('FATAL ERROR in quickTest test:', error);
      throw error;
    }
  });

  test('should work with quickReplace method', () => {
    try {
      const result = pcre.quickReplace('\\d+', 'X', '123 456');
      expect(result).toBe('X X');
    } catch (error) {
      console.error('FATAL ERROR in quickReplace test:', error);
      throw error;
    }
  });

  test('should work with quickSplit method', () => {
    try {
      const result = pcre.quickSplit('\\s+', 'one two three');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toBe('one');
      expect(result[1]).toBe('two');
      expect(result[2]).toBe('three');
    } catch (error) {
      console.error('FATAL ERROR in quickSplit test:', error);
      throw error;
    }
  });
});
