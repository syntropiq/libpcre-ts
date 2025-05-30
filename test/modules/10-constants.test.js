import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('PCRE Constants', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should expose all PCRE option constants', () => {
    const constants = pcre.constants;
    
    // Check key option constants
    expect(typeof constants.CASELESS).toBe('number');
    expect(typeof constants.MULTILINE).toBe('number');
    expect(typeof constants.DOTALL).toBe('number');
    expect(typeof constants.UTF8).toBe('number');
    expect(typeof constants.EXTENDED).toBe('number');
  });

  test('should expose PCRE error constants', () => {
    const constants = pcre.constants;
    
    // Check error constants
    expect(typeof constants.ERROR_NOMATCH).toBe('number');
    expect(typeof constants.ERROR_NOMEMORY).toBe('number');
    expect(typeof constants.ERROR_BADUTF8).toBe('number');
  });

  test('should have consistent constant values', () => {
    const constants = pcre.constants;
    
    // Constants should be non-negative numbers
    expect(constants.CASELESS).toBeGreaterThanOrEqual(0);
    expect(constants.MULTILINE).toBeGreaterThanOrEqual(0);
    expect(constants.DOTALL).toBeGreaterThanOrEqual(0);
  });

  test('should expose exec option constants', () => {
    const constants = pcre.constants;
    
    // Check exec option constants that should exist
    expect(typeof constants.ANCHORED).toBe('number');
    expect(typeof constants.NOTBOL).toBe('number');
    expect(typeof constants.NOTEOL).toBe('number');
  });
});
