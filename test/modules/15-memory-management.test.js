import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

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
      const results = patterns.map((pattern, i) => 
        pcre.exec(pattern, `test${i}`)
      );
      
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
        const result = pcre.exec(regex, '123');
        expect(result).toBeTruthy();
        expect(result.value).toBe('123');
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
      
      const result1 = pcre.exec(regex1, '123abc');
      const result2 = pcre.exec(regex2, '123abc');
      
      expect(result1.value).toBe('123');
      expect(result2.value).toBe('abc');
    } catch (error) {
      console.error('FATAL ERROR in concurrent usage test:', error);
      throw error;
    }
  });

  test('should handle large number of executions', () => {
    try {
      const regex = pcre.compile('test');
      
      for (let i = 0; i < 1000; i++) {
        const result = pcre.exec(regex, 'test string');
        expect(result).toBeTruthy();
        expect(result.value).toBe('test');
      }
    } catch (error) {
      console.error('FATAL ERROR in large executions test:', error);
      throw error;
    }
  });
});
