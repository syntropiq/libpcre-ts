import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index';

describe('PCRE Constants', () => {
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

  test('should expose all PCRE option constants', () => {
    try {
      const constants = pcre.constants;
      // Check key option constants
      expect(typeof constants.CASELESS).toBe('number');
      expect(typeof constants.MULTILINE).toBe('number');
      expect(typeof constants.DOTALL).toBe('number');
      expect(typeof constants.UTF8).toBe('number');
      expect(typeof constants.EXTENDED).toBe('number');
    } catch (error) {
      console.error('FATAL ERROR in option constants test:', error);
      throw error;
    }
  });

  test('should expose PCRE error constants', () => {
    try {
      const constants = pcre.constants;
      // Check error constants
      expect(typeof constants.ERROR_NOMATCH).toBe('number');
      expect(typeof constants.ERROR_NOMEMORY).toBe('number');
      expect(typeof constants.ERROR_BADUTF8).toBe('number');
    } catch (error) {
      console.error('FATAL ERROR in error constants test:', error);
      throw error;
    }
  });

  test('should have consistent constant values', () => {
    try {
      const constants = pcre.constants;
      // Constants should be non-negative numbers
      expect(constants.CASELESS).toBeGreaterThanOrEqual(0);
      expect(constants.MULTILINE).toBeGreaterThanOrEqual(0);
      expect(constants.DOTALL).toBeGreaterThanOrEqual(0);
    } catch (error) {
      console.error('FATAL ERROR in constant values test:', error);
      throw error;
    }
  });

  test('should expose exec option constants', () => {
    try {
      const constants = pcre.constants;
      // Check exec option constants that should exist
      expect(typeof constants.ANCHORED).toBe('number');
      expect(typeof constants.NOTBOL).toBe('number');
      expect(typeof constants.NOTEOL).toBe('number');
    } catch (error) {
      console.error('FATAL ERROR in exec option constants test:', error);
      throw error;
    }
  });
});
