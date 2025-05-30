import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Email Validation Patterns', () => {
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

  test('should match basic email addresses', () => {
    try {
      const regex = pcre.compile('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
      expect(regex.exec('user@example.com')).toBeTruthy();
      expect(regex.exec('test.email+tag@domain.org')).toBeTruthy();
      expect(regex.exec('invalid-email')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in basic email addresses test:', error);
      throw error;
    }
  });

  test('should handle international domains', () => {
    try {
      const regex = pcre.compile('[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}');
      expect(regex.exec('user@münchen.de')).toBeTruthy();
      expect(regex.exec('test@xn--n3h.com')).toBeTruthy(); // IDN domain
    } catch (error) {
      console.error('FATAL ERROR in international domains test:', error);
      throw error;
    }
  });

  test('should validate email format strictly', () => {
    try {
      const regex = pcre.compile('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
      expect(regex.exec('valid@example.com')).toBeTruthy();
      expect(regex.exec('not an email')).toBeNull();
      expect(regex.exec('missing@domain')).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in strict email format test:', error);
      throw error;
    }
  });

  test('should handle edge cases', () => {
    try {
      const regex = pcre.compile('[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}');
      expect(regex.exec('a@b.co')).toBeTruthy(); // Minimal valid email
      expect(regex.exec('user+tag@sub.domain.example.com')).toBeTruthy();
    } catch (error) {
      console.error('FATAL ERROR in email edge cases test:', error);
      throw error;
    }
  });
});
