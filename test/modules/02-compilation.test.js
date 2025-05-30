import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Basic Pattern Compilation', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should compile simple patterns', () => {
    const regex = pcre.compile('hello');
    expect(regex).toBeTruthy();
    expect(typeof regex.exec).toBe('function');
  });

  test('should handle empty patterns', () => {
    const regex = pcre.compile('');
    expect(regex).toBeTruthy();
  });

  test('should reject invalid patterns', () => {
    expect(() => pcre.compile('[')).toThrow();
    expect(() => pcre.compile('(?P<>invalid)')).toThrow();
  });

  test('should handle patterns with flags', () => {
    const regex = pcre.compile('test', pcre.constants.CASELESS);
    expect(regex).toBeTruthy();
    expect(regex.exec('TEST')).toBeTruthy();
  });
});
