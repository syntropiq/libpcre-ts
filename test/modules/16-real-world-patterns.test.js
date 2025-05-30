import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Real-world Patterns', () => {
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

  test('should validate phone numbers', () => {
    try {
      const regex = pcre.compile('\\+?[1-9]\\d{1,14}');
      
      const result1 = pcre.exec(regex, '+1234567890');
      const result2 = pcre.exec(regex, '1234567890');
      const result3 = pcre.exec(regex, 'invalid');
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in phone validation test:', error);
      throw error;
    }
  });

  test('should validate URLs', () => {
    try {
      const regex = pcre.compile('https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$');
      
      const result1 = pcre.exec(regex, 'https://example.com');
      const result2 = pcre.exec(regex, 'http://sub.example.com/path');
      const result3 = pcre.exec(regex, 'invalid-url');
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in URL validation test:', error);
      throw error;
    }
  });

  test('should parse CSV data', () => {
    try {
      const regex = pcre.compile('(?:^|,)("(?:[^"]+|"")*"|[^,]*)');
      const csvLine = 'John,Doe,"123 Main St, Apt 4","New York, NY"';
      
      const results = pcre.quickMatch('(?:^|,)("(?:[^"]+|"")*"|[^,]*)', csvLine);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('FATAL ERROR in CSV parsing test:', error);
      throw error;
    }
  });

  test('should validate credit card numbers', () => {
    try {
      const regex = pcre.compile('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$');
      
      const result1 = pcre.exec(regex, '4111111111111111');
      const result2 = pcre.exec(regex, '5555555555554444');
      const result3 = pcre.exec(regex, '1234567890123456');
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeNull();
    } catch (error) {
      console.error('FATAL ERROR in credit card validation test:', error);
      throw error;
    }
  });
});
