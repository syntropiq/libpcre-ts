import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Groups and Captures', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should handle capturing groups', () => {
    const regex = pcre.compile('(\\d{4})-(\\d{2})-(\\d{2})');
    const result = regex.exec('Date: 2023-12-25');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(1);
    expect(result[1].value).toBe('2023');
  });

  test('should handle non-capturing groups', () => {
    const regex = pcre.compile('(?:\\d{4})-(\\d{2})-(\\d{2})');
    const result = regex.exec('Date: 2023-12-25');
    expect(result).toBeTruthy();
    expect(result[1].value).toBe('12');
  });

  test('should handle named capturing groups', () => {
    const regex = pcre.compile('(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})');
    const result = regex.exec('Date: 2023-12-25');
    
    expect(result).toBeTruthy();
    const namedGroups = regex.getNamedGroups();
    expect(namedGroups).toHaveProperty('year');
    expect(namedGroups).toHaveProperty('month'); 
    expect(namedGroups).toHaveProperty('day');
  });

  test('should handle nested groups', () => {
    const regex = pcre.compile('((\\w+)\\s+(\\w+))');
    const result = regex.exec('hello world');
    expect(result).toBeTruthy();
    expect(result.length).toBe(4);
  });
});
