import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Error Handling and Edge Cases', () => {
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

  test('should handle invalid regex patterns', () => {
    try {
      expect(() => {
        pcre.compile('[invalid');
      }).toThrow();
    } catch (error) {
      console.error('FATAL ERROR in invalid regex test:', error);
      throw error;
    }
  });

  test('should handle empty patterns', () => {
    try {
      const regex = pcre.compile('');
      const result = pcre.exec(regex, 'test');
      expect(result).toBeTruthy();
      expect(result.value).toBe('');
    } catch (error) {
      console.error('FATAL ERROR in empty patterns test:', error);
      throw error;
    }
  });

  test('should handle null and undefined inputs', () => {
    try {
      const regex = pcre.compile('test');
      
      expect(() => {
        pcre.exec(regex, null);
      }).toThrow();
      
      expect(() => {
        pcre.exec(regex, undefined);
      }).toThrow();
    } catch (error) {
      console.error('FATAL ERROR in null/undefined inputs test:', error);
      throw error;
    }
  });

  test('should handle very long strings', () => {
    try {
      const regex = pcre.compile('test');
      const longString = 'a'.repeat(10000) + 'test' + 'b'.repeat(10000);
      const result = pcre.exec(regex, longString);
      expect(result).toBeTruthy();
      expect(result.value).toBe('test');
    } catch (error) {
      console.error('FATAL ERROR in long strings test:', error);
      throw error;
    }
  });
});
