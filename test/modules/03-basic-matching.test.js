import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Basic Pattern Matching', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should match simple strings', () => {
    const regex = pcre.compile('hello');
    const result = regex.exec('hello world');
    expect(result).toBeTruthy();
    expect(result[0].value).toBe('hello');
  });

  test('should return null for non-matches', () => {
    const regex = pcre.compile('xyz');
    const result = regex.exec('hello world');
    expect(result).toBeNull();
  });

  test('should handle case sensitivity', () => {
    const caseSensitive = pcre.compile('Hello');
    const caseInsensitive = pcre.compile('Hello', pcre.constants.CASELESS);
    
    expect(caseSensitive.exec('hello')).toBeNull();
    expect(caseInsensitive.exec('hello')).toBeTruthy();
  });

  test('should provide match details', () => {
    const regex = pcre.compile('world');
    const result = regex.exec('hello world');
    expect(result[0]).toHaveProperty('value');
    expect(result[0]).toHaveProperty('index');
    expect(result[0]).toHaveProperty('length');
    expect(result[0].index).toBe(6);
  });
});
