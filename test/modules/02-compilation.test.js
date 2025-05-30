import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Basic Pattern Compilation', () => {
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

  test('should compile simple patterns', () => {
    try {
      const regex = pcre.compile('hello');
      expect(regex).toBeTruthy();
      expect(typeof regex.exec).toBe('function');
    } catch (error) {
      console.error('FATAL ERROR in simple patterns test:', error);
      throw error;
    }
  });

  test('should handle empty patterns', () => {
    try {
      const regex = pcre.compile('');
      expect(regex).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in empty patterns test:', error);
      throw error;
    }
  });

  test('should reject invalid patterns', () => {
    try {
      expect(() => pcre.compile('[')).toThrow();
      expect(() => pcre.compile('(?P<>invalid)')).toThrow();
    } catch (error) {
      console.error('FATAL ERROR in invalid patterns test:', error);
      throw error;
    }
  });

  test('should handle patterns with flags', () => {
    try {
      const regex = pcre.compile('test', pcre.constants.CASELESS);
      expect(regex).toBeTruthy();
      expect(regex.exec('TEST')).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in patterns with flags test:', error);
      throw error;
    }
  });
});
