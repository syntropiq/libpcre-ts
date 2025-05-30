// Automated test for PCRE vs JS RegExp features
import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../dist/index.js';

describe('PCRE vs JS RegExp', () => {
  let pcre;
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should error or not support duplicate named groups in PCRE', () => {
    const pattern = '(?<word>\\w+)-(?<word>\\w+)';
    const input = 'foo-bar';
    let pcreError = false;
    try {
      const regex = pcre.compile(pattern);
      regex.exec(input);
    } catch (e) {
      pcreError = true;
    }
    expect(pcreError).toBe(true);
    expect(() => new RegExp(pattern)).toThrow(/Duplicate capture group name/);
  });

  test('should support conditional patterns in PCRE but not JS', () => {
    const pattern = '(foo)?(?(1)bar|baz)';
    const regex = pcre.compile(pattern);
    expect(regex.exec('foobar')[0].value).toBe('foobar');
    expect(regex.exec('baz')[0].value).toBe('baz');
    expect(() => new RegExp(pattern)).toThrow(/Invalid group/);
  });

  test('should support variable-width lookbehind in PCRE', () => {
    const pattern = '(?<=foo|bar)\\d+';
    const regex = pcre.compile(pattern);
    expect(regex.exec('foo123')[0].value).toBe('123');
    expect(regex.exec('bar456')[0].value).toBe('456');
    expect(regex.exec('baz789')).toBeNull();
  });

  test('should support Unicode properties in PCRE', () => {
    const pattern = '\\p{L}+';
    const regex = pcre.compile(pattern, pcre.constants.UTF8);
    expect(regex.exec('abc αβγ')[0].value).toBe('abc');
  });

  test('should support recursion in PCRE but not JS', () => {
    const pattern = '(\\w+)(?R)?';
    const regex = pcre.compile(pattern);
    expect(regex.exec('abc')[0].value).toBe('abc');
    expect(() => new RegExp(pattern)).toThrow(/Invalid group/);
  });
});
