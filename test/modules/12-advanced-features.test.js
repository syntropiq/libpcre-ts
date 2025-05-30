import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Advanced PCRE Features', () => {
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

  test('should handle conditional patterns', () => {
    try {
      const regex = pcre.compile('(\\d+)?(?(1)\\s+digits|no digits)');
      const result1 = pcre.exec(regex, '123 digits');
      const result2 = pcre.exec(regex, 'no digits');
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in conditional patterns test:', error);
      throw error;
    }
  });

  test('should handle recursion patterns', () => {
    try {
      // Simple balanced parentheses pattern
      const regex = pcre.compile('\\((?:[^()]|(?R))*\\)');
      const result = pcre.exec(regex, '(a(b)c)');
      expect(result).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in recursion patterns test:', error);
      throw error;
    }
  });

  test('should handle subroutines', () => {
    try {
      const regex = pcre.compile('(abc)\\1');
      const result = pcre.exec(regex, 'abcabc');
      expect(result).toBeTruthy();
      expect(result.value).toBe('abcabc');
    } catch (error) {
      console.error('FATAL ERROR in subroutines test:', error);
      throw error;
    }
  });

  test('should handle callouts', () => {
    try {
      // Basic callout pattern
      const regex = pcre.compile('a(?C)b');
      const result = pcre.exec(regex, 'ab');
      expect(result).toBeTruthy();
      expect(result.value).toBe('ab');
    } catch (error) {
      console.error('FATAL ERROR in callouts test:', error);
      throw error;
    }
  });
});
