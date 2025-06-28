import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index.js';

describe('Anchors and Boundaries', () => {
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

  test('should handle start anchor', () => {
    try {
      const regex = pcre.compile('^hello');
      expect(regex.exec('hello world')).toBeTruthy();
      expect(regex.exec('say hello')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in start anchor test:', error);
      throw error;
    }
  });

  test('should handle end anchor', () => {
    try {
      const regex = pcre.compile('world$');
      expect(regex.exec('hello world')).toBeTruthy();
      expect(regex.exec('world peace')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in end anchor test:', error);
      throw error;
    }
  });

  test('should handle word boundaries', () => {
    try {
      const regex = pcre.compile('\\btest\\b');
      expect(regex.exec('test case')).toBeTruthy();
      expect(regex.exec('testing')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in word boundaries test:', error);
      throw error;
    }
  });

  test('should handle multiline mode', () => {
    try {
      const singleLine = pcre.compile('^test');
      const multiLine = pcre.compile('^test', pcre.constants.MULTILINE);
      const input = 'hello\ntest\nworld';
      expect(singleLine.exec(input)).toBeNull();
      expect(multiLine.exec(input)).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in multiline mode test:', error);
      throw error;
    }
  });
});
