import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Anchors and Boundaries', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should handle start anchor', () => {
    const regex = pcre.compile('^hello');
    expect(regex.exec('hello world')).toBeTruthy();
    expect(regex.exec('say hello')).toBeNull();
  });

  test('should handle end anchor', () => {
    const regex = pcre.compile('world$');
    expect(regex.exec('hello world')).toBeTruthy();
    expect(regex.exec('world peace')).toBeNull();
  });

  test('should handle word boundaries', () => {
    const regex = pcre.compile('\\btest\\b');
    expect(regex.exec('test case')).toBeTruthy();
    expect(regex.exec('testing')).toBeNull();
  });

  test('should handle multiline mode', () => {
    const singleLine = pcre.compile('^test');
    const multiLine = pcre.compile('^test', pcre.constants.MULTILINE);
    const input = 'hello\ntest\nworld';
    
    expect(singleLine.exec(input)).toBeNull();
    expect(multiLine.exec(input)).toBeTruthy();
  });
});
