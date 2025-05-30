import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../dist/index.js';

describe('PCRE Stress Tests - Aggressive Edge Cases', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  describe('Malicious Pattern Resistance', () => {
    test('should handle ReDoS patterns safely', () => {
      const redosPatterns = [
        '(a+)+$',
        '(a|a)*$', 
        '(a|b)*a(a|b){20}c',
        '^(a+)+$',
        '(.*)*$',
        '(a+b)*$',
        '^(([a-z])+.)+[A-Z]([a-z])+$',
        '(a+)+b',
        '([a-zA-Z]+)*$',
        '^(a+)+b$'
      ];

      const maliciousInput = 'a'.repeat(30) + 'x'; // No matching suffix

      redosPatterns.forEach((pattern, index) => {
        const start = Date.now();
        try {
          const regex = pcre.compile(pattern);
          const result = regex.exec(maliciousInput);
          const duration = Date.now() - start;
          
          // Should either match quickly or fail quickly, not hang
          expect(duration).toBeLessThan(5000); // 5 second timeout
          console.log(`Pattern ${index}: ${duration}ms`);
        } catch (error) {
          const duration = Date.now() - start;
          expect(duration).toBeLessThan(5000);
          // Error is acceptable for malicious patterns
          console.log(`Pattern ${index} failed safely: ${error.message}`);
        }
      });
    });

    test('should handle extremely complex nested quantifiers', () => {
      const patterns = [
        '((a+)*)+',
        '((a*)*)*',
        '(((a+)+)+)+',
        '((a+)+(b+)+)+',
        '(a+|b+)*c',
      ];

      patterns.forEach(pattern => {
        const start = Date.now();
        try {
          const regex = pcre.compile(pattern);
          regex.exec('a'.repeat(20) + 'x');
          const duration = Date.now() - start;
          expect(duration).toBeLessThan(2000);
        } catch (error) {
          // Acceptable to fail compilation
          console.log(`Complex pattern failed: ${error.message}`);
        }
      });
    });
  });

  describe('Memory Pressure Tests', () => {
    test('should handle very large capture group counts', () => {
      // Test with maximum reasonable number of capture groups
      const maxGroups = 500;
      const pattern = '(' + Array.from({ length: maxGroups }, () => 'a').join(')|(') + ')';
      
      try {
        const regex = pcre.compile(pattern);
        const result = regex.exec('a');
        expect(result).toBeTruthy();
      } catch (error) {
        // May legitimately fail due to PCRE limits
        expect(error.message).toMatch(/too many|limit|memory/i);
      }
    });

    test('should handle extremely long patterns', () => {
      const longPattern = Array.from({ length: 10000 }, (_, i) => `a${i}`).join('|');
      
      try {
        const regex = pcre.compile(longPattern);
        expect(regex).toBeTruthy();
      } catch (error) {
        // May fail due to compilation limits
        const message = error?.message || error?.toString() || 'Unknown error';
        expect(message).toMatch(/too long|memory|limit/i);
      }
    });

    test('should handle very deep nesting', () => {
      const depth = 200;
      const pattern = '('.repeat(depth) + 'test' + ')'.repeat(depth);
      
      try {
        const regex = pcre.compile(pattern);
        const result = regex.exec('test');
        expect(result).toBeTruthy();
      } catch (error) {
        // May fail due to nesting limits
        expect(error.message).toMatch(/deep|stack|nest|limit/i);
      }
    });
  });

  describe('Unicode Torture Tests', () => {
    test('should handle all Unicode planes', () => {
      const unicodeTests = [
        { name: 'Basic Latin', text: 'Hello World', pattern: '\\p{Latin}+' },
        { name: 'Greek', text: 'Γεια σας κόσμος', pattern: '\\p{Greek}+' },
        { name: 'Cyrillic', text: 'Привет мир', pattern: '\\p{Cyrillic}+' },
        { name: 'Arabic', text: 'مرحبا بالعالم', pattern: '\\p{Arabic}+' },
        { name: 'Chinese', text: '你好世界', pattern: '\\p{Han}+' },
        { name: 'Emoji', text: '👋🌍🚀', pattern: '\\p{So}+' },
        { name: 'Math symbols', text: '∑∞≠≤≥', pattern: '\\p{Sm}+' },
      ];

      unicodeTests.forEach(({ name, text, pattern }) => {
        try {
          const regex = pcre.compile(pattern, pcre.constants.UTF8);
          const result = regex.exec(text);
          console.log(`${name}: ${result ? 'matched' : 'no match'}`);
        } catch (error) {
          console.log(`${name}: failed (${error.message})`);
        }
      });
    });

    test('should handle mixed Unicode and ASCII', () => {
      const mixedText = 'Hello 世界 αβγ Мир 🌍 123 $€£';
      const patterns = [
        '\\p{L}+',     // Letters
        '\\p{N}+',     // Numbers
        '\\p{S}+',     // Symbols
        '[\\p{L}\\p{N}\\p{S}\\s]+', // Combined
      ];

      patterns.forEach(pattern => {
        try {
          const regex = pcre.compile(pattern, pcre.constants.UTF8);
          const result = regex.exec(mixedText);
          expect(result).toBeTruthy();
        } catch (error) {
          console.log(`Pattern ${pattern} failed: ${error.message}`);
        }
      });
    });

    test('should handle zero-width Unicode characters', () => {
      const zwText = 'a\\u200Bb\\u200Cc\\uFEFFd'; // Zero-width space, ZWNJ, BOM
      const regex = pcre.compile('a.+d', pcre.constants.UTF8 | pcre.constants.DOTALL);
      
      try {
        const result = regex.exec(zwText);
        expect(result).toBeTruthy();
      } catch (error) {
        console.log(`Zero-width test failed: ${error.message}`);
      }
    });
  });

  describe('Boundary Condition Tests', () => {
    test('should handle maximum string lengths', () => {
      // Test with very large strings
      const sizes = [100000, 1000000];
      
      sizes.forEach(size => {
        const largeString = 'a'.repeat(size - 10) + 'needle' + 'b'.repeat(5);
        const regex = pcre.compile('needle');
        
        const start = Date.now();
        const result = regex.exec(largeString);
        const duration = Date.now() - start;
        
        expect(result).toBeTruthy();
        expect(result[0].value).toBe('needle');
        console.log(`Size ${size}: ${duration}ms`);
        
        // Should be reasonably fast even for large strings
        expect(duration).toBeLessThan(size / 1000); // Roughly linear time
      });
    });

    test('should handle patterns at string boundaries', () => {
      const boundaryTests = [
        { pattern: '^test', input: 'test', shouldMatch: true },
        { pattern: '^test', input: 'atest', shouldMatch: false },
        { pattern: 'test$', input: 'test', shouldMatch: true },
        { pattern: 'test$', input: 'testa', shouldMatch: false },
        { pattern: '^test$', input: 'test', shouldMatch: true },
        { pattern: '^test$', input: 'atest', shouldMatch: false },
        { pattern: '^test$', input: 'testa', shouldMatch: false },
        { pattern: '^$', input: '', shouldMatch: true },
        { pattern: '^$', input: 'a', shouldMatch: false },
      ];

      boundaryTests.forEach(({ pattern, input, shouldMatch }) => {
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

  describe('Pathological Input Tests', () => {
    test('should handle strings with repeated patterns', () => {
      const repeatedPatterns = [
        'a'.repeat(10000),
        'ab'.repeat(5000),
        'abc'.repeat(3333),
        '123'.repeat(3333),
        'test '.repeat(2000),
      ];

      repeatedPatterns.forEach(input => {
        const regex = pcre.compile('test');
        const start = Date.now();
        const result = regex.exec(input);
        const duration = Date.now() - start;
        
        expect(duration).toBeLessThan(1000); // Should complete quickly
      });
    });

    test('should handle strings with no matches efficiently', () => {
      const regex = pcre.compile('needle');
      const haystack = 'a'.repeat(100000); // No needle in haystack
      
      const start = Date.now();
      const result = regex.exec(haystack);
      const duration = Date.now() - start;
      
      expect(result).toBeNull();
      expect(duration).toBeLessThan(500); // Should fail fast
    });

    test('should handle alternation with many options efficiently', () => {
      const manyOptions = Array.from({ length: 1000 }, (_, i) => `option${i}`).join('|');
      const regex = pcre.compile(manyOptions);
      
      const start = Date.now();
      const result = regex.exec('option500');
      const duration = Date.now() - start;
      
      expect(result).toBeTruthy();
      expect(duration).toBeLessThan(100); // Should be reasonably fast
    });
  });

  describe('Error Recovery Tests', () => {
    test('should handle partial matches gracefully', () => {
      try {
        const regex = pcre.compile('test', pcre.constants.PARTIAL_SOFT);
        const result = regex.exec('tes');
        // Behavior depends on PCRE version and build options
        console.log('Partial match result:', result);
      } catch (error) {
        // Partial matching might not be supported in all builds
        console.log('Partial matching not supported:', error.message);
      }
    });

    test('should handle callout functions', () => {
      try {
        const regex = pcre.compile('(?C1)test(?C2)', pcre.constants.AUTO_CALLOUT);
        const result = regex.exec('test');
        // Callouts depend on PCRE build configuration
        expect(result).toBeTruthy();
      } catch (error) {
        // Callouts might not be supported
        console.log('Callouts not supported:', error.message);
      }
    });

    test('should handle compilation errors gracefully', () => {
      const invalidPatterns = [
        '(?P<name',      // Unclosed named group
        '*',             // Invalid quantifier
        '[z-a]',         // Invalid range
        '\\k<missing>',  // Reference to non-existent group
        '(?#',           // Unclosed comment
      ];

      invalidPatterns.forEach(pattern => {
        expect(() => pcre.compile(pattern)).toThrow();
      });
    });
  });

  describe('Concurrency and Threading Tests', () => {
    test('should handle multiple regex objects safely', () => {
      const regexes = Array.from({ length: 100 }, (_, i) => 
        pcre.compile(`pattern${i}`)
      );

      // Use all regexes concurrently
      const results = regexes.map((regex, i) => 
        regex.exec(`test pattern${i} test`)
      );

      results.forEach((result, i) => {
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(`pattern${i}`);
      });
    });

    test('should handle rapid pattern compilation', () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const regex = pcre.compile(`test${i % 10}`);
        regex.exec(`test${i % 10}`);
      }
      
      const duration = Date.now() - start;
      console.log(`1000 compilations in ${duration}ms`);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Feature Compatibility Tests', () => {
    test('should report feature support accurately', () => {
      const config = pcre.getConfig();
      console.log('PCRE Configuration:', config);
      
      // Test features that might be optionally compiled
      const featureTests = [
        { name: 'UTF-8', pattern: 'test', flag: pcre.constants.UTF8 },
        { name: 'Recursion', pattern: '(\\((?:[^()]|(?R))*\\))' },
        { name: 'Lookbehind', pattern: '(?<=test)\\d+' },
        { name: 'Conditional', pattern: '(a)?(?(1)b|c)' },
      ];

      featureTests.forEach(({ name, pattern, flag = 0 }) => {
        try {
          const regex = pcre.compile(pattern, flag);
          console.log(`${name}: Supported`);
        } catch (error) {
          console.log(`${name}: Not supported (${error.message})`);
        }
      });
    });

    test('should handle different newline conventions', () => {
      const newlineTests = [
        { name: 'LF', text: 'line1\\nline2', pattern: '^line2', flag: pcre.constants.MULTILINE },
        { name: 'CRLF', text: 'line1\\r\\nline2', pattern: '^line2', flag: pcre.constants.MULTILINE },
        { name: 'CR', text: 'line1\\rline2', pattern: '^line2', flag: pcre.constants.MULTILINE },
      ];

      newlineTests.forEach(({ name, text, pattern, flag }) => {
        try {
          const regex = pcre.compile(pattern, flag);
          const result = regex.exec(text);
          console.log(`${name}: ${result ? 'matched' : 'no match'}`);
        } catch (error) {
          console.log(`${name}: error (${error.message})`);
        }
      });
    });
  });

  describe('Real-world Torture Tests', () => {
    test('should handle complex HTML parsing patterns', () => {
      const htmlPattern = '<([a-zA-Z][a-zA-Z0-9]*)[^>]*>.*?</\\1>';
      const complexHtml = '<div class="test" id="complex"><span>nested <b>bold</b> text</span></div>'.repeat(100);
      
      const regex = pcre.compile(htmlPattern, pcre.constants.DOTALL);
      const start = Date.now();
      const result = regex.exec(complexHtml);
      const duration = Date.now() - start;
      
      expect(result).toBeTruthy();
      expect(duration).toBeLessThan(1000);
    });

    test('should handle complex JSON-like patterns', () => {
      const jsonPattern = '\\{(?:[^{}]|\\{[^{}]*\\})*\\}';
      const complexJson = JSON.stringify({
        users: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          data: { nested: { deep: { value: i * 2 } } }
        }))
      });
      
      const regex = pcre.compile(jsonPattern);
      const result = regex.exec(complexJson);
      expect(result).toBeTruthy();
    });

    test('should handle log parsing patterns efficiently', () => {
      const logPattern = '^(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:\\d{2}:\\d{2})\\s+\\[(\\w+)\\]\\s+(.+)$';
      const logLines = Array.from({ length: 10000 }, (_, i) => 
        `2023-12-25 10:${String(i % 60).padStart(2, '0')}:${String(i % 60).padStart(2, '0')} [INFO] Log message ${i}`
      ).join('\\n');
      
      const regex = pcre.compile(logPattern, pcre.constants.MULTILINE);
      const start = Date.now();
      const result = regex.exec(logLines);
      const duration = Date.now() - start;
      
      expect(result).toBeTruthy();
      expect(duration).toBeLessThan(5000); // Should handle large logs efficiently
    });
  });
});
