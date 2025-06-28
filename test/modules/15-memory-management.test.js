import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Memory and Resource Management', () => {
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

  test('should handle multiple pattern compilations', () => {
    try {
      const patterns = [];
      for (let i = 0; i < 100; i++) {
        patterns.push(pcre.compile(`test${i}`));
      }
      // Test that all patterns work
      const results = patterns.map((pattern, i) => pattern.exec(`test${i}`));
      expect(results.every(result => result !== null)).toBe(true);
    } catch (error) {
      console.error('FATAL ERROR in multiple compilations test:', error);
      throw error;
    }
  });

  test('should handle rapid pattern creation and destruction', () => {
    try {
      for (let i = 0; i < 50; i++) {
        const regex = pcre.compile('\\d+');
        const result = regex.exec('123');
        expect(result).toBeTruthy();
        expect(result[0].value).toBe('123');
      }
    } catch (error) {
      console.error('FATAL ERROR in rapid creation/destruction test:', error);
      throw error;
    }
  });

  test('should handle concurrent pattern usage', () => {
    try {
      const regex1 = pcre.compile('\\d+');
      const regex2 = pcre.compile('[a-z]+');
      const result1 = regex1.exec('123abc');
      const result2 = regex2.exec('123abc');
      expect(result1[0].value).toBe('123');
      expect(result2[0].value).toBe('abc');
    } catch (error) {
      console.error('FATAL ERROR in concurrent usage test:', error);
      throw error;
    }
  });

  test('should handle large number of executions', () => {
    try {
      const regex = pcre.compile('test');
      for (let i = 0; i < 1000; i++) {
        const result = regex.exec('test string');
        expect(result).toBeTruthy();
        expect(result[0].value).toBe('test');
      }
    } catch (error) {
      console.error('FATAL ERROR in large executions test:', error);
      throw error;
    }
  });
});
