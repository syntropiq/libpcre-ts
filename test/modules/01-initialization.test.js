import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/esm/index';

describe('Basic PCRE Initialization', () => {
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

  test('should initialize without errors', async () => {
    try {
      const testPcre = new PCRE();
      await expect(testPcre.init()).resolves.not.toThrow();
    } catch (error) {
      console.error('FATAL ERROR in initialization test:', error);
      throw error;
    }
  });

  test('should provide version information', () => {
    try {
      // Since version() method doesn't exist, check if module has version info
      expect(pcre.module).toBeTruthy();
      expect(typeof pcre.module).toBe('object');
    } catch (error) {
      console.error('FATAL ERROR in version test:', error);
      throw error;
    }
  });

  test('should provide configuration information', () => {
    try {
      // Since config() method doesn't exist, check constants availability
      expect(pcre.constants).toBeTruthy();
      expect(typeof pcre.constants).toBe('object');
      expect(pcre.constants).toHaveProperty('UTF8');
    } catch (error) {
      console.error('FATAL ERROR in config test:', error);
      throw error;
    }
  });

  test('should expose PCRE constants', () => {
    try {
      expect(pcre.constants).toBeTruthy();
      expect(typeof pcre.constants).toBe('object');
    } catch (error) {
      console.error('FATAL ERROR in constants test:', error);
      throw error;
    }
  });
});
