import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index';

describe('Lookahead and Lookbehind', () => {
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

  test('should handle positive lookahead', () => {
    try {
      const regex = pcre.compile('foo(?=bar)');
      const result = regex.exec('foobar');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('foo');
    } catch (error) {
      console.error('FATAL ERROR in positive lookahead test:', error);
      throw error;
    }
  });

  test('should handle negative lookahead', () => {
    try {
      const regex = pcre.compile('foo(?!bar)');
      const result1 = regex.exec('foobaz');
      const result2 = regex.exec('foobar');
      
      expect(result1).toBeTruthy();
      expect(result1[0].value).toBe('foo');
      expect(result2).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in negative lookahead test:', error);
      throw error;
    }
  });

  test('should handle positive lookbehind', () => {
    try {
      const regex = pcre.compile('(?<=foo)bar');
      const result = regex.exec('foobar');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('bar');
    } catch (error) {
      console.error('FATAL ERROR in positive lookbehind test:', error);
      throw error;
    }
  });

  test('should handle negative lookbehind', () => {
    try {
      const regex = pcre.compile('(?<!foo)bar');
      const result1 = regex.exec('bazbar');
      const result2 = regex.exec('foobar');
      
      expect(result1).toBeTruthy();
      expect(result1[0].value).toBe('bar');
      expect(result2).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in negative lookbehind test:', error);
      throw error;
    }
  });
});
