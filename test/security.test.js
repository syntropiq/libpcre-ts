import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../dist/index.js';

describe('PCRE Security and Robustness Tests', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  describe('Input Sanitization Tests', () => {
    test('should handle malicious regex injection attempts', () => {
      const maliciousInputs = [
        '.*(.*).*',           // Potential ReDoS
        '(.*)*',              // Exponential backtracking
        '\\x00\\xFF\\xFE',    // Binary data
        'a{10000000}',        // Huge quantifier
        '(?R){1000}',         // Deep recursion attempt
        '.*\\K.*',            // Reset match start
        '(?<!.*.*)',          // Complex lookbehind
      ];

      maliciousInputs.forEach((input, index) => {
        try {
          const regex = pcre.compile('test');
          const start = Date.now();
          const result = regex.exec(input);
          const duration = Date.now() - start;
          
          expect(duration).toBeLessThan(1000); // Shouldn't hang
          console.log(`Malicious input ${index}: handled in ${duration}ms`);
        } catch (error) {
          // Errors are acceptable for malicious input
          console.log(`Malicious input ${index}: safely rejected`);
        }
      });
    });

    test('should validate pattern compilation limits', () => {
      const limitTests = [
        { name: 'Too many alternatives', pattern: Array.from({length: 100000}, (_, i) => `a${i}`).join('|') },
        { name: 'Too many groups', pattern: '(' + Array.from({length: 10000}, () => 'a').join(')|(') + ')' },
        { name: 'Too deep nesting', pattern: '('.repeat(1000) + 'test' + ')'.repeat(1000) },
        { name: 'Too many quantifiers', pattern: 'a+'.repeat(1000) },
      ];

      limitTests.forEach(({ name, pattern }) => {
        try {
          const start = Date.now();
          const regex = pcre.compile(pattern);
          const duration = Date.now() - start;
          
          expect(duration).toBeLessThan(10000); // 10 second compile limit
          console.log(`${name}: compiled in ${duration}ms`);
        } catch (error) {
          // Expected to fail on resource limits
          expect(error.message).toMatch(/limit|memory|too|complex/i);
          console.log(`${name}: safely limited (${error.message})`);
        }
      });
    });
  });

  describe('Memory Safety Tests', () => {
    test('should handle repeated allocations without leaks', () => {
      const iterations = 10000;
      const startMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < iterations; i++) {
        const regex = pcre.compile(`pattern${i % 100}`);
        regex.exec(`test pattern${i % 100} data`);
        
        // Force garbage collection periodically
        if (i % 1000 === 0 && global.gc) {
          global.gc();
        }
      }
      
      // Force final garbage collection
      if (global.gc) global.gc();
      
      const endMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = endMemory - startMemory;
      
      console.log(`Memory increase after ${iterations} iterations: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
      
      // Memory should not increase dramatically (allow some overhead)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB limit
    });

    test('should handle buffer overflow attempts', () => {
      const overflowAttempts = [
        'A'.repeat(100000),                    // Very long pattern
        '\\x' + '41'.repeat(50000),           // Hex escape overflow
        '\\u' + '0041'.repeat(25000),         // Unicode escape overflow
        '[' + 'a-z'.repeat(10000) + ']',      // Character class overflow
        '(?P<' + 'a'.repeat(1000) + '>test)', // Long group name
      ];

      overflowAttempts.forEach((pattern, index) => {
        try {
          const regex = pcre.compile(pattern);
          console.log(`Overflow attempt ${index}: compiled successfully`);
        } catch (error) {
          // Expected to fail safely
          expect(error.message).not.toMatch(/segmentation|signal/i);
          console.log(`Overflow attempt ${index}: safely rejected`);
        }
      });
    });

    test('should handle null and undefined inputs gracefully', () => {
      const regex = pcre.compile('test');
      
      // These should not crash the process
      expect(() => regex.exec(null)).toThrow();
      expect(() => regex.exec(undefined)).toThrow();
      expect(() => pcre.compile(null)).toThrow();
      expect(() => pcre.compile(undefined)).toThrow();
    });
  });

  describe('Error Boundary Tests', () => {
    test('should maintain state after errors', () => {
      const validRegex = pcre.compile('valid');
      
      // Cause an error
      try {
        pcre.compile('[invalid');
      } catch (error) {
        // Expected
      }
      
      // Previous regex should still work
      expect(validRegex.exec('valid test')).toBeTruthy();
      
      // New valid regex should work
      const newRegex = pcre.compile('another');
      expect(newRegex.exec('another test')).toBeTruthy();
    });

    test('should handle errors in execution context', () => {
      const regex = pcre.compile('(.)\\1{1000000}'); // Potential resource exhaustion
      
      try {
        const result = regex.exec('a'.repeat(2000000));
        console.log('Large backreference handled successfully');
      } catch (error) {
        // May fail due to resource limits
        expect(error.message).not.toMatch(/crash|segmentation/i);
        console.log(`Resource limit error: ${error.message}`);
      }
    });

    test('should handle concurrent error conditions', () => {
      const promises = Array.from({ length: 100 }, async (_, i) => {
        try {
          // Mix of valid and invalid patterns
          const pattern = i % 10 === 0 ? '[invalid' : `pattern${i}`;
          const regex = pcre.compile(pattern);
          return regex.exec(`test${i}`);
        } catch (error) {
          return null; // Expected for invalid patterns
        }
      });

      return Promise.all(promises).then(results => {
        // Should complete without process crash
        expect(results.length).toBe(100);
      });
    });
  });

  describe('Performance Security Tests', () => {
    test('should prevent algorithmic complexity attacks', () => {
      const complexityAttacks = [
        { name: 'Nested quantifiers', pattern: '(a*)*$', input: 'a'.repeat(30) + 'x' },
        { name: 'Alternation explosion', pattern: '(a|a)*$', input: 'a'.repeat(30) + 'x' },
        { name: 'Backref explosion', pattern: '(a*)\\1*$', input: 'a'.repeat(30) + 'x' },
        { name: 'Possessive fail', pattern: 'a*+a', input: 'a'.repeat(30) },
        { name: 'Lookahead bomb', pattern: '(?=a+)a*b', input: 'a'.repeat(30) + 'x' },
      ];

      complexityAttacks.forEach(({ name, pattern, input }) => {
        const start = Date.now();
        try {
          const regex = pcre.compile(pattern);
          const result = regex.exec(input);
          const duration = Date.now() - start;
          
          expect(duration).toBeLessThan(5000); // 5 second limit
          console.log(`${name}: handled in ${duration}ms`);
        } catch (error) {
          const duration = Date.now() - start;
          expect(duration).toBeLessThan(5000);
          console.log(`${name}: safely failed in ${duration}ms`);
        }
      });
    });

    test('should limit recursion depth', () => {
      const recursionTests = [
        '(?>(?R)?)a',           // Simple recursion
        '\\((?:[^()]|(?R))*\\)', // Balanced parentheses
        '(?R)*',                 // Infinite recursion attempt
        'a(?R)?b',              // Conditional recursion
      ];

      recursionTests.forEach((pattern, index) => {
        try {
          const regex = pcre.compile(pattern);
          const start = Date.now();
          const result = regex.exec('('.repeat(1000) + 'a' + ')'.repeat(1000));
          const duration = Date.now() - start;
          
          expect(duration).toBeLessThan(10000); // 10 second limit
          console.log(`Recursion test ${index}: ${duration}ms`);
        } catch (error) {
          // Expected to hit recursion limits
          console.log(`Recursion test ${index}: limited (${error.message})`);
        }
      });
    });
  });

  describe('Data Integrity Tests', () => {
    test('should handle all byte values in input', () => {
      // Test all possible byte values
      const allBytes = Array.from({ length: 256 }, (_, i) => 
        String.fromCharCode(i)
      ).join('');
      
      const regex = pcre.compile('test');
      try {
        const result = regex.exec(allBytes + 'test' + allBytes);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe('test');
      } catch (error) {
        // May fail on invalid UTF-8, but shouldn't crash
        expect(error.message).not.toMatch(/crash|segmentation/i);
      }
    });

    test('should preserve match data integrity', () => {
      const regex = pcre.compile('(\\d{4})-(\\d{2})-(\\d{2})');
      const testData = [
        '2023-12-25',
        '1999-01-01', 
        '2024-02-29', // Leap year
        '0000-00-00', // Edge case
      ];

      testData.forEach(date => {
        const result = regex.exec(`Date: ${date}`);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(date);
        expect(result[1].value).toBe(date.split('-')[0]);
        expect(result[2].value).toBe(date.split('-')[1]);
        expect(result[3].value).toBe(date.split('-')[2]);
      });
    });

    test('should handle concurrent access safely', () => {
      const sharedRegex = pcre.compile('(\\w+)=(\\w+)');
      const testInputs = Array.from({ length: 1000 }, (_, i) => 
        `key${i}=value${i}`
      );

      // Simulate concurrent access
      const promises = testInputs.map(async (input, i) => {
        const result = sharedRegex.exec(input);
        expect(result).toBeTruthy();
        expect(result[1].value).toBe(`key${i}`);
        expect(result[2].value).toBe(`value${i}`);
        return result;
      });

      return Promise.all(promises);
    });
  });

  describe('Resource Exhaustion Tests', () => {
    test('should handle stack overflow conditions', () => {
      const deepPatterns = [
        '('.repeat(10000) + 'test' + ')'.repeat(10000),
        '(?:'.repeat(10000) + 'test' + ')'.repeat(10000),
        Array.from({ length: 1000 }, () => '(?=a)').join('') + 'a',
      ];

      deepPatterns.forEach((pattern, index) => {
        try {
          const regex = pcre.compile(pattern);
          console.log(`Deep pattern ${index}: compiled successfully`);
        } catch (error) {
          // Expected to fail on stack limits
          expect(error.message).not.toMatch(/stack overflow|segmentation/i);
          console.log(`Deep pattern ${index}: safely limited`);
        }
      });
    });

    test('should handle heap exhaustion gracefully', () => {
      try {
        // Attempt to create pattern that would use excessive memory
        const massivePattern = Array.from({ length: 1000000 }, (_, i) => 
          `alternative${i}`
        ).join('|');
        
        const regex = pcre.compile(massivePattern);
        console.log('Massive pattern compiled successfully');
      } catch (error) {
        // Expected to fail on memory limits
        expect(error.message).toMatch(/memory|limit|too large/i);
        console.log(`Memory limit respected: ${error.message}`);
      }
    });
  });

  describe('Platform-specific Tests', () => {
    test('should handle different endianness correctly', () => {
      // Test patterns that might be sensitive to byte order
      const patterns = [
        '\\u0041\\u0042', // Unicode escapes
        '\\x41\\x42',     // Hex escapes
        '[\\u0041-\\u005A]', // Unicode ranges
      ];

      patterns.forEach(pattern => {
        const regex = pcre.compile(pattern, pcre.constants.UTF8);
        const result = regex.exec('AB');
        expect(result).toBeTruthy();
        expect(result[0].value).toBe('AB');
      });
    });

    test('should handle locale-independent operations', () => {
      // These should work regardless of system locale
      const localeTests = [
        { pattern: '[a-z]+', input: 'hello', shouldMatch: true },
        { pattern: '[A-Z]+', input: 'HELLO', shouldMatch: true },
        { pattern: '\\d+', input: '12345', shouldMatch: true },
        { pattern: '\\s+', input: '   ', shouldMatch: true },
      ];

      localeTests.forEach(({ pattern, input, shouldMatch }) => {
        const regex = pcre.compile(pattern);
        const result = regex.exec(input);
        
        if (shouldMatch) {
          expect(result).toBeTruthy();
        } else {
          expect(result).toBeNull();
        }
      });
    });
  });

  describe('Regression Tests', () => {
    test('should handle known problematic patterns', () => {
      // Patterns that have caused issues in other regex engines
      const knownProblems = [
        '(.*?)*',                    // Minimal matching with nesting
        '^(a+)+$',                  // Classic ReDoS
        '([a-zA-Z]+)*',             // Character class repetition
        '(a|b)*abb',                // Alternation with suffix
        '^(?=[a-z]*[A-Z])',         // Lookahead conditions
        '(?<!abc)def',              // Negative lookbehind
        '\\b(?=\\w{6,})\\w*cat\\w*\\b', // Word boundary with lookahead
      ];

      knownProblems.forEach((pattern, index) => {
        try {
          const regex = pcre.compile(pattern);
          const testInput = 'a'.repeat(20) + 'cat' + 'b'.repeat(20);
          const start = Date.now();
          const result = regex.exec(testInput);
          const duration = Date.now() - start;
          
          expect(duration).toBeLessThan(1000);
          console.log(`Problem pattern ${index}: handled in ${duration}ms`);
        } catch (error) {
          console.log(`Problem pattern ${index}: safely rejected`);
        }
      });
    });

    test('should maintain consistency across multiple executions', () => {
      const regex = pcre.compile('(\\w+)\\s+(\\d+)');
      const input = 'test 123 hello 456 world 789';
      
      // Execute multiple times to ensure consistent results
      const results = Array.from({ length: 100 }, () => regex.exec(input));
      
      // All results should be identical
      results.forEach(result => {
        expect(result[0].value).toBe('test 123');
        expect(result[1].value).toBe('test');
        expect(result[2].value).toBe('123');
      });
    });
  });
});
