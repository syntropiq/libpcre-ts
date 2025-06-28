import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Quantifiers', () => {
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

  test('should handle plus quantifier', () => {
    try {
      const regex = pcre.compile('a+');
      expect(regex.exec('aaa')).toBeTruthy();
      expect(regex.exec('bbb')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in plus quantifier test:', error);
      throw error;
    }
  });

  test('should handle star quantifier', () => {
    try {
      const regex = pcre.compile('a*');
      expect(regex.exec('aaa')).toBeTruthy();
      expect(regex.exec('bbb')).toBeTruthy(); // * matches zero occurrences
    } catch (error) {
      console.error('FATAL ERROR in star quantifier test:', error);
      throw error;
    }
  });

  test('should handle question mark quantifier', () => {
    try {
      const regex = pcre.compile('colou?r');
      expect(regex.exec('color')).toBeTruthy();
      expect(regex.exec('colour')).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in question mark quantifier test:', error);
      throw error;
    }
  });

  test('should handle specific count quantifiers', () => {
    try {
      const regex = pcre.compile('a{3}');
      expect(regex.exec('aaa')).toBeTruthy();
      expect(regex.exec('aa')).toBeNull();
      expect(regex.exec('aaaa')).toBeTruthy(); // Contains aaa
    } catch (error) {
      console.error('FATAL ERROR in specific count quantifier test:', error);
      throw error;
    }
  });
});
