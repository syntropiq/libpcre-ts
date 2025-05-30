import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Email Validation Patterns', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should match basic email addresses', () => {
    const regex = pcre.compile('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    
    expect(regex.exec('user@example.com')).toBeTruthy();
    expect(regex.exec('test.email+tag@domain.org')).toBeTruthy();
    expect(regex.exec('invalid-email')).toBeNull();
  });

  test('should handle international domains', () => {
    const regex = pcre.compile('[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}');
    
    expect(regex.exec('user@münchen.de')).toBeTruthy();
    expect(regex.exec('test@xn--n3h.com')).toBeTruthy(); // IDN domain
  });

  test('should validate email format strictly', () => {
    const regex = pcre.compile('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    
    expect(regex.exec('valid@example.com')).toBeTruthy();
    expect(regex.exec('not an email')).toBeNull();
    expect(regex.exec('missing@domain')).toBeNull();
  });

  test('should handle edge cases', () => {
    const regex = pcre.compile('[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}');
    
    expect(regex.exec('a@b.co')).toBeTruthy(); // Minimal valid email
    expect(regex.exec('user+tag@sub.domain.example.com')).toBeTruthy();
  });
});
